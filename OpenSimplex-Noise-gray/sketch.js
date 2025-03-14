// https://editor.p5js.org/jht9629-nyu/sketches/BSRsNJ1nj
// OpenSimplex Noise -- createGraphics

// What would this look like applied to video?

const increment = 0.03;
// Just for non-looping demo
let zoff = 0;
let noise;

// adapted to use createGraphics
let layer;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // I made the canvas really small because it's slow for me otherwise
  // createCanvas(200, 200);
  pixelDensity(1);
  initGraphics();
  noise = new OpenSimplexNoise(Date.now());
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
  zoff += increment;
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
