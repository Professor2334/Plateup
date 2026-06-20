const sharp = require('sharp');
const pngToIco = require('png-to-ico').default;
const fs = require('fs');

async function generate() {
    const src = 'public/plateup-logo.png';
    console.log("Loading source image...");
    
    // Trim transparency
    const trimmed = await sharp(src).trim().toBuffer();
    
    // Ensure square
    const meta = await sharp(trimmed).metadata();
    const size = Math.max(meta.width, meta.height);
    const square = await sharp(trimmed)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();

    console.log("Generating icon.png (512x512)...");
    await sharp(square).resize(512, 512).toFile('app/icon.png');
    await sharp(square).resize(512, 512).toFile('public/icon.png'); // Also place in public to be safe

    console.log("Generating icon-192.png (192x192)...");
    await sharp(square).resize(192, 192).toFile('public/icon-192.png');
    
    console.log("Generating apple-icon.png (180x180)...");
    await sharp(square).resize(180, 180).toFile('app/apple-icon.png');
    await sharp(square).resize(180, 180).toFile('public/apple-icon.png');

    console.log("Generating favicon sizes...");
    await sharp(square).resize(16, 16).toFile('public/favicon-16.png');
    await sharp(square).resize(32, 32).toFile('public/favicon-32.png');
    await sharp(square).resize(48, 48).toFile('public/favicon-48.png');
    
    console.log("Combining to favicon.ico...");
    const ico = await pngToIco(['public/favicon-16.png', 'public/favicon-32.png', 'public/favicon-48.png']);
    fs.writeFileSync('app/favicon.ico', ico);
    fs.writeFileSync('public/favicon.ico', ico);
    
    console.log("Cleaning up temp files...");
    fs.unlinkSync('public/favicon-16.png');
    fs.unlinkSync('public/favicon-32.png');
    fs.unlinkSync('public/favicon-48.png');

    console.log("Icons generated successfully.");
}

generate().catch(console.error);
