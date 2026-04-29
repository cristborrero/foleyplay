const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
  // colores hex
  [/bg-\[#141414\]/g, 'bg-netflix-black'],
  [/bg-\[#181818\]/g, 'bg-netflix-dark'],
  [/bg-\[#1a1a1a\]/g, 'bg-fp-elevated'],
  // gradientes
  [/bg-gradient-to-t/g, 'bg-linear-to-t'],
  [/bg-gradient-to-b/g, 'bg-linear-to-b'],
  [/bg-gradient-to-r/g, 'bg-linear-to-r'],
  [/from-\[#141414\]/g, 'from-netflix-black'],
  [/via-\[#141414\]\/([0-9]+)/g, 'via-netflix-black/$1'],
  [/border-\[#2a2a2a\]/g, 'border-fp-border'],
  // aspect ratios
  [/aspect-\[2\/3\]/g, 'aspect-2/3'],
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', 'android', 'tmp', '.git'].includes(entry.name)) continue;
      walk(full);
    } else if (full.match(/\.(tsx|ts|jsx|js)$/)) {
      let content = fs.readFileSync(full, 'utf8');
      let changed = false;
      for (const [regex, replacement] of REPLACEMENTS) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(full, content, 'utf8');
        console.log('🔧 Updated', full);
      }
    }
  }
}

const root = path.resolve(__dirname);
walk(path.join(root, 'app'));
walk(path.join(root, 'components'));
