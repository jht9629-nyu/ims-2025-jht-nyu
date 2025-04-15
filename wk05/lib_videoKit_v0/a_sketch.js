// https://editor.p5js.org/jht9629-nyu/sketches/M8qZkYc53
// lib videoKit v0
// https://editor.p5js.org/jht9629-gmail/sketches/ChKhQltFe
// p5moRelease videoKit 407 v0

// home for library routines
let videoKit;

// setup_dbase state for moLib
let my = {};

function setup() {
  // disables FES to improve performance
  p5.disableFriendlyErrors = true;

  // Lowest pixel density for performance
  pixelDensity(1);

  // Need some starting dimensions for canvas.
  // Make it small, size will get adjusted by UI (user interface) later in startup
  my.canvas = createCanvas(100, 100);

  // must call createCanvas before new p5videoKit

  // init videoKit
  videoKit_setup();

  // setup_dbase();
}

function draw() {
  videoKit.draw();
}

// https://editor.p5js.org/shawn/sketches/jZQ64AMJc
// p5LiveMedia Test Video
// https://github.com/vanevery/p5LiveMedia
