const { exec } = require('child_process');
const path = require('path');

console.log('🔍 正在检查 TypeScript 构建错误...\n');

exec('npx tsc --noEmit', (error, stdout, stderr) => {
  const output = stdout || stderr;
  const lines = output.split('\n');
  
  const anyErrors = [];
  
  lines.forEach(line => {
    if (line.includes('any') && (line.includes('error TS') || line.includes('error'))) {
      const match = line.match(/^(.+\.tsx?)\((\d+),(\d+)\):\s+(.+)$/);
      if (match) {
        const [_, filePath, lineNum, colNum, errorMsg] = match;
        anyErrors.push({
          file: filePath,
          line: lineNum,
          col: colNum,
          error: errorMsg.trim()
        });
      }
    }
  });
  
  if (anyErrors.length === 0) {
    console.log('✅ 未发现与 `any` 类型相关的错误！');
  } else {
    console.log(`📋 发现 ${anyErrors.length} 个与 \`any\` 类型相关的错误：\n`);
    console.log('```');
    anyErrors.forEach(err => {
      console.log(`- [ ] ${err.file}:${err.line} - ${err.error}`);
    });
    console.log('```');
  }
  
  process.exit(anyErrors.length > 0 ? 1 : 0);
});
