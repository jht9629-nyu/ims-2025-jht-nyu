// https://editor.p5js.org/jht9629-nyu/sketches/kmsBYRROJ
// Field rainstorm v1 responsive

// https://editor.p5js.org/jht9629-nyu/sketches/EUYEkY-fV
// Field rainstorm v0

// https://editor.p5js.org/picticon/sketches/Ah-OhNJ-B
// Field rainstorm by picticon

let organic = true; // randomly moves points around

let points = [];
let delaunay;
let voronoi;
let video;

// let npoints = 3000;
let npoints = 9000;
// let npoints = 2500;

let my = {};
let layer;

let centroids = new Array(npoints);
let weights = new Array(npoints);
let weightsR = new Array(npoints);
let weightsG = new Array(npoints);
let weightsB = new Array(npoints);
let counts = new Array(npoints);
let avgWeights = new Array(npoints);

function setup() {
  createCanvas(windowWidth, windowHeight);
  // createCanvas(640, 480);
  video = createCapture(VIDEO, capture_ready_callback);
  video.hide();
  // video.size(640, 480);

  setup_fullScreenBtn();
}

function capture_ready_callback() {
  console.log('capture_ready_callback width', video.width, video.height);

  let w = video.width;
  let h = video.height;
  layer = createGraphics(w, h);

  // much faster to get video pixels as image
  let img = video.get();
  for (let i = 0; i < npoints; i++) {
    let x = random(w);
    let y = random(h);
    let col = img.get(x, y);
    if (random(100) > brightness(col)) {
      points.push(createVector(x, y));
      // points.push({ x, y });
    } else {
      i--;
    }
  }
  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, w, h]);
}

function draw() {
  if (!layer) return;

  background(255);

  let w = video.width;
  let h = video.height;

  let polygons = voronoi.cellPolygons();
  let cells = Array.from(polygons);

  // console.log('cells.length', cells.length);
  // let centroids = new Array(cells.length);
  // let weights = new Array(cells.length).fill(0);
  // let weightsR = new Array(cells.length).fill(0);
  // let weightsG = new Array(cells.length).fill(0);
  // let weightsB = new Array(cells.length).fill(0);
  // let counts = new Array(cells.length).fill(0);
  // let avgWeights = new Array(cells.length).fill(0);

  // let centroids = new Array(cells.length);
  weights.fill(0);
  weightsR.fill(0);
  weightsG.fill(0);
  weightsB.fill(0);
  counts.fill(0);
  avgWeights.fill(0);
  for (let i = 0; i < centroids.length; i++) {
    centroids[i] = createVector(0, 0);
  }

  video.loadPixels();
  // NOT faster to get video pixels as image
  // let img = video.get();
  // img.loadPixels();
  let delaunayIndex = 0;
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      // let colr = img.get(i, j);
      // let [r, g, b] = colr;
      let index = (i + j * w) * 4;
      let r = video.pixels[index + 0];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      // let r = img.pixels[index + 0];
      // let g = img.pixels[index + 1];
      // let b = img.pixels[index + 2];
      let bright = (r + g + b) / 3;
      let weight = 1 - bright / 255;
      delaunayIndex = delaunay.find(i, j, delaunayIndex);
      centroids[delaunayIndex].x += i * weight;
      centroids[delaunayIndex].y += j * weight;
      weights[delaunayIndex] += weight;
      weightsR[delaunayIndex] += r * r;
      weightsG[delaunayIndex] += g * g;
      weightsB[delaunayIndex] += b * b;
      counts[delaunayIndex]++;
    }
  }

  let maxWeight = 0;
  for (let i = 0; i < centroids.length; i++) {
    if (weights[i] > 0) {
      centroids[i].div(weights[i]);
      avgWeights[i] = weights[i] / (counts[i] || 1);
      if (avgWeights[i] > maxWeight) {
        maxWeight = avgWeights[i];
      }
    } else {
      centroids[i] = points[i].copy();
    }
  }

  for (let i = 0; i < points.length; i++) {
    if (organic && random(1) > 0.98) points[i].set(random(w), random(h));
    else points[i].lerp(centroids[i], 1);
  }
  let col = [];
  for (let i = 0; i < points.length; i++) {
    let v = points[i];
    // let index = (floor(v.x) + floor(v.y) * w) * 4;
    let index = Math.floor(v.x + v.y * w) * 4;
    // let r = img.pixels[index + 0];
    // let g = img.pixels[index + 1];
    // let b = img.pixels[index + 2];
    // let r = video.pixels[index + 0];
    // let g = video.pixels[index + 1];
    // let b = video.pixels[index + 2];
    // let sw = map(avgWeights[i], 0, maxWeight, 0, 12, true);
    // let col = color(r, g, b);
    // let col = [r, g, b];
    col[0] = video.pixels[index + 0];
    col[1] = video.pixels[index + 1];
    col[2] = video.pixels[index + 2];
    if (weights[i] > 0) {
      let ra = Math.sqrt(weightsR[i] / weights[i]);
      let ga = Math.sqrt(weightsG[i] / weights[i]);
      let ba = Math.sqrt(weightsB[i] / weights[i]);
      col[0] = ra;
      col[1] = ga;
      col[2] = ba;
      // col = [ra, ga, ba];
      // col = color(ra, ga, ba);
    }
    layer.strokeWeight(0.5);
    layer.stroke(0, 0, 0);
    layer.fill(col);
    let poly = cells[i];
    layer.beginShape();
    for (let i = 0; i < poly.length; i++) {
      layer.vertex(poly[i][0], poly[i][1]);
    }
    layer.endShape();
    // point(v.x, v.y);
  }

  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, w, h]);

  image(layer, 0, 0, width, height, 0, 0, w, h);

  my.fpsSpan.html(framesPerSecond());
}

function calculateDelaunay(points) {
  let pointsArray = [];
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}

// --
function framesPerSecond() {
  return frameRate().toFixed(2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup_fullScreenBtn() {
  my.fullScreenBtn = createButton('?v=20 Full Screen');
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
