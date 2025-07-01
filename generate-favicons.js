#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const svgPath = path.join(__dirname, 'public/svg/final_wm_lifeline_icon.svg');
  const publicPath = path.join(__dirname, 'public');

  // Read the SVG file
  const svgBuffer = fs.readFileSync(svgPath);

  // Generate different sizes
  const sizes = [16, 32, 48, 64, 128, 180, 192, 512];

  console.log('🎨 Generating favicons from SVG...');

  // Generate PNG files for different sizes
  for (const size of sizes) {
    const filename = `favicon-${size}.png`;
    const outputPath = path.join(publicPath, filename);

    await sharp(svgBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
      })
      .png()
      .toFile(outputPath);

    console.log(`✅ Generated ${filename}`);
  }

  // Generate the main favicon.ico (16x16 and 32x32)
  const favicon16Buffer = await sharp(svgBuffer)
    .resize(16, 16, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  // Save the 16x16 as favicon.ico (simplified approach)
  fs.writeFileSync(path.join(publicPath, 'favicon.ico'), favicon16Buffer);
  console.log('✅ Generated favicon.ico');

  // Copy the SVG as favicon.svg
  fs.copyFileSync(svgPath, path.join(publicPath, 'favicon.svg'));
  console.log('✅ Generated favicon.svg');

  // Generate apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(publicPath, 'apple-touch-icon.png'));
  console.log('✅ Generated apple-touch-icon.png');

  console.log('🎉 All favicons generated successfully!');
}

generateFavicons().catch(console.error);
