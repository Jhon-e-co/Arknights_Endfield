const fs = require('fs');
const path = require('path');

const directoriesToScan = ['app', 'components', 'lib'];
const extensions = ['.tsx', '.ts'];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (extensions.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function extractLinks(content) {
  const links = [];

  const hrefRegex = /href=["']([^"']+)["']/g;
  const routerPushRegex = /router\.push\(["']([^"']+)["']\)/g;
  const routerReplaceRegex = /router\.replace\(["']([^"']+)["']\)/g;
  const linkHrefRegex = /<Link\s+[^>]*href=["']([^"']+)["'][^>]*>/g;

  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    links.push(match[1]);
  }
  while ((match = routerPushRegex.exec(content)) !== null) {
    links.push(match[1]);
  }
  while ((match = routerReplaceRegex.exec(content)) !== null) {
    links.push(match[1]);
  }
  while ((match = linkHrefRegex.exec(content)) !== null) {
    links.push(match[1]);
  }

  return links;
}

function checkLinkExists(link) {
  if (link.startsWith('http://') || link.startsWith('https://')) {
    return { exists: true, type: 'external' };
  }

  if (link.startsWith('mailto:')) {
    return { exists: true, type: 'mailto' };
  }

  if (link.startsWith('/images/') || link.startsWith('/Logo/') || link.startsWith('/characters/') || link.startsWith('/music/')) {
    return { exists: true, type: 'public' };
  }

  if (link.startsWith('/tools/recruitment')) {
    return { exists: false, type: 'deprecated', message: '旧路径 /tools/recruitment 已废弃' };
  }

  if (link.startsWith('#')) {
    return { exists: true, type: 'anchor' };
  }

  if (link === '/') {
    return { exists: true, type: 'root' };
  }

  const cleanLink = link.replace(/\/$/, '');
  const basePath = cleanLink.split('?')[0];
  const appPath = path.join(process.cwd(), 'app', basePath.slice(1));

  if (fs.existsSync(appPath)) {
    if (fs.existsSync(path.join(appPath, 'page.tsx')) || fs.existsSync(path.join(appPath, 'page.ts'))) {
      return { exists: true, type: 'page' };
    }
  }

  const dynamicPath = path.join(process.cwd(), 'app', basePath.slice(1).split('/')[0], '[id]', 'page.tsx');
  if (fs.existsSync(dynamicPath)) {
    return { exists: true, type: 'dynamic' };
  }

  return { exists: false, type: 'missing', message: '页面文件不存在' };
}

function main() {
  console.log('🔍 开始扫描项目中的链接...\n');

  const allFiles = [];
  directoriesToScan.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      allFiles.push(...getAllFiles(dirPath));
    }
  });

  const linkMap = new Map();

  allFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const links = extractLinks(content);

    links.forEach(link => {
      if (!linkMap.has(link)) {
        linkMap.set(link, []);
      }
      linkMap.get(link).push(filePath);
    });
  });

  console.log(`📊 扫描了 ${allFiles.length} 个文件，发现 ${linkMap.size} 个唯一链接\n`);

  let hasErrors = false;

  linkMap.forEach((files, link) => {
    const check = checkLinkExists(link);
    const status = check.exists ? '✅' : '❌';
    const typeInfo = `[${check.type}]`;
    const message = check.message ? ` - ${check.message}` : '';
    const fileCount = files.length;

    console.log(`${status} ${link} ${typeInfo}${message} (出现在 ${fileCount} 个文件中)`);

    if (!check.exists) {
      hasErrors = true;
      files.forEach(file => {
        console.log(`   → ${file}`);
      });
    }
  });

  console.log('\n' + '='.repeat(60));

  if (hasErrors) {
    console.log('❌ 发现死链或问题链接，请修复！');
    process.exit(1);
  } else {
    console.log('✅ 所有链接检查通过！');
  }
}

main();