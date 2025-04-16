//
// https://omibahuguna.github.io/ims-2025-omi/Transience/
// https://editor.p5js.org/omi99/sketches

// Dan Shiffman slit-scan tutorial: https://www.youtube.com/watch?v=WCJM9WIoudI

// a sketch that employs ml5 to detect human bodies which triggers a slit-scan photo capture

let video;
let bodyPose;
let poses = [];

let cols = 160; // no. of columns
let colWidth;
let capturedFrames = [];
let currentCol = 0;
let lastCaptureTime = 0;
let captureInterval = 1; //ms
let capturing = false;
let captureDirection = 1; // 1 towards right, -1 towards left
let triggered = false;
let lastPoseDetected = false;

let my = {};

function preload() {
  bodyPose = ml5.bodyPose({ flipped: true }); // ml5 with flipped video
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // createCanvas(1600, 1200);
  // colWidth = width / cols;

  video = createCapture(VIDEO, () => {
    console.log('createCapture callback width heigth', video.width, video.height);
    my.layer = createGraphics(video.width, video.height);
    colWidth = video.width / cols;
  });
  // video.size(960, 540);
  // video.size(1920, 1080);
  // video.size(1600, 1200);
  video.hide();

  // pose detection
  bodyPose.detectStart(video, gotPoses);
}

function draw() {
  let layer = my.layer;
  if (!layer) {
    // console.log('waiting for video', millis() / 1000);
    return;
  }
  let { width, height } = video;
  layer.push();
  layer.translate(width, 0);
  layer.scale(-1, 1); // mirror the video
  layer.image(video, 0, 0, width, height);
  layer.pop();

  let lapsed = millis() - lastCaptureTime > captureInterval;
  if (capturing && lapsed && currentCol < cols && currentCol >= 0) {
    let x = width - (currentCol + 1) * colWidth;
    let colImage = createImage(colWidth, height);
    // image of the column
    colImage.copy(video, x, 0, colWidth, height, 0, 0, colWidth, height);

    // flipping the columns horizontally
    colImage.loadPixels();
    for (let y = 0; y < colImage.height; y++) {
      for (let i = 0; i < colWidth / 2; i++) {
        let leftIdx = 4 * (y * colWidth + i);
        let rightIdx = 4 * (y * colWidth + (colWidth - i - 1));
        for (let k = 0; k < 4; k++) {
          let temp = colImage.pixels[leftIdx + k];
          colImage.pixels[leftIdx + k] = colImage.pixels[rightIdx + k];
          colImage.pixels[rightIdx + k] = temp;
        }
      }
    }
    colImage.updatePixels();

    // Store the captured column image & update capture state
    capturedFrames[currentCol] = colImage;
    lastCaptureTime = millis();
    currentCol += captureDirection;

    // Check if capture is complete
    if (currentCol >= cols || currentCol < 0) {
      capturing = false; // Stop capturing
      triggered = false; // Allow new pose detection
    }
  }
  // draw captured columns on the layer
  for (let i = 0; i < capturedFrames.length; i++) {
    if (capturedFrames[i]) {
      layer.image(capturedFrames[i], i * colWidth, 0);
    }
  }

  image(layer, 0, 0);
}

function gotPoses(results) {
  poses = results;

  let poseNowDetected = poses.length > 0;

  // Trigger capture when pose is detected and not already capturing: code by chatGPT
  if (poseNowDetected && !lastPoseDetected && !capturing) {
    let pose = poses[0]; // Use first detected pose
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.confidence > 0.1) {
        let section = getSection(keypoint.x);
        if (section === 'left') {
          currentCol = 0;
          captureDirection = 1;
        } else if (section === 'right') {
          currentCol = cols - 1;
          captureDirection = -1;
        } else {
          return; // do nothing if subject in center
        }
        capturedFrames = [];
        capturing = true;
        triggered = true;
        lastCaptureTime = millis();
        break;
      }
    }
  }

  lastPoseDetected = poseNowDetected;
}

// where the subject is in the frame
function getSection(x) {
  let { width } = video;
  if (x < width / 3) return 'left';
  if (x > (2 * width) / 3) return 'right';
  return 'center';
}

// Save image on keypress
function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('slit-scan-capture', 'png');
  }
}
