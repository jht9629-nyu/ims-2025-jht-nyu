// https://editor.p5js.org/jht9629-nyu/sketches/JG8Tv5W90
// Slime Molds v1

let molds = [];
let num = 4000;
let d;
let my = {};

function setup() {
  createCanvas(windowWidth, windowHeight - 60);
  // createCanvas(640, 480);
  angleMode(DEGREES);
  d = pixelDensity();

  create_ui();

  init_molds();
}

function init_molds() {
  for (let i = 0; i < num; i++) {
    molds[i] = new Mold();
  }
}

function draw() {
  background(0, 5);
  loadPixels();

  for (let i = 0; i < num; i++) {
    molds[i].update();
    molds[i].display();
  }
}

class Mold {
  constructor() {
    // Mold variables
    // this.x = random(width);
    // this.y = random(height);
    this.x = random(width / 2 - 20, width / 2 + 20);
    this.y = random(height / 2 - 20, height / 2 + 20);
    this.r = 0.5;

    this.heading = random(360);
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);
    this.rotAngle = 45;

    // Sensor variables
    this.rSensorPos = createVector(0, 0);
    this.lSensorPos = createVector(0, 0);
    this.fSensorPos = createVector(0, 0);
    this.sensorAngle = 45;
    this.sensorDist = 10;
  }

  update() {
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);

    // Using % Modulo expression to wrap around the canvas
    this.x = (this.x + this.vx + width) % width;
    this.y = (this.y + this.vy + height) % height;

    // Get 3 sensor positions based on current position and heading
    this.getSensorPos(this.rSensorPos, this.heading + this.sensorAngle);
    this.getSensorPos(this.lSensorPos, this.heading - this.sensorAngle);
    this.getSensorPos(this.fSensorPos, this.heading);

    // Get indices of the 3 sensor positions and get the color values from those indices
    let index, l, r, f;
    index = 4 * (d * floor(this.rSensorPos.y)) * (d * width) + 4 * (d * floor(this.rSensorPos.x));
    r = pixels[index];

    index = 4 * (d * floor(this.lSensorPos.y)) * (d * width) + 4 * (d * floor(this.lSensorPos.x));
    l = pixels[index];

    index = 4 * (d * floor(this.fSensorPos.y)) * (d * width) + 4 * (d * floor(this.fSensorPos.x));
    f = pixels[index];

    // Compare values of f, l, and r to determine movement
    if (f > l && f > r) {
      this.heading += 0;
    } else if (f < l && f < r) {
      if (random(1) < 0.5) {
        this.heading += this.rotAngle;
      } else {
        this.heading -= this.rotAngle;
      }
    } else if (l > r) {
      this.heading += -this.rotAngle;
    } else if (r > l) {
      this.heading += this.rotAngle;
    }
  }

  display() {
    noStroke();
    fill(255);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);

    // line(this.x, this.y, this.x + this.r*3*this.vx, this.y + this.r*3*this.vy);
    // fill(255, 0, 0);
    // ellipse(this.rSensorPos.x, this.rSensorPos.y, this.r*2, this.r*2);
    // ellipse(this.lSensorPos.x, this.lSensorPos.y, this.r*2, this.r*2);
    // ellipse(this.fSensorPos.x, this.fSensorPos.y, this.r*2, this.r*2);
  }

  getSensorPos(sensor, angle) {
    sensor.x = (this.x + this.sensorDist * cos(angle) + width) % width;
    sensor.y = (this.y + this.sensorDist * sin(angle) + height) % height;
  }
}

function create_ui() {
  my.fullScreenBtn = createButton('?v=31 Full Screen');
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
  init_molds();
}

// function windowResized() {
//   // resizeCanvas(windowWidth, windowHeight);
//   ui_present_window();
// }

// https://editor.p5js.org/jht9629-nyu/sketches/Ol61gpdR1
// Slime Molds v0

// https://openprocessing.org/sketch/2213463

/*
----- Coding Tutorial by Patt Vira ----- 
Name: Slime Molds (Physarum)
Video Tutorial: https://youtu.be/VyXxSNcgDtg

References: 
1. Algorithm by Jeff Jones: 
https://uwe-repository.worktribe.com/output/980579/characteristics-of-pattern-formation-and-evolution-in-approximations-of-physarum-transport-networks

Connect with Patt: @pattvira
https://www.pattvira.com/
----------------------------------------
*/
