// https://editor.p5js.org/codingtrain/sketches/MPqnctIGg
// OpenSimplex Noise -- gray

// What would this look like applied to video?

const increment = 0.03;

// Just for non-looping demo
let zoff = 0;

let noise;

function setup() {
  // I made the canvas really small because it's slow for me otherwise
  createCanvas(200, 200);
  noise = new OpenSimplexNoise(Date.now());
}

function draw() {
  render();
}

function render() {
  let xoff = 0;
  for (let x = 0; x < width; x++) {
    let yoff = 0;
    for (let y = 0; y < height; y++) {
      let n;
      n = noise.noise3D(xoff, yoff, zoff);
      // console.log('n',n)
      // let bright = n > 0 ? 255 : 0;
      let bright = map(n, -1, 1, 0, 255);
      stroke(bright);
      point(x, y);
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
