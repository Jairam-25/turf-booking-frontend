const Jimp = require('jimp');

async function processImage() {
  console.log("Loading image...");
  const imgPath = "C:\\Users\\kmaru\\.gemini\\antigravity\\brain\\006d5bd5-55b4-42f5-9b51-ecf24333d7ac\\media__1781877256043.png";
  const image = await Jimp.read(imgPath);
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  console.log(`Dimensions: ${width}x${height}`);

  const midY = Math.floor(height / 2);
  
  const topLogo = image.clone().crop(0, 0, width, midY);
  const bottomLogo = image.clone().crop(0, midY, width, height - midY);

  topLogo.autocrop();
  bottomLogo.autocrop();

  await topLogo.writeAsync("c:\\Users\\kmaru\\source\\repos\\Turf Project\\turf-booking-frontend\\turf-booking-frontend\\public\\images\\logo.png");
  await bottomLogo.writeAsync("c:\\Users\\kmaru\\source\\repos\\Turf Project\\turf-booking-frontend\\turf-booking-frontend\\assets\\icon.png");
  await topLogo.writeAsync("c:\\Users\\kmaru\\source\\repos\\Turf Project\\turf-booking-frontend\\turf-booking-frontend\\assets\\splash.png");
  console.log("Done processing image.");
}

processImage().catch(console.error);
