// https://editor.p5js.org/jht9629-nyu/sketches/87bm2iiek
// ims01-Vi v1

//the sketch makes circles that randomly moves around the space and changes size
//if the distance between two circles are close enough, a vector will be made to connect them together

let movers = [];
let maxLineLength = 130;
let colors = ["white", "#424547", "#9E9D9A", "#CAC7C7", "#373838"];

function setup() {
  createCanvas(900, 900);
  strokeWeight(width * 0.001);
  for (let i = 0; i < 100; i++) {
    movers.push(new Mover());
  }
}

function draw() {
  background(0);
  for (let i = 0; i < movers.length; i++) {
    let p1 = createVector(movers[i].currentX, movers[i].currentY);
    for (let j = movers.length - 1; j >= 0; j--) {
      let p2 = createVector(movers[j].currentX, movers[j].currentY);
      let dst = p5.Vector.dist(p1, p2);
      if (dst < maxLineLength && i < j) {
        connect(p1, p2);
      }
    }
  }
  for (let m of movers) {
    m.show();
    m.move();
  }
}

function connect(p1, p2) {
  let dst = p5.Vector.dist(p1, p2);
  let sw = map(dst, 0, maxLineLength, width * 0.003, 0);
  push();
  // stroke(random(colors));
  stroke('#ffffff');
  strokeWeight(sw);
  line(p1.x, p1.y, p2.x, p2.y);
  pop();
}

function easeInOutQuart(x) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

class Mover {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.d = random(0.001, 0.05) * width;
    this.currentX = this.x;
    this.currentY = this.y;
    this.currentD = this.d;
    this.initialization();
    this.t = -int(random(200));
  }

  show() {
    noFill();
    // stroke(random(colors));
    stroke('#ffffff');
    strokeWeight(width * 0.0008);
    circle(this.currentX, this.currentY, this.currentD);
  }

  move() {
    if (0 < this.t && this.t < this.t1) {
      let n = easeInOutQuart(norm(this.t, 0, this.t1 - 1));
      this.currentX = lerp(this.pastX, this.targetX, n);
      this.currentY = lerp(this.pastY, this.targetY, n);
      this.currentD = lerp(this.pastD, this.targetD, n);
    }
    if (this.t2 < this.t) {
      this.initialization();
    }
    this.t++;
  }

  initialization() {
    this.t = -int(random(0));
    this.t1 = 80;
    this.t2 = this.t1 + int(random(0));
    this.pastX = this.currentX;
    this.pastY = this.currentY;
    this.pastD = this.currentD;
    do {
      this.targetX = this.currentX + random([-1, 1]) * width * random(0.3);
      this.targetY = this.currentY + random([-1, 1]) * width * random(0.3);
      this.targetD = random(0.001, 0.05) * width;
    } while (
      this.targetX < 0 ||
      width < this.targetX ||
      this.targetY < 0 ||
      height < this.targetY
    );
  }
}

// https://editor.p5js.org/ViDolan/sketches/kXK6vGmiTt
// ims01-Vi

//https://openprocessing.org/sketch/2451303
//the sketch makes circles that randomly moves around the space and changes size
//if the distance between two circles are close enough, a vector will be made to connect them together
