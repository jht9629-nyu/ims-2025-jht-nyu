// https://editor.p5js.org/jht9629-nyu/sketches/1nLfUa1PU
// portals by oliviaemlee v0

// https://docs.ml5js.org/#/reference/body-segmentation

let bodySegmentation;
let video;
let segmentation;
let personImage;

let portals = [];
let fishEye;

function preload() {
  let options = {
    maskType: 'person',
  };
  bodySegmentation = ml5.bodySegmentation('BodyPix', options);
}

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  bodySegmentation.detectStart(video, gotSegmentationResults);

  personImage = createImage(video.width, video.height);
  fishEye1 = createGraphics(video.width, video.height);

  frameRate(30);
}

// Callback for body segmentation
function gotSegmentationResults(result) {
  segmentation = result;
}

function draw() {
  background(0);

  applyAnimatedFisheyeEffect(video, fishEye1, width / 2, height / 2);
  image(video, 0, 0, width, height);
  // image(fishEye1, 0, 0, width, height);
  if (segmentation) {
    // copyForegroundPixels(video, segmentation.mask, personImage);
    copyForegroundPixels(fishEye1, segmentation.mask, personImage);
    translate(width, 0);
    scale(-1, 1);
    image(personImage, 0, 0, width, height);
  }
}

// function for copying pixels based on segmentation
function copyForegroundPixels(imgSource, imgMask, imgResult) {
  imgSource.loadPixels();
  imgMask.loadPixels();
  imgResult.loadPixels();
  let totalPixels = imgResult.pixels.length;
  const imgChannels = 4;
  for (let i = 0; i < totalPixels; i += imgChannels) {
    let maskR = imgMask.pixels[i + 3];
    if (maskR === 255) {
      imgResult.pixels[i + 3] = 0;
    } else {
      imgResult.pixels[i] = imgSource.pixels[i];
      imgResult.pixels[i + 1] = imgSource.pixels[i + 1];
      imgResult.pixels[i + 2] = imgSource.pixels[i + 2];
      imgResult.pixels[i + 3] = 255; // Keep fully opaque
    }
  }
  imgResult.updatePixels();
}

// Animated Fisheye Effect
// I used chatGPT to animate and optimize this function so it would be faster...
// I'm not sure what "Uint8ClampedArray" is though
//
function applyAnimatedFisheyeEffect(input, output, centerX, centerY) {
  input.loadPixels();
  output.loadPixels();
  // let maxDistance = dist(centerX, centerY, 0, 0);
  let tempPixels = new Uint8ClampedArray(output.pixels);
  let time = frameCount / 10; // **Time-based animation**
  for (let y = 0; y < input.height; y++) {
    for (let x = 0; x < input.width; x++) {
      let dx = x - centerX;
      let dy = y - centerY;
      let distance = sqrt(dx * dx + dy * dy);
      let angle = atan2(dy, dx);
      // **Apply distortion effect**
      distance = distance + 100 * sin(distance / 10 + time);
      // angle = angle * angle / TWO_PI;
      //  distance = distance * distance / min(width,height);
      let tempX = floor(centerX + cos(angle) * distance);
      let tempY = floor(centerY + sin(angle) * distance);

      if (tempX >= 0 && tempX < input.width && tempY >= 0 && tempY < input.height) {
        let srcIndex = (tempY * input.width + tempX) * 4;
        let dstIndex = (y * input.width + x) * 4;

        tempPixels[dstIndex] = input.pixels[srcIndex];
        tempPixels[dstIndex + 1] = input.pixels[srcIndex + 1];
        tempPixels[dstIndex + 2] = input.pixels[srcIndex + 2];
        tempPixels[dstIndex + 3] = input.pixels[srcIndex + 3]; // Preserve alpha
      } else {
        tempPixels[(y * input.width + x) * 4 + 3] = 0; // Make out-of-bounds pixels transparent
      }
    }
  }
  output.pixels.set(tempPixels);
  output.updatePixels();
}

// Animated Fisheye Effect
// https://editor.p5js.org/jeffThompson/sketches/amZAWPv9S

// https://editor.p5js.org/oliviaemlee/sketches/CDwTbFgAL
// portals by oliviaemlee
