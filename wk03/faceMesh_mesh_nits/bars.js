
let colorPalette = ["red", "green", 'gold', "black"];

// let my = {};

function bars_setup(my) {
  my.scrollSeconds = 30;
  // my.debug = 1;
  my.width = 400;
  my.height = 400;
  my.n = 3;
  // =0 for left to right, else right to left scroll
  my.xtoLeft = 1;

  if (!my.debug) {
    my.width = windowWidth;
    my.height = windowHeight;
  }
  createCanvas(my.width, my.height);
  noStroke();

  fullScreenBtn = createButton("Full Screen").mousePressed(full_screen_action);
  fullScreenBtn.style("font-size:42px");

  bars_my_setup(my);
}

function bars_my_setup(my) {
  my.xlen = width / my.n;
  my.ylen = height;
  my.items = [];
  let n = my.n + 1;
  my.wide = my.xlen * n;
  for (let i = 0; i < n; i++) {
    let xpos = my.xlen * i;
    let color = colorPalette[i % colorPalette.length];
    my.items[i] = { xpos, color };
  }
  // for (let item of my.items) { console.log('item', item); }
}

function bars_draw(my) {
  let deltaSecs = deltaTime / 1000
  my.xstep = width * deltaSecs / my.scrollSeconds;
  // console.log('my.xstep', my.xstep);

  for (let item of my.items) {
    let { xpos, color } = item;
    item.xpos = (xpos + my.xstep) % my.wide;
    fill(color);
    let x = xpos - my.xlen;
    let y = 0;
    if (my.xtoLeft) {
      x = width - x;
    }
    rect(x, y, my.xlen, my.ylen);
  }
}

// --
// https://editor.p5js.org/jht9629-nyu/sketches/ZpoPuHXRo
// ims04-jht scroll color bars - no pop 

// https://editor.p5js.org/jht9629-nyu/sketches/3VKJ-q8ar
// ims03-jht scrolling color bars
// color pops on at wrap around

// From
// https://editor.p5js.org/jht1493/sketches/5LgILr8RF

// function full_screen_action() {
//   fullScreenBtn.remove();
//   fullscreen(1);
//   let delay = 3000;
//   setTimeout(ui_present_window, delay);
// }

// function ui_present_window() {
//   resizeCanvas(windowWidth, windowHeight);
//   my_setup();
// }

// https://editor.p5js.org/jht9629-nyu/sketches/3VKJ-q8ar
// ims03-jht scrolling color bars

// https://editor.p5js.org/jht9629-nyu/sketches/2pxhnehBV
// ims04-jht scroll color rate
