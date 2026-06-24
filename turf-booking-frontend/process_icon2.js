const Jimp = require('jimp');

async function processIcon() {
  const image = await Jimp.read('C:/Users/kmaru/.gemini/antigravity/brain/006d5bd5-55b4-42f5-9b51-ecf24333d7ac/artifacts/app_icon.png');
  const width = image.bitmap.width;
  const height = image.bitmap.height;

  let minX = width, minY = height, maxX = 0, maxY = 0;

  // Find bounding box of non-transparent and non-white pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = image.getPixelColor(x, y);
      const alpha = (color & 0xFF);
      
      const r = (color >> 24) & 0xFF;
      const g = (color >> 16) & 0xFF;
      const b = (color >> 8) & 0xFF;
      
      const isWhite = (r > 240 && g > 240 && b > 240);
      
      if (alpha > 10 && !isWhite) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // If we couldn't find a box, use the whole image
  if (minX > maxX) { minX = 0; maxX = width - 1; minY = 0; maxY = height - 1; }

  // We crop to this tight box
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  
  image.crop(minX, minY, cropW, cropH);

  // We want the new image to be a perfect 1024x1024 square that is FULL BLEED.
  // We use a dark color from the app theme. Let's use #0D1117 (Dark Theme BG) or #080C14
  // Let's sample a pixel from the "dark" background of the logo itself if possible.
  // We know the logo has a dark glow around the TX text.
  
  const bgColor = Jimp.rgbaToInt(8, 14, 25, 255); // A very dark blue, matching modern dark themes
  
  const newIcon = new Jimp(1024, 1024, bgColor);
  
  // Scale our cropped logo to take up ~75% of the space so Android doesn't cut it off.
  // Adaptive icon safe zone is a circle of diameter 66/108 of the total size.
  const targetSize = Math.floor(1024 * 0.70);
  
  if (cropW > cropH) {
    image.resize(targetSize, Jimp.AUTO);
  } else {
    image.resize(Jimp.AUTO, targetSize);
  }
  
  // Composite it in the center
  const posX = (1024 - image.bitmap.width) / 2;
  const posY = (1024 - image.bitmap.height) / 2;
  
  newIcon.composite(image, posX, posY);

  await newIcon.writeAsync('assets/icon.png');
  console.log('Successfully created full-bleed adaptive icon with dark background!');
}

processIcon().catch(console.error);
