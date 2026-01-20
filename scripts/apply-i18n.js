const { Project, Node } = require('ts-morph');
const { readFileSync } = require('fs');
const { join } = require('path');

// 读取提取的翻译数据
const extractedData = JSON.parse(readFileSync(join(process.cwd(), 'extracted_en.json'), 'utf8'));

// 初始化 TypeScript 项目
const project = new Project({
  skipAddingFilesFromTsConfig: true,
});

console.log('开始应用翻译替换...\n');

// 按文件分组提取的数据
const fileGroups = {};

Object.entries(extractedData).forEach(([key, value]) => {
  const keyParts = key.split('.');
  const pagePath = keyParts[1];
  const fileName = keyParts[2];
  
  const filePath = `app/[locale]/${pagePath}/${fileName}.tsx`;
  
  if (!fileGroups[filePath]) {
    fileGroups[filePath] = {};
  }
  
  fileGroups[filePath][key] = value;
});

// 处理每个文件
Object.entries(fileGroups).forEach(([filePath, translations]) => {
  console.log(`处理文件: ${filePath}`);
  
  // 添加源文件到项目
  const sourceFile = project.addSourceFileAtPath(filePath);
  
  // 检查是否需要导入 useTranslations
  const hasImport = sourceFile.getImportDeclarations().some(imp => 
    imp.getModuleSpecifier()?.getText() === 'next-intl' &&
    imp.getNamedImports().some(named => named.getName() === 'useTranslations')
  );
  
  if (!hasImport) {
    console.log('  添加 useTranslations 导入');
    sourceFile.addImportDeclaration({
      moduleSpecifier: 'next-intl',
      namedImports: ['useTranslations']
    });
  }
  
  // 检查是否已有 t 变量声明
  const functionDeclarations = sourceFile.getFunctions();
  let hasTDeclaration = false;
  
  for (const func of functionDeclarations) {
    const body = func.getBody();
    if (body) {
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
      if (hasTDeclaration) break;
    }
  }
  
  if (!hasTDeclaration) {
    console.log('  添加 t 变量声明');
    const firstFunction = functionDeclarations[0];
    if (firstFunction) {
      const body = firstFunction.getBody();
      if (body && body.getStatements().length > 0) {
        body.insertStatements(0, `const t = useTranslations();`);
      }
    }
  }
  
  // 替换文本 - 使用更安全的方法
  let replacedCount = 0;
  
  sourceFile.forEachDescendant(node => {
    if (Node.isJsxText(node)) {
      const text = node.getText();
      const trimmedText = text.trim();
      
      // 跳过空文本
      if (!trimmedText) return;
      
      // 查找匹配的翻译
      for (const [key, value] of Object.entries(translations)) {
        const trimmedValue = value.trim();
        
        if (trimmedText === trimmedValue) {
          // 获取父元素
          const parent = node.getParent();
          
          if (parent && Node.isJsxElement(parent)) {
            // 获取父元素的子元素
            const children = parent.getChildren();
            
            // 找到当前 JsxText 在子元素中的位置
            const index = children.indexOf(node);
            
            if (index !== -1) {
              // 创建新的 JSX 表达式
              const jsxExpression = `{t('${key}')}`;
              
              // 替换为 JSX 表达式
              parent.replaceNode(index, jsxExpression);
              
              replacedCount++;
              console.log(`  替换: "${trimmedText}" -> {t('${key}')}`);
              break;
            }
          }
        }
      }
    }
  });
  
  // 保存修改后的文件
  sourceFile.saveSync();
  console.log(`  完成，共替换 ${replacedCount} 处\n`);
});

console.log('所有文件处理完成！');
