const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'tmp-app');
const targetDir = __dirname;

function moveFiles(source, target) {
  if (!fs.existsSync(source)) return;
  const files = fs.readdirSync(source);
  for (const file of files) {
    const srcPath = path.join(source, file);
    const destPath = path.join(target, file);
    fs.renameSync(srcPath, destPath);
  }
}

moveFiles(sourceDir, targetDir);
fs.rmdirSync(sourceDir);
console.log('Moved files successfully');
