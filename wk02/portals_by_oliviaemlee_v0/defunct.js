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
  for (let i = 1; i < images + 1; i++) {
    let path = 'images/' + String(i) + '.jpeg';
    loadImage(path, 
      img => {
        img.resize(640, 480);
        portals.push(img);
        // console.log("Loaded:", path);
      }, 
      err => console.error("Failed to load:", path, err)
    );
  }

  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
}


function setup() {
  createCanvas(640, 480);
  // Create the video
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  bodySegmentation.detectStart(video, gotResults);

  // Create an image for segmented output
  personImage = createImage(video.width, video.height);
  
  // let IMG = image(portals[2],0,0,640,480)
  fishEye = fisheye(portals[2], 320, 240)
  frameRate(1);
  // noLoop();
}

function draw() {
  background(0);
  image(fishEye, 0, 0, 640, 480);

  // Display the segmented video grid
  if (segmentation) {
    copyForegroundPixels(portals[2], segmentation.mask, personImage);
    image(personImage, 0, 0, width, height);
  }
}

// callback function for body segmentation
function gotResults(result) {
  segmentation = result;
}

// Copy foreground pixels from the video based on the mask
function copyForegroundPixels(imgSource, imgMask, imgResult) {
  imgSource.loadPixels();
  imgMask.loadPixels();
  imgResult.loadPixels();

  const imgWidth = imgResult.width;
  const imgHeight = imgResult.height;
  const imgChannels = 4;

  const sourceWidth = imgSource.width;
  const sourceHeight = imgSource.height;

  const scaleX = sourceWidth / imgWidth;
  const scaleY = sourceHeight / imgHeight;

  for (let y = 0; y < imgHeight; y++) {
    for (let x = 0; x < imgWidth; x++) {
      let index = (y * imgWidth + x) * imgChannels;
      let maskR = imgMask.pixels[index];
      let maskG = imgMask.pixels[index + 1];
      let maskB = imgMask.pixels[index + 2];

      // Map coordinates to the source image
      let srcX = floor(x * scaleX);
      let srcY = floor(y * scaleY);
      let srcIndex = (srcY * sourceWidth + srcX) * imgChannels;

      if (maskR === 255 && maskG === 255 && maskB === 255) {
        // If the mask is white, make pixel transparent
        imgResult.pixels[index] = 0;
        imgResult.pixels[index + 1] = 0;
        imgResult.pixels[index + 2] = 0;
        imgResult.pixels[index + 3] = 0;
      } else {
        // Map pixels from portals[2] properly
        imgResult.pixels[index] = imgSource.pixels[srcIndex];
        imgResult.pixels[index + 1] = imgSource.pixels[srcIndex + 1];
        imgResult.pixels[index + 2] = imgSource.pixels[srcIndex + 2];
        imgResult.pixels[index + 3] = 255; // Full opacity
      }
    }
  }

  imgResult.updatePixels();
}


// callback function for body segmentation
function gotResults(result) {
  segmentation = result;
}



function fisheye(input, centerX, centerY) { 
  let distances = [ 
    dist(centerX,centerY, 0,0),
    dist(centerX,centerY, input.width,0),
    dist(centerX,centerY, input.width,input.height),
    dist(centerX,centerY, 0,input.height)
  ];
  let distanceMax = max(distances);
  
  let output = createImage(input.width, input.height);  
  input.loadPixels();
  output.loadPixels();
  for (let y=0; y<input.height; y++) {
    for (let x=0; x<input.width; x++) {
      
      // calculate the angle and distance between our
      // center point and the current x/y position
      // (these are 'polar' coordinates – a position defined
      // not by x/y but by angle and distance!)
      let distance = dist(x,y, centerX,centerY);  // also called 'rho'
      let angle = atan2(y-centerY, x-centerX);    // also called 'theta'
      
      // the magic!
      // first, a fisheye effect
      // transform distance my squaring it, then dividing
      // by the max possible distance from the center
      // the angle value stays the same
      distance = distance * distance / distanceMax;
      
      // ...or try these (comment out the others)
      
      // ripple effect
      // use distance with sin(), keep angle the same
      // distance = distance + 8 * sin(distance/2);
      
      // freaky twist
      // square angle and divide by 360º, keep distance the same
      // angle = angle * angle / TWO_PI;
      
      // convert back to cartesian (x/y) coordinates 
      // using some trig so we can grab a pixel from the
      // the source image
      let tempX = centerX + cos(angle) * distance;
      let tempY = centerY + sin(angle) * distance;
      
      // get the pixel and put it into the output image
      let px = input.get(tempX, tempY);
      output.set(x,y, px);
    }
  }
  output.updatePixels();
  return output;
}

