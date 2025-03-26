// https://editor.p5js.org/jht9629-gmail/sketches/ScCMFzWqR
// OpenSimplex Noise -- fullScreen

// What would this look like applied to video?

// Why extra bar on the right?

const increment = 0.03;
const incrementZ = increment * 0.15;
// const incrementZ = increment * 1; // fast
// Just for non-looping demo
let zoff = 0;
let noise;

// adapted to use createGraphics
let layer;

let my = {};

function setup() {
  createCanvas(windowWidth, windowHeight - 55);
  // I made the canvas really small because it's slow for me otherwise
  // createCanvas(200, 200);
  pixelDensity(1);
  initGraphics();
  noise = new OpenSimplexNoise(Date.now());
  setup_fullScreenBtn();
}

function draw() {
  updateLayer();
  let w = layer.width;
  let h = layer.height;
  image(layer, 0, 0, width, height, 0, 0, w, h);
}

function initGraphics() {
  layer = createGraphics(100, 100);
}

function updateLayer() {
  let xoff = 0;
  let w = layer.width;
  let h = layer.height;
  for (let x = 0; x < w; x++) {
    let yoff = 0;
    for (let y = 0; y < h; y++) {
      let n;
      n = noise.noise3D(xoff, yoff, zoff);
      // console.log('n',n)
      // let bright = n > 0 ? 255 : 0;
      let bright = map(n, -1, 1, 0, 255);
      layer.stroke(bright);
      layer.point(x, y);
      yoff += increment;
    }
    xoff += increment;
  }
  zoff += incrementZ;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup_fullScreenBtn() {
  my.fullScreenBtn = createButton('?v=10 Full Screen');
  my.fullScreenBtn.mousePressed(full_screen_action);
  my.fullScreenBtn.style('font-size:42px');
}

function full_screen_action() {
  my.fullScreenBtn.remove();
  fullscreen(1);
  let delay = 3000;
  setTimeout(ui_present_window, delay);
}

function ui_present_window() {
  resizeCanvas(windowWidth, windowHeight);
}

// map(value, start1, stop1, start2, stop2, [withinBounds])

// 4D Open Simplex Noise Loop
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/137-4d-opensimplex-noise-loop
// https://youtu.be/3_0Ax95jIrk

// https://editor.p5js.org/codingtrain/sketches/MPqnctIGg
// CC 137: 4D OpenSimplex Noise Loop

// https://editor.p5js.org/codingtrain/sketches/4n5f1O6HR
// OpenSimplex Noise -- gray

// https://editor.p5js.org/jht9629-nyu/sketches/O91vtOED4
// Worley Noise frameIndex bounce

// https://editor.p5js.org/p5name/sketches/TU9CrJ1di
// ims noise class

// https://editor.p5js.org/jht9629-nyu/sketches/BSRsNJ1nj
// OpenSimplex Noise -- createGraphics

// https://editor.p5js.org/jht9629-nyu/sketches/VDYJuuQ4B
// OpenSimplex Noise -- fullScreen
