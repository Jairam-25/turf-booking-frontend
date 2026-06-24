const Jimp = require('jimp');

async function processIcon() {
  const image = await Jimp.read('assets/icon.png');
  const width = image.bitmap.width;
  const height = image.bitmap.height;

  let minX = width, minY = height, maxX = 0, maxY = 0;

  // Find bounding box of non-transparent pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = image.getPixelColor(x, y);
      const alpha = (color & 0xFF); // Jimp colors are RGBA, so alpha is the lowest 8 bits?
      // Wait, Jimp colors are 0xRRGGBBAA. Yes, lowest 8 bits.
      if (alpha > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Bounding box: ${minX}, ${minY} to ${maxX}, ${maxY}`);
  
  // Crop to bounding box
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  
  image.crop(minX, minY, cropW, cropH);

  // We want the new image to be a perfect 1024x1024 square that is FULL BLEED.
  // We can scale the cropped image to fill 1024x1024, or fit it with a little padding,
  // filling the background with the dark color found at the edges.
  
  // Let's sample the background color from the very edge of the cropped image (top-middle).
  const edgeColor = image.getPixelColor(Math.floor(cropW / 2), 2);
  
  // Create a new 1024x1024 image filled with edgeColor
  const newIcon = new Jimp(1024, 1024, edgeColor);
  
  // We want to scale our cropped logo to take up most of the 1024x1024 but leave a small safe zone margin
  // Adaptive icons shrink by 1.5x usually, so let's make the logo take up ~80% of the space.
  const targetSize = Math.floor(1024 * 0.85);
  image.scaleToFit(targetSize, targetSize);
  
  // Composite it in the center
  const posX = (1024 - image.bitmap.width) / 2;
  const posY = (1024 - image.bitmap.height) / 2;
  
  newIcon.composite(image, posX, posY);

  await newIcon.writeAsync('assets/icon.png');
  console.log('Successfully created full-bleed adaptive icon!');
}

processIcon().catch(console.error);
