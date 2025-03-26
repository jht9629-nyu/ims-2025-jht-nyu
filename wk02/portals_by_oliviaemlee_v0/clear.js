// Body segmentation variables
let bodySegmentation;
let video;
let segmentation;
let personImage;

let options = {
  maskType: "parts",
};

let portals = [];
let fishEye;

function preload() {
  let images = 3;
  for (let i = 1; i <= images; i++) {
    let path = 'images/' + i + '.jpeg';
    loadImage(path, img => {
      img.resize(640, 480);
      portals.push(img);
    });
  }

  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
}

function setup() {
  createCanvas(640, 480);
  
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  bodySegmentation.detectStart(video, gotResults);

  personImage = createImage(video.width, video.height);
  
  // **Create fisheye buffer**
  fishEye = createGraphics(video.width, video.height);
  
  frameRate(30);
}

function draw() {
  background(0);
  
  // **Apply fisheye effect every frame**
  applyFisheyeEffect(portals[2], fishEye, width / 2, height / 2);
  
  image(portals[2], 0, 0, width, height);
  image(fishEye, 0, 0, width*2, height*4);

  if (segmentation) {
    translate(width,0);
    scale(-1, 1);
    copyForegroundPixels(portals[2], segmentation.mask, personImage);
 
    image(personImage, 0, 0, width, height);
  }
}

// Callback for body segmentation
function gotResults(result) {
  segmentation = result;
}

// **Optimized function for copying pixels based on segmentation**
function copyForegroundPixels(imgSource, imgMask, imgResult) {
  imgSource.loadPixels();
  imgMask.loadPixels();
  imgResult.loadPixels();

  let totalPixels = imgResult.pixels.length;
  const imgChannels = 4;

  for (let i = 0; i < totalPixels; i += imgChannels) {
    let maskR = imgMask.pixels[i];
    
    if (maskR === 255) {
      imgResult.pixels[i + 3] = 0; // Transparent
    } else {
      imgResult.pixels[i] = imgSource.pixels[i];
      imgResult.pixels[i + 1] = imgSource.pixels[i + 1];
      imgResult.pixels[i + 2] = imgSource.pixels[i + 2];
      imgResult.pixels[i + 3] = 255;
    }
  }
  
  imgResult.updatePixels();
}

// **Optimized fisheye function (now applied every frame)**
function applyFisheyeEffect(input, output, centerX, centerY) {
  input.loadPixels(); // **Get the latest frame from the video**
  output.loadPixels();
  
  let maxDistance = dist(centerX, centerY, 0, 0);
  let tempPixels = new Uint8ClampedArray(output.pixels); // Faster array processing

  for (let y = 0; y < input.height; y++) {
    for (let x = 0; x < input.width; x++) {
      let dx = x - centerX;
      let dy = y - centerY;
      let distance = sqrt(dx * dx + dy * dy);
      let angle = atan2(dy, dx);

      // **Apply Centered Ripple Effect**
      distance = distance + 20 * sin(distance / 2);

      let tempX = floor(centerX + cos(angle) * distance);
      let tempY = floor(centerY + sin(angle) * distance);

      if (tempX >= 0 && tempX < input.width && tempY >= 0 && tempY < input.height) {
        let srcIndex = (tempY * input.width + tempX) * 4;
        let dstIndex = (y * input.width + x) * 4;
        
        tempPixels[dstIndex] = input.pixels[srcIndex];
        tempPixels[dstIndex + 1] = input.pixels[srcIndex + 1];
        tempPixels[dstIndex + 2] = input.pixels[srcIndex + 2];
        tempPixels[dstIndex + 3] = 255;
      }
    }
  }

  output.pixels.set(tempPixels);
  output.updatePixels();
}
