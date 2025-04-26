// https://editor.p5js.org/jht9629-nyu/sketches/Kwe9ZrOpK
// photo-booth 31

// Capture canvas pixels to cloud as image jpg or png

// Issue: remove image will not remove it from other devices

let my = {};

function setup() {
  //
  my_setup();

  // Lowest pixel density for smaller uploads
  pixelDensity(1);

  my.colorGold = [187, 165, 61];
  my.colors = [[255, 0, 0], [0, 255, 0], my.colorGold];

  my.canvas = createCanvas(my.width, my.height);

  my.canvas.mouseReleased(canvas_mouseReleased);
  my.canvas.touchEnded(canvas_mouseReleased);

  create_ui();

  video_create();

  console.log('calling setup_dbase');

  setup_dbase();

  // for moving circle or video scan line
  my.x = 0;
  my.y = my.height / 2;
  my.xstep = 1;
  my.ystep = 0;
  my.radius = int(my.width / 10);
  my.xscan = 0;
  my.colorIndex = 0;
}

function draw() {
  //
  photo_store_changed_poll();

  draw_frame();
  // Must display the next photo_index
  // so that image that will be saved in sync
  draw_number(my.photo_index + 1);
}

function draw_frame() {
  if (my.videoFlag && !video_ready()) return;

  if (my.videoFlag) {
    // faster to get entire video frame as an image
    my.videoImg = my.video.get();
  }
  if (!my.videoImg) {
    return;
  }
  if (my.slit_scan) {
    draw_scan();
  } else {
    draw_video();
    draw_cross();
  }

  let str = my.photo_list.length + ' ' + my.photo_index;
  my.photo_count_span.html(str);
}

function draw_scan() {
  // my.videoImg.loadPixels();
  let w = my.videoImg.width;
  let h = my.videoImg.height;
  copy(my.videoImg, w / 2, 0, 1, h, my.xscan, 0, 1, h);

  my.xscan = (my.xscan + 1) % width;
}

function draw_video() {
  // background(0);
  image(my.videoImg, 0, 0);
}

function draw_cross() {
  // Draw vertical strip on the video
  noStroke();
  let acolor = my.colors[my.colorIndex];
  acolor[3] = 160; // alpha
  fill(acolor);
  // circle(my.x, my.y, my.radius);
  rect(my.x, 0, my.radius, height);

  let nextColorIndex = (my.colorIndex + 1) % my.colors.length;
  acolor = my.colors[nextColorIndex];
  acolor[3] = 160; // alpha
  fill(acolor);
  rect(0, my.y, width, my.radius);

  step_cross();
}

function step_cross() {
  my.x += my.xstep;
  if (my.x > width - my.radius) {
    my.x = random(width - my.radius);
    my.y = 0;
    my.xstep = 0;
    my.ystep = 1;
    next_color();
  }
  my.y += my.ystep;
  if (my.y > height - my.radius) {
    my.y = random(height - my.radius);
    my.x = 0;
    my.xstep = 1;
    my.ystep = 0;
    next_color();
  }
}

function toggle_cross_direction() {
  next_color();
  if (my.xstep) {
    my.x = width;
  }
  if (my.ystep) {
    my.y = height;
  }
}

function next_color() {
  my.colorIndex = (my.colorIndex + 1) % my.colors.length;
}

function draw_number(n) {
  // Convert number to string
  let str = n + '';
  let x = 10;
  let y = my.height;
  textSize(50);
  // Draw black rect background
  let a = textAscent();
  let d = textDescent();
  let h = a + d;
  let w = textWidth(str);
  fill(0);
  rect(x, y - h, w, h);
  // Draw white text
  fill(255);
  // x  y bottom-left corner.
  text(str, x, y - d);
}

function canvas_mouseReleased() {
  // console.log('canvas_mouseReleased');
  track_xy();
}

function track_xy() {
  let x = mouseX;
  let y = mouseY;
}

function mouseDragged() {
  // console.log('mouseDragged');
  // required to prevent touch drag moving canvas on mobile
  let onCanvas = mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height;
  if (onCanvas) {
    track_xy();
  }
  // return my.scrollFlag ? true : !onCanvas;
  return !onCanvas;
}

function windowResized() {
  // console.log('windowResized windowHeight', windowHeight, 'windowWidth', windowWidth);
  // my.isPortrait = windowHeight > windowWidth;
  if (my.isRemote) {
    return;
  }
  resizeCanvas(windowWidth, windowHeight);
  // console.log('windowResized width', width, 'height', height);
}

// https://editor.p5js.org/jht9629-nyu/sketches/twgS6eWRZ
// pixel-grid

// https://editor.p5js.org/jht9629-nyu/sketches/7Wjlo3pPU
// mo-pix-chip-grid jht9629 fireb_firebase.js

// https://editor.p5js.org/jht9629-nyu/sketches/CntV1JQNp
// p5moExamples pixel-grid 47

// [x] Correct display of images - must hit show button
// [x] Add --> Take, keep array of n images and upate
// [x] photo_index

// [x] my.photo_list - show only last n
//    [ { name: "", index: n }, ... ]

// [x] preserve image show order

// [x] Show other photobooths
// enabled by group settings
//   my.mo_group = 'group1';
