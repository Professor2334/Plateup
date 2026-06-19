const fs = require('fs');
const content = fs.readFileSync('public/plateup-logo.svg', 'utf8');
const base64Match = content.match(/data:image\/png;base64,([^"']+)/);
if (base64Match) {
  fs.writeFileSync('public/plateup-logo.png', Buffer.from(base64Match[1], 'base64'));
  console.log('Successfully created plateup-logo.png');
} else {
  console.log('No base64 found');
}
