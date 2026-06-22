const Jimp = require('jimp');

async function processImage() {
  console.log("Loading image...");
  const imgPath = "C:\\Users\\kmaru\\.gemini\\antigravity\\brain\\006d5bd5-55b4-42f5-9b51-ecf24333d7ac\\media__1781880106991.png";
  const image = await Jimp.read(imgPath);
  
  console.log("Removing background...");
  removeBackground(image);
  image.autocrop();

  await image.writeAsync("c:\\Users\\kmaru\\source\\repos\\Turf Project\\turf-booking-frontend\\turf-booking-frontend\\public\\images\\logo.png");
  await image.writeAsync("c:\\Users\\kmaru\\source\\repos\\Turf Project\\turf-booking-frontend\\turf-booking-frontend\\assets\\splash.png");
  console.log("Done processing image.");
}

function removeBackground(img) {
  const width = img.bitmap.width;
  const height = img.bitmap.height;
  
  const visited = new Uint8Array(width * height);
  const queue = [];

  function pushQ(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (!visited[idx]) {
      const c = Jimp.intToRGBA(img.getPixelColor(x, y));
      if (c.r > 240 && c.g > 240 && c.b > 240 && c.a > 0) {
        visited[idx] = 1;
        queue.push({x, y});
      }
    }
  }

  for (let x = 0; x < width; x++) { pushQ(x, 0); pushQ(x, height-1); }
  for (let y = 0; y < height; y++) { pushQ(0, y); pushQ(width-1, y); }

  let head = 0;
  while (head < queue.length) {
    const {x, y} = queue[head++];
    img.setPixelColor(0x00000000, x, y);
    pushQ(x+1, y);
    pushQ(x-1, y);
    pushQ(x, y+1);
    pushQ(x, y-1);
  }
}

processImage().catch(console.error);
