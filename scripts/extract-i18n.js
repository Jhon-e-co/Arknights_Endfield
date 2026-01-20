const { Project, Node, SyntaxKind } = require('ts-morph');
const { glob } = require('glob');
const { join, relative } = require('path');
const { writeFileSync, readFileSync } = require('fs');
const { createHash } = require('crypto');

// 配置
const DRY_RUN = false; // 设置为false以实际修改文件

// 加载提取的文本映射
let extractedTexts = {};
try {
  const extractedData = readFileSync(join(process.cwd(), 'extracted_en.json'), 'utf8');
  extractedTexts = JSON.parse(extractedData);
  console.log(`成功加载 ${Object.keys(extractedTexts).length} 个文本映射`);
} catch (error) {
  console.log('extracted_en.json 不存在或无法读取，初始化为空对象');
  extractedTexts = {};
}

// 存储将要修改的文件信息
const modifications = new Map();

// 存储提取的文本
class I18nExtractor {
  constructor() {
    this.project = new Project({
      skipAddingFilesFromTsConfig: true,
    });
    this.extractedTexts = [];
    this.usedKeys = new Set();
    this.allExtractedPairs = {};
  }

  /**
   * 生成基于文件路径的前缀
   */
  generatePrefixFromPath(filePath) {
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
  generateKeyFromText(text) {
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
  generateFullKey(filePath, text) {
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
  shouldExtractText(text) {
    // 过滤掉太短的文本
    if (text.trim().length < 2) {
      return false;
    }
    
    // 过滤掉纯数字或特殊字符（允许中文和英文）
    if (!/[\u4e00-\u9fa5a-zA-Z]/.test(text)) {
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
  extractFromJsxElement(node, filePath) {
    const children = node.getChildren();
    
    for (const child of children) {
      if (Node.isStringLiteral(child)) {
        const text = child.getLiteralValue();
        if (typeof text === 'string' && this.shouldExtractText(text)) {
          const line = child.getStartLineNumber();
          const key = this.generateFullKey(filePath, text);
          
          this.extractedTexts.push({
            text,
            filePath,
            line,
            key,
            node: child,
            type: 'jsx_text'
          });
          
          this.allExtractedPairs[key] = text;
        }
      } else if (Node.isJsxText(child)) {
        const text = child.getText();
        if (typeof text === 'string' && this.shouldExtractText(text)) {
          const line = child.getStartLineNumber();
          const key = this.generateFullKey(filePath, text);
          
          this.extractedTexts.push({
            text,
            filePath,
            line,
            key,
            node: child,
            type: 'jsx_text'
          });
          
          this.allExtractedPairs[key] = text;
        }
      } else if (Node.isJsxElement(child)) {
        this.extractFromJsxElement(child, filePath);
      }
    }
  }

  /**
   * 从JSX属性中提取文本
   */
  extractFromJsxAttributes(node, filePath) {
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
            const line = initializer.getStartLineNumber();
            const key = this.generateFullKey(filePath, text);
            
            this.extractedTexts.push({
              text,
              filePath,
              line,
              key,
              node: initializer,
              type: 'jsx_attribute'
            });
            
            this.allExtractedPairs[key] = text;
          }
        }
      }
    }
  }

  /**
   * 检查文件是否需要添加useTranslations导入
   */
  needsUseTranslationsImport(sourceFile) {
    const imports = sourceFile.getImportDeclarations();
    return !imports.some(imp => 
      imp.getModuleSpecifier()?.getText() === 'next-intl' &&
      imp.getNamedImports().some(named => named.getName() === 'useTranslations')
    );
  }

  /**
   * 检查函数是否已经声明了t变量
   */
  hasTVariable(functionNode) {
    const body = functionNode.getBody();
    if (!body) return false;
    
    // 检查函数体中是否有const t = useTranslations(...)
    let hasTDeclaration = false;
    
    body.forEachDescendant(node => {
      if (Node.isVariableStatement(node)) {
        const declaration = node.getDeclarationList()[0];
        if (declaration && 
            Node.isVariableDeclaration(declaration) &&
            declaration.getName() === 't') {
          const initializer = declaration.getInitializer();
          if (initializer && 
              Node.isCallExpression(initializer) &&
              initializer.getExpression()?.getText() === 'useTranslations') {
            hasTDeclaration = true;
          }
        }
      }
    });
    
    return hasTDeclaration;
  }

  /**
   * 添加useTranslations导入
   */
  addUseTranslationsImport(sourceFile) {
    // 检查是否已有next-intl导入
    const nextIntlImport = sourceFile.getImportDeclaration(i => 
      i.getModuleSpecifier()?.getText() === 'next-intl'
    );
    
    if (nextIntlImport) {
      // 添加到现有导入中
      const namedImports = nextIntlImport.getNamedImports() || [];
      const hasUseTranslations = namedImports.some(i => i.getName() === 'useTranslations');
      
      if (!hasUseTranslations) {
        nextIntlImport.addNamedImport('useTranslations');
      }
    } else {
      // 创建新的导入语句
      sourceFile.addImportDeclaration({
        moduleSpecifier: 'next-intl',
        namedImports: ['useTranslations']
      });
    }
  }

  /**
   * 添加t变量声明
   */
  addTVariableDeclaration(functionNode) {
    const body = functionNode.getBody();
    if (!body || !body.getStatements().length) return;
    
    // 在函数体第一行添加const t = useTranslations();
    const firstStatement = body.getStatements()[0];
    
    if (firstStatement) {
      // 使用body的insertStatements方法
      body.insertStatements(0, `const t = useTranslations();`);
    } else {
      body.addStatements(`const t = useTranslations();`);
    }
  }

  /**
   * 替换文本节点
   */
  replaceTextNode(node, key) {
    // 替换为{t('key')}
    const replacement = `{t('${key}')}`;
    
    if (Node.isStringLiteral(node)) {
      // 对于字符串字面量，需要替换整个父节点
      const parent = node.getParent();
      if (parent) {
        parent.replaceWithText(`{t('${key}')}`);
      }
    }
  }

  /**
   * 替换属性节点
   */
  replaceAttributeNode(node, key) {
    // 替换为{t('key')}
    const replacement = `{t('${key}')}`;
    
    if (Node.isStringLiteral(node)) {
      node.replaceWithText(`{t('${key}')}`);
    }
  }

  /**
   * 处理单个文件
   */
  processFile(filePath) {
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    let needsModifications = false;
    let needsImport = false;
    let needsTDeclaration = false;
    
    // 检查是否需要导入和声明
    const functionDeclarations = sourceFile.getFunctions();
    
    sourceFile.forEachDescendant((node) => {
      if (Node.isJsxElement(node)) {
        this.extractFromJsxAttributes(node, filePath);
      } else if (Node.isJsxSelfClosingElement(node)) {
        this.extractFromJsxAttributes(node, filePath);
      } else if (Node.isJsxText(node)) {
        const text = node.getText();
        if (typeof text === 'string' && this.shouldExtractText(text)) {
          const line = node.getStartLineNumber();
          const key = this.generateFullKey(filePath, text);
          
          this.extractedTexts.push({
            text,
            filePath,
            line,
            key,
            node: node,
            type: 'jsx_text'
          });
          
          this.allExtractedPairs[key] = text;
        }
      }
    });
    
    // 检查是否有需要替换的文本
    if (this.extractedTexts.length > 0) {
      needsModifications = true;
      
      // 检查是否需要导入
      if (this.needsUseTranslationsImport(sourceFile)) {
        needsImport = true;
      }
      
      // 检查是否需要声明t变量
      for (const func of functionDeclarations) {
        if (!this.hasTVariable(func)) {
          needsTDeclaration = true;
          break;
        }
      }
    }
    
    if (needsModifications) {
      // 记录将要进行的修改
      const fileModifications = {
        filePath,
        needsImport,
        needsTDeclaration,
        replacements: []
      };
      
      // 添加导入
      if (needsImport) {
        fileModifications.replacements.push({
          type: 'import',
          content: 'import { useTranslations } from \'next-intl\';'
        });
      }
      
      // 添加t变量声明
      if (needsTDeclaration) {
        fileModifications.replacements.push({
          type: 'declaration',
          content: 'const t = useTranslations();'
        });
      }
      
      // 添加文本替换
      for (const extracted of this.extractedTexts) {
        fileModifications.replacements.push({
          type: extracted.type,
          line: extracted.line,
          key: extracted.key,
          text: extracted.text,
          content: `{t('${extracted.key}')}`
        });
      }
      
      modifications.set(filePath, fileModifications);
      
      // 如果不是Dry Run，实际修改文件
      if (!DRY_RUN) {
        // 添加导入
        if (needsImport) {
          this.addUseTranslationsImport(sourceFile);
        }
        
        // 添加t变量声明
        if (needsTDeclaration) {
          for (const func of functionDeclarations) {
            if (!this.hasTVariable(func)) {
              this.addTVariableDeclaration(func);
            }
          }
        }
        
        // 替换文本
        for (const extracted of this.extractedTexts) {
          if (extracted.type === 'jsx_text') {
            this.replaceTextNode(extracted.node, extracted.key);
          } else if (extracted.type === 'jsx_attribute') {
            this.replaceAttributeNode(extracted.node, extracted.key);
          }
        }
        
        // 保存修改后的文件
        sourceFile.saveSync();
      }
    }
    
    // 重置提取的文本
    this.extractedTexts = [];
    this.usedKeys = new Set();
  }

  /**
   * 扫描并处理所有文件
   */
  async scanFiles() {
    console.log('开始扫描文件...');
    
    // 获取所有需要处理的文件（仅测试 headhunt 页面）
    const appFiles = await glob('app/**/headhunt/**/*.tsx', { ignore: ['**/node_modules/**'] });
    
    const allFiles = [...appFiles];
    console.log(`找到 ${allFiles.length} 个文件`);
    
    // 处理每个文件
    for (const filePath of allFiles) {
      console.log(`处理文件: ${filePath}`);
      this.processFile(filePath);
    }
    
    console.log(`处理完成，共 ${modifications.size} 个文件需要修改`);
  }

  /**
   * 生成修改报告
   */
  generateReport() {
    console.log('\n=== 修改报告 ===');
    console.log(`模式: ${DRY_RUN ? 'Dry Run (仅预览，不实际修改)' : '实际修改'}`);
    console.log(`需要修改的文件数: ${modifications.size}`);
    
    for (const [filePath, fileMod] of modifications.entries()) {
      console.log(`\n文件: ${filePath}`);
      
      if (fileMod.needsImport) {
        console.log(`  需要添加导入: ${fileMod.replacements.find(r => r.type === 'import').content}`);
      }
      
      if (fileMod.needsTDeclaration) {
        console.log(`  需要添加声明: ${fileMod.replacements.find(r => r.type === 'declaration').content}`);
      }
      
      console.log('  需要替换的文本:');
      for (const replacement of fileMod.replacements) {
        if (replacement.type === 'jsx_text' || replacement.type === 'jsx_attribute') {
          console.log(`    行 ${replacement.line}: "${replacement.text}" -> {t('${replacement.key}')}`);
        }
      }
    }
    
    if (!DRY_RUN) {
      console.log('\n所有修改已应用到文件！');
    }
    
    if (Object.keys(this.allExtractedPairs).length > 0) {
      const outputPath = join(process.cwd(), 'extracted_en.json');
      writeFileSync(outputPath, JSON.stringify(this.allExtractedPairs, null, 2), 'utf8');
      console.log(`\n已保存 ${Object.keys(this.allExtractedPairs).length} 个翻译键值对到 ${outputPath}`);
    }
  }

  /**
   * 运行完整的提取和替换流程
   */
  async run() {
    try {
      await this.scanFiles();
      this.generateReport();
    } catch (error) {
      console.error('处理过程中发生错误:', error);
      process.exit(1);
    }
  }
}

// 运行提取器
const extractor = new I18nExtractor();
extractor.run();