const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  const svgPath = './assets/vertical-no-tagline-transparent-1500x1500.svg';
  const assetsDir = './assets';

  console.log('Starting logo conversion...');
  console.log('SVG Path:', svgPath);
  console.log('SVG exists:', fs.existsSync(svgPath));

  if (!fs.existsSync(svgPath)) {
    console.error('SVG file not found:', svgPath);
    return;
  }

  try {
    // Read SVG content
    const svgBuffer = fs.readFileSync(svgPath);

    console.log('Converting SVG to PNG formats...');

    // Convert to different sizes
    const conversions = [
      { name: 'icon.png', size: 1024 },           // Main app icon (1024x1024)
      { name: 'adaptive-icon.png', size: 1024 },  // Android adaptive icon (1024x1024)
      { name: 'splash-icon.png', size: 512 },     // Splash screen icon (512x512)
      { name: 'favicon.png', size: 48 }           // Web favicon (48x48)
    ];

    for (const conversion of conversions) {
      const outputPath = path.join(assetsDir, conversion.name);
      
      await sharp(svgBuffer)
        .resize(conversion.size, conversion.size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created ${conversion.name} (${conversion.size}x${conversion.size})`);
    }

    console.log('\n🎉 Logo conversion completed successfully!');
    console.log('Generated files:');
    conversions.forEach(conv => {
      console.log(`  - ${conv.name} (${conv.size}x${conv.size})`);
    });

  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
  }
}

convertSvgToPng();
