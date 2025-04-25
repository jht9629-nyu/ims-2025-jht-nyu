// https://editor.p5js.org/jht9629-nyu/sketches/FMZ9qAfBr
// sliding window v2 cut

// https://editor.p5js.org/jht9629-nyu/sketches/KfpABTqxn
// sliding window v1 responsive

// https://editor.p5js.org/jht9629-nyu/sketches/0OwCIFLm-
// sliding window v0

// https://editor.p5js.org/leey611/sketches/yzRvaE7Da
// sliding window v0

let video;
let handPose;
let hands = [];
// let painting;
let windowGraphic;
let window_left = 100;
let window_right = 360;
let shaderGraphic;
let myShader;
let px = 0;
let py = 0;
let my = {};

function preload() {
  handPose = ml5.handPose({ flipped: true, runtime: 'mediapipe' });
  myShader = loadShader('shader.vert', 'shader-effect.frag');
  // myShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // createCanvas(640, 480);

  video = createCapture(VIDEO, { flipped: true }, capture_ready_callback);
  // video.size(1920, 1080);
  video.hide();

  setup_fullScreenBtn();
}

function mousePressed() {
  console.log(hands);
  setTimeout(() => save('emitter.png'), 2000);
}

function gotHands(results) {
  hands = results;
}

function capture_ready_callback() {
  //
  console.log('capture_ready_callback width', video.width, video.height);
  let w = video.width;
  let h = video.height;

  shaderGraphic = createGraphics(w, h, WEBGL);
  shaderGraphic.clear();

  // painting = createGraphics(w, h);
  // painting.clear();

  windowGraphic = createGraphics(w, h);
  windowGraphic.clear();

  handPose.detectStart(video, gotHands);
}

function draw() {
  if (!shaderGraphic) return;
  // image(video, 0, 0);

  let w = video.width;
  let h = video.height;

  // shaderGraphic.image(video, 0, 0);

  shaderGraphic.shader(myShader);

  myShader.setUniform('tex0', video);
  myShader.setUniform('mouseX', 0.5);
  myShader.setUniform('window_left', window_left / w);
  myShader.setUniform('window_right', window_right / w);

  shaderGraphic.shader(myShader);

  windowGraphic.clear();
  if (hands.length > 0) {
    let hand = hands[0];
    let index = hand.index_finger_tip;
    let thumb = hand.thumb_tip;
    let x = (index.x + thumb.x) * 0.5;
    let y = (index.y + thumb.y) * 0.5;

    let d = dist(index.x, index.y, thumb.x, thumb.y);
    if (d < 20 && dist(index.x, index.y, window_right, index.y) < 20) {
      window_right = lerp(window_right, index.x, 0.5); //index.x
    }
    // grab left window
    if (d < 20 && dist(index.x, index.y, window_left, index.y) < 20) {
      window_left = lerp(window_left, index.x, 0.5); //index.x
    }
    px = x;
    py = y;
  }
  windowGraphic.line(window_left, 0, window_left, h);
  windowGraphic.line(window_right, 0, window_right, h);

  shaderGraphic.rect(0, 0, w, h);

  image(shaderGraphic, 0, 0, width, height, 0, 0, w, h);
  // image(painting, 0, 0);
  // draw two line on window border
  image(windowGraphic, 0, 0, width, height, 0, 0, w, h);

  my.fpsSpan.html(framesPerSecond());
}

// Draw all the tracked hand points
// for (let i = 0; i < hands.length; i++) {
//   let hand = hands[i];
//   for (let j = 0; j < hand.keypoints.length; j++) {
//     let keypoint = hand.keypoints[j];
//     fill(0, 255, 0);
//     noStroke();
//     circle(keypoint.x, keypoint.y, 10);
//   }
// }

// --
function framesPerSecond() {
  return frameRate().toFixed(2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup_fullScreenBtn() {
  my.fullScreenBtn = createButton('?v=30 Full Screen');
  my.fullScreenBtn.mousePressed(full_screen_action);
  my.fullScreenBtn.style('font-size:42px');

  my.fpsSpan = createSpan('');
  my.fpsSpan.style('font-size:42px');
}

function full_screen_action() {
  my.fullScreenBtn.remove();
  my.fpsSpan.remove();
  fullscreen(1);
  let delay = 3000;
  setTimeout(ui_present_window, delay);
}

function ui_present_window() {
  resizeCanvas(windowWidth, windowHeight);
  // init_dim();
}
