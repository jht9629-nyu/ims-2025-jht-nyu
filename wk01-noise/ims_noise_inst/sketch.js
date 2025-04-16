// https://editor.p5js.org/p5name/sketches/TU9CrJ1di
// ims noise class

let my = {};

let alphaRed = [255, 0, 0, 80];
let alphaGreen = [0, 255, 0, 80];
let alphaGold = [255, 214, 0, 80];
let colors = [alphaRed, alphaGreen, alphaGold];
let colorIndex = 0;
let colorCount = 0;
let colorCountMax = 360;

function setup() {
  my.backAlpha = 10;
  my.clearSecs = 60;
  my.canv = createCanvas(windowWidth, windowHeight - 55);
  my.ln1 = new LineNoise();
  // my.ln2 = new LineNoise({ start: 10000, rot: 45, color: alphaRed });
  // my.ln3 = new LineNoise({ start: 30000, rot: 90, color: alphaGreen });
  // my.ln4 = new LineNoise({ start: 40000, rot: 180, color: alphaGold });

  setup_fullScreenBtn();
}

function draw() {
  let backAlpha = my.backAlpha;
  let nframes = floor(frameRate() * my.clearSecs);
  if (frameCount % nframes == 0) {
    backAlpha = 255;
  }
  background(0, backAlpha);
  noFill();

  set_color();

  my.ln1.draw();
  // my.ln2.draw();
  // my.ln3.draw();
  // my.ln4.draw();
}

function set_color() {
  let col = colors[colorIndex];
  stroke(col);
  colorCount = (colorCount + 1) % colorCountMax;
  if (colorCount == 0) {
    colorIndex = (colorIndex + 1) % colors.length;
  }
}

// { inc, start, rot, rotDelta, incAccel }
class LineNoise {
  constructor(props) {
    // default properties
    this.inc = 0.001;
    // this. inc = 0.02;
    this.start = 0;
    this.rot = 0;
    // this. rotDelta = 0.0;
    this.rotDelta = 0.2;
    this.incAccel = 6;
    // this. incAccel = 2;
    // this.color = 255;
    Object.assign(this, props);
    console.log('LineNoise start', this.start, this.color);
  }

  draw() {
    push();

    translate(width / 2, height / 2);
    rotate(radians(this.rot));
    this.rot = this.rot + this.rotDelta;
    if (this.color) {
      stroke(this.color);
    }
    beginShape();
    let xoff = this.start;
    for (let x = -width; x < width; x++) {
      // let y = random(height);
      let y = (noise(xoff) - 0.5) * height;
      vertex(x, y);

      xoff += this.inc;
    }
    endShape();

    this.start += this.inc * this.incAccel;

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup_fullScreenBtn() {
  my.fullScreenBtn = createButton('?v=23 Full Screen');
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

// Graphing 1D Perlin Noise (1D Noise Graph)
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/noise/0.4-graphing-1d.html
// https://youtu.be/y7sgcFhk6ZM

// Adding Y-Axis: https://editor.p5js.org/codingtrain/sketches/nCYG2SCNq
// Noise Graph: https://editor.p5js.org/codingtrain/sketches/EZeHXBhei
// Noisy Sin: https://editor.p5js.org/codingtrain/sketches/M_kuAXwV2

// This example has been updated to use es6 syntax. To learn more about es6 visit: https://thecodingtrain.com/Tutorials/16-javascript-es6

// p5.js/1.11.1

// https://editor.p5js.org/p5name/sketches/ZO-2p0H5_
// ims noise rotate
