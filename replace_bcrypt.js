const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'lib/auth.ts',
  'get_user.ts',
  'app/actions/settings/actions.ts',
  'app/actions/auth/actions.ts',
  'app/actions/auth/reset-actions.ts'
];

for (const relPath of filesToUpdate) {
  const absolutePath = path.join(__dirname, relPath);
  if (fs.existsSync(absolutePath)) {
    let content = fs.readFileSync(absolutePath, 'utf8');
    content = content.replace(/from ['"]bcrypt['"]/g, "from 'bcryptjs'");
    content = content.replace(/require\(['"]bcrypt['"]\)/g, "require('bcryptjs')");
    fs.writeFileSync(absolutePath, content);
    console.log(`Updated ${relPath}`);
  }
}
