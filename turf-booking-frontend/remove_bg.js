const Jimp = require('jimp');

async function removeWhiteBg() {
  const image = await Jimp.read('assets/icon.png');
  
  // We want to make the white background transparent.
  // The background is around the rounded corners. 
  // Let's replace all pixels that are very close to white with transparent.
  // We'll only do this for the outermost white pixels (we don't want to make white inside the logo transparent).
  
  // A flood fill from the corners is the safest!
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  
  const targetColor = 0xFFFFFFFF; // White
  const replaceColor = 0x00000000; // Transparent
  
  const tolerance = 10;
  
  function colorDistance(c1, c2) {
    const r1 = (c1 >> 24) & 255;
    const g1 = (c1 >> 16) & 255;
    const b1 = (c1 >> 8) & 255;
    const r2 = (c2 >> 24) & 255;
    const g2 = (c2 >> 16) & 255;
    const b2 = (c2 >> 8) & 255;
    return Math.abs(r1-r2) + Math.abs(g1-g2) + Math.abs(b1-b2);
  }

  function floodFill(startX, startY) {
    const stack = [[startX, startY]];
    const startColor = image.getPixelColor(startX, startY);
    
    // Only fill if the corner is actually white-ish
    if (colorDistance(startColor, targetColor) > tolerance * 3) {
      return;
    }

    const visited = new Set();

    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const key = `${x},${y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (x < 0 || x >= width || y < 0 || y >= height) continue;

      const currentColor = image.getPixelColor(x, y);
      if (colorDistance(currentColor, targetColor) <= tolerance * 3) {
        image.setPixelColor(replaceColor, x, y);
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    }
  }

  floodFill(0, 0);
  floodFill(width - 1, 0);
  floodFill(0, height - 1);
  floodFill(width - 1, height - 1);

  await image.writeAsync('assets/icon.png');
  console.log("White background removed and saved to assets/icon.png");
}

removeWhiteBg().catch(console.error);
