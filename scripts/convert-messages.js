const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '..', 'messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

function convertFlatToNested(obj) {
  const result = {};
  
  for (const key in obj) {
    if (key.includes('.')) {
      const keys = key.split('.');
      let current = result;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = obj[key];
    } else {
      result[key] = obj[key];
    }
  }
  
  return result;
}

files.forEach(file => {
  const filePath = path.join(messagesDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const converted = {
    ...content,
    app: convertFlatToNested(content.app || {}),
    components: convertFlatToNested(content.components || {})
  };
  
  fs.writeFileSync(filePath, JSON.stringify(converted, null, 2), 'utf8');
  console.log(`Converted ${file}`);
});

console.log('All files converted successfully!');