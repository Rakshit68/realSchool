const sharp = require('sharp');
const path = require('path');

async function generateIcons() {
  const sizes = [192, 512];
  const types = ['icon', 'icon-maskable'];

  for (const type of types) {
    const input = path.join(__dirname, '..', 'public', 'icons', `${type}.svg`);
    
    for (const size of sizes) {
      const output = path.join(
        __dirname,
        '..',
        'public',
        'icons',
        `${type === 'icon' ? 'icon' : 'icon-maskable'}-${size}x${size}.png`
      );

      await sharp(input)
        .resize(size, size)
        .png()
        .toFile(output);
      
      console.log(`Generated ${output}`);
    }
  }
}

generateIcons().catch(console.error);