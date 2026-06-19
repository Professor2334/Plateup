/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(process.cwd(), 'public');

fs.readdir(publicDir, (err, files) => {
  if (err) throw err;

  const pngFiles = files.filter(f => f.includes('illustration') && f.endsWith('.png'));

  pngFiles.forEach(file => {
    const inputPath = path.join(publicDir, file);
    const outputPath = path.join(publicDir, file.replace('.png', '.webp'));

    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(info => {
        console.log(`Converted ${file} to WebP:`, info.size, 'bytes');
      })
      .catch(err => {
        console.error('Error converting', file, err);
      });
  });
});
