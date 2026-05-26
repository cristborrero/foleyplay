const fs = require('fs');
const path = require('path');

const assetsDir = path.join(process.cwd(), '.vercel', 'output', 'static');
const ignoreFile = path.join(assetsDir, '.assetsignore');

fs.writeFileSync(ignoreFile, '_worker.js\n');
console.log('✅ Created .assetsignore — _worker.js excluded from public assets');
