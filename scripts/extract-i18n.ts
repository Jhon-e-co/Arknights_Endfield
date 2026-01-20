import { Project, Node, SyntaxKind, JsxElement, JsxSelfClosingElement, StringLiteral } from 'ts-morph';
import { glob } from 'glob';
import { join, relative, dirname } from 'path';
import { writeFileSync } from 'fs';
import { createHash } from 'crypto';

// 存储提取的文本
interface ExtractedText {
  text: string;
  filePath: string;
  line: number;
  key: string;
}

class I18nExtractor {
  private project: Project;
  private extractedTexts: ExtractedText[] = [];
  private usedKeys = new Set<string>();

  constructor() {
    // 初始化TypeScript项目
    this.project = new Project({
      skipAddingFilesFromTsConfig: true,
    });
  }

  /**
   * 生成基于文件路径的前缀
   */
  private generatePrefixFromPath(filePath: string): string {
    // 获取相对于项目根目录的路径
    const relativePath = relative(process.cwd(), filePath);
    
    // 移除文件扩展名
    const pathWithoutExt = relativePath.replace(/\.[^/.]+$/, '');
    
    // 将路径转换为点分隔的格式
    // app/[locale]/page.tsx -> app.page
    // components/ui/button.tsx -> components.ui.button
    const normalizedPath = pathWithoutExt
      .replace(/\[.*?\]/g, '') // 移除动态路由段如[locale]
      .replace(/\\/g, '/') // 统一使用正斜杠
      .split('/')
      .filter(Boolean)
      .join('.');
    
    return normalizedPath;
  }

  /**
   * 生成基于内容的键名
   */
  private generateKeyFromText(text: string): string {
    // 移除HTML标签和特殊字符
    const cleanText = text
      .replace(/<[^>]*>/g, '') // 移除HTML标签
      .replace(/[^\w\s]/g, ' ') // 将非字母数字字符替换为空格
      .trim();
    
    // 转换为snake_case
    const snakeCase = cleanText
      .replace(/\s+/g, '_') // 空格替换为下划线
      .replace(/([A-Z])/g, '_$1') // 大写字母前加下划线
      .replace(/^_+|_+$/g, '') // 移除开头和结尾的下划线
      .toLowerCase();
    
    // 如果文本太长，使用hash作为键名
    if (snakeCase.length > 50) {
      return createHash('md5').update(text).digest('hex').substring(0, 8);
    }
    
    return snakeCase;
  }

  /**
   * 生成完整的键名
   */
  private generateFullKey(filePath: string, text: string): string {
    const prefix = this.generatePrefixFromPath(filePath);
    const suffix = this.generateKeyFromText(text);
    const fullKey = `${prefix}.${suffix}`;
    
    // 确保键名唯一
    let uniqueKey = fullKey;
    let counter = 1;
    
    while (this.usedKeys.has(uniqueKey)) {
      uniqueKey = `${fullKey}_${counter}`;
      counter++;
    }
    
    this.usedKeys.add(uniqueKey);
    return uniqueKey;
  }

  /**
   * 检查字符串是否应该被提取
   */
  private shouldExtractText(text: string): boolean {
    // 过滤掉太短的文本
    if (text.trim().length < 2) {
      return false;
    }
    
    // 过滤掉纯数字或特殊字符
    if (!/[a-zA-Z]/.test(text)) {
      return false;
    }
    
    // 过滤掉变量引用
    if (text.includes('{') && text.includes('}')) {
      return false;
    }
    
    // 过滤掉已经翻译过的文本（包含t(或useTranslations）
    if (text.includes('t(') || text.includes('useTranslations')) {
      return false;
    }
    
    return true;
  }

  /**
   * 从JSX元素中提取文本
   */
  private extractFromJsxElement(node: JsxElement): void {
    const children = node.getChildren();
    
    for (const child of children) {
      if (Node.isStringLiteral(child)) {
        const text = child.getLiteralValue();
        if (typeof text === 'string' && this.shouldExtractText(text)) {
          const filePath = node.getSourceFile().getFilePath();
          const line = child.getStartLineNumber();
          const key = this.generateFullKey(filePath, text);
          
          this.extractedTexts.push({
            text,
            filePath,
            line,
            key,
          });
        }
      } else if (Node.isJsxElement(child)) {
        this.extractFromJsxElement(child);
      }
    }
  }

  /**
   * 从JSX属性中提取文本
   */
  private extractFromJsxAttributes(node: JsxElement | JsxSelfClosingElement): void {
    let attributes;
    
    if (Node.isJsxElement(node)) {
      attributes = node.getOpeningElement().getAttributes();
    } else if (Node.isJsxSelfClosingElement(node)) {
      attributes = node.getAttributes();
    }
    
    if (!attributes) return;
    
    for (const attr of attributes) {
      if (Node.isJsxAttribute(attr)) {
        const attrName = attr.getNameNode().getText();
        const initializer = attr.getInitializer();
        
        // 只提取特定属性的文本
        if (
          initializer &&
          Node.isStringLiteral(initializer) &&
          ['alt', 'title', 'placeholder', 'aria-label', 'label'].includes(attrName)
        ) {
          const text = initializer.getLiteralValue();
          if (typeof text === 'string' && this.shouldExtractText(text)) {
            const filePath = node.getSourceFile().getFilePath();
            const line = initializer.getStartLineNumber();
            const key = this.generateFullKey(filePath, text);
            
            this.extractedTexts.push({
              text,
              filePath,
              line,
              key,
            });
          }
        }
      }
    }
  }

  /**
   * 处理单个文件
   */
  private processFile(filePath: string): void {
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    
    sourceFile.forEachDescendant((node) => {
      if (Node.isJsxElement(node)) {
        this.extractFromJsxElement(node);
        this.extractFromJsxAttributes(node);
      } else if (Node.isJsxSelfClosingElement(node)) {
        this.extractFromJsxAttributes(node);
      }
    });
  }

  /**
   * 扫描并处理所有文件
   */
  public async scanFiles(): Promise<void> {
    console.log('开始扫描文件...');
    
    // 获取所有需要处理的文件
    const appFiles = await glob('app/**/*.tsx', { ignore: ['**/node_modules/**'] });
    const componentFiles = await glob('components/**/*.tsx', { ignore: ['**/node_modules/**'] });
    
    const allFiles = [...appFiles, ...componentFiles];
    console.log(`找到 ${allFiles.length} 个文件`);
    
    // 处理每个文件
    for (const filePath of allFiles) {
      console.log(`处理文件: ${filePath}`);
      this.processFile(filePath);
    }
    
    console.log(`提取了 ${this.extractedTexts.length} 个文本`);
  }

  /**
   * 生成JSON报告
   */
  public generateReport(): void {
    console.log('生成报告...');
    
    // 按文件路径分组
    const groupedTexts: Record<string, Record<string, string>> = {};
    
    for (const item of this.extractedTexts) {
      const prefix = item.key.split('.')[0];
      
      if (!groupedTexts[prefix]) {
        groupedTexts[prefix] = {};
      }
      
      const suffix = item.key.substring(prefix.length + 1);
      groupedTexts[prefix][suffix] = item.text;
    }
    
    // 写入JSON文件
    const outputPath = join(process.cwd(), 'extracted_en.json');
    writeFileSync(outputPath, JSON.stringify(groupedTexts, null, 2), 'utf8');
    
    console.log(`报告已生成: ${outputPath}`);
    console.log(`总共提取了 ${this.extractedTexts.length} 个文本`);
    
    // 打印一些示例
    console.log('\n示例提取结果:');
    this.extractedTexts.slice(0, 5).forEach(item => {
      console.log(`  ${item.key}: "${item.text}" (${relative(process.cwd(), item.filePath)}:${item.line})`);
    });
  }

  /**
   * 运行完整的提取流程
   */
  public async run(): Promise<void> {
    try {
      await this.scanFiles();
      this.generateReport();
    } catch (error) {
      console.error('提取过程中发生错误:', error);
      process.exit(1);
    }
  }
}

// 运行提取器
const extractor = new I18nExtractor();
extractor.run();