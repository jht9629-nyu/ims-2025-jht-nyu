// https://editor.p5js.org/jht9629-nyu/sketches/O91vtOED4
// Worley Noise frameIndex bounce

// adapted to use createGraphics

let points = [];
let layer;
let frameIndex = 0;
let frameDelta = 1;
let my = {};

function setup() {
  createCanvas(windowWidth, windowHeight - 55);
  // createCanvas(100, 100);
  pixelDensity(1);
  initPoints();
  initGraphics();
  setup_fullScreenBtn();
}

function initGraphics() {
  layer = createGraphics(100, 100);
}
// https://p5js.org/reference/p5/createGraphics/

function initPoints() {
  let w = 100;
  let h = 100;
  for (let i = 0; i < 20; i++) {
    let x = random(w);
    let y = random(h);
    let z = random(w);
    points[i] = { x, y, z };
    // points[i] = createVector(random(width), random(height), random(width));
  }
}

function draw() {
  updateLayer();
  let w = layer.width;
  let h = layer.height;
  image(layer, 0, 0, width, height, 0, 0, w, h);
  // image(layer, 0, 0);
}
// https://p5js.org/reference/p5/image/
// image(img, x, y, [width], [height])
// image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight], [fit], [xAlign], [yAlign])

function updateLayer() {
  layer.loadPixels();
  let w = layer.width;
  let h = layer.height;
  let ww = w * 1;
  frameIndex += frameDelta;
  if (frameIndex >= w || frameIndex < 0) {
    frameDelta = frameDelta * -1;
    frameIndex += frameDelta;
  }
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let distances = [];
      for (let i = 0; i < points.length; i++) {
        let v = points[i];
        let z = frameIndex;
        // let z = frameCount % w;
        let d = dist(x, y, z, v.x, v.y, v.z);
        distances[i] = d;
      }
      let sorted = sort(distances);

      // let r = map(sorted[0], 0, 150, 0, 255);
      // let g = map(sorted[1], 0, 50, 255, 0);
      // let b = map(sorted[2], 0, 200, 255, 0);

      // bright heart
      let r = map(sorted[0], 0, 50, 0, 255);
      let g = map(sorted[1], 0, 50, 0, 255);
      let b = map(sorted[2], 0, 50, 0, 255);

      let index = (x + y * w) * 4;
      layer.pixels[index + 0] = r;
      layer.pixels[index + 1] = g;
      layer.pixels[index + 2] = b;
      layer.pixels[index + 3] = 255;
    }
  }
  layer.updatePixels();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup_fullScreenBtn() {
  my.fullScreenBtn = createButton('?v=20 Full Screen');
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
  // init_dim();
}

// https://editor.p5js.org/codingtrain/sketches/QsiCWVczZ
// Worley Noise
// Coding in the Cabana
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/CodingInTheCabana/004-worley-noise.html
// https://youtu.be/4066MndcyCk
// p5 port: https://editor.p5js.org/codingtrain/sketches/QsiCWVczZ

// https://editor.p5js.org/jht9629-nyu/sketches/1fcRQkDrn
// Cabana! - Worley Noise Port copy

// https://editor.p5js.org/jht9629-nyu/sketches/CRYzNz14L
// Worley Noise createGraphics
