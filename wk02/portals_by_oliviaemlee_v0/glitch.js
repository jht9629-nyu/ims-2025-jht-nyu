let bodySegmentation;
let video;
let segmentation;
let personImage;

let options = {
  maskType: "person",
};

let portals = [];
let fishEye1;
let canvasWidth, canvasHeight;

// **Easily Change Aspect Ratio Here**
let aspectRatio = 1 / 1;  // Change this to 4/3, 1/1, etc.

function preload() {
  // let images = 3;
  // for (let i = 1; i <= images; i++) {
  //   let path = 'images/' + i + '.jpeg';
  //   loadImage(path, img => {
  //     img.resize(640, 480);
  //     portals.push(img);
  //   });
  // }
  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
}

function setup() {
  calculateCanvasSize();
  
  video = createCapture(VIDEO);
 // video.size(canvasWidth, canvasHeight);
  video.hide();
  calculateVideoDimensions();
  bodySegmentation.detectStart(video, gotResults);

  personImage = createImage(canvasWidth, canvasHeight);
  fishEye1 = createGraphics(canvasWidth, canvasHeight);
  
  createCanvas(canvasWidth, canvasHeight);
  frameRate(30);
}

function calculateVideoDimensions() {
  if (windowWidth / windowHeight > aspectRatio) {
    videoHeight = windowHeight;
    videoWidth = videoHeight * aspectRatio;
  } else {
    videoWidth = windowWidth;
    videoHeight = videoWidth / aspectRatio;
  }
}

function draw() {
  background(0);

  applyAnimatedFisheyeEffect(video, fishEye1, width / 2, height / 2);
  image(video, 0, 0, width, height);

  if (segmentation) {  
    copyForegroundPixels(fishEye1, segmentation.mask, personImage);
    translate(width, 0);
    scale(-1, 1);
    image(personImage, 0, 0, width, height);
  }
}

// **Calculate the largest possible size while keeping aspect ratio**
function calculateCanvasSize() {
  if (windowWidth / windowHeight > aspectRatio) {
    canvasHeight = windowHeight;
    canvasWidth = canvasHeight * aspectRatio;
  } else {
    canvasWidth = windowWidth;
    canvasHeight = canvasWidth / aspectRatio;
  }
}

// **Optimized function for copying pixels based on segmentation**
function copyForegroundPixels(imgSource, imgMask, imgResult) {
  imgSource.loadPixels();
  imgMask.loadPixels();
  imgResult.loadPixels();

  let totalPixels = imgResult.pixels.length;
  const imgChannels = 4;

  for (let i = 0; i < totalPixels; i += imgChannels) {
    let maskR = imgMask.pixels[i + 3]; // Read red channel of the mask

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

// **Callback for body segmentation**
function gotResults(result) {
  segmentation = result;
}

// **Animated Fisheye Effect**
function applyAnimatedFisheyeEffect(input, output, centerX, centerY) {
  input.loadPixels();
  output.loadPixels();
  
  let maxDistance = dist(centerX, centerY, 0, 0);
  let tempPixels = new Uint8ClampedArray(output.pixels);

  let time = frameCount / 10; // **Time-based animation**

  for (let y = 0; y < input.height; y++) {
    for (let x = 0; x < input.width; x++) {
      let dx = x - centerX;
      let dy = y - centerY;
      let distance = sqrt(dx * dx + dy * dy);
      let angle = atan2(dy, dx);

      // **Apply distortion effect**
      distance = distance + 100 * sin((distance / 10) + time);

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
