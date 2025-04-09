// https://editor.p5js.org/jht9629-nyu/sketches/v_diZAkZQ
// ims02 Unexpected-cut-mask

let my = {};
let layer;
let layer2;

let bodySegmentation;
let video;
let segmentation;
let personImage;

// the shader variable
let camShader;

function preload() {
  // load the shader
  camShader = loadShader('effect.vert', 'effect.frag');

  let options = {
    maskType: 'person',
    flipped: true,
  };
  bodySegmentation = ml5.bodySegmentation('BodyPix', options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  video = createCapture(VIDEO, { flipped: true }, capture_ready_callback);
  // video.size(windowWidth, windowHeight);
  video.size(1920, 1080);
  // video.size(960, 540);
  video.hide();

  bodySegmentation.detectStart(video, gotSegmentationResults);
  // frameRate(30);

  setup_fullScreenBtn();
}

function capture_ready_callback() {
  initGraphics();
}

// Callback for body segmentation
function gotSegmentationResults(result) {
  segmentation = result;
}

function initGraphics() {
  console.log('initGraphics width', video.width, video.height);
  let w = video.width;
  let h = video.height;
  layer = createGraphics(w, h);
  layer2 = createGraphics(w, h);
  // shaders require WEBGL mode to work
  shaderLayer = createGraphics(w, h, WEBGL);
  shaderLayer.noStroke();
}

function draw() {
  if (!layer || !segmentation) return;

  // background(255);

  render_layer();

  render_shader();

  image(layer, 0, 0, width, height, 0, 0, layer.width, layer.height);

  if (my.fpsSpan) {
    my.fpsSpan.html(framesPerSecond());
  }
}

function render_layer() {
  layer.background(0);
  // layer.clear();
  let w = video.width;
  let h = video.height;
  layer.image(video, 0, 0, w, h);
  layer.image(segmentation.mask, 0, 0, w, h);
}

function render_shader() {
  //
  let w = layer.width;
  let h = layer.height;

  // shader() sets the active shader with our shader
  shaderLayer.shader(camShader);

  // lets just send the cam to our shader as a uniform
  camShader.setUniform('tex0', video);
  // console.log(cam)
  // also send the size of 1 texel on the screen
  // camShader.setUniform('texelSize', [2.5 / width, 2.5 / height]);
  camShader.setUniform('texelSize', [2.5 / w, 2.5 / h]);
  // can play around with the ratio for cool effects like edge blurring
  // (original 1.0 for both)

  // shaderLayer.ellipse(0, 0, width, height);
  shaderLayer.rect(0, 0, w, h);
  {
    layer2.push();
    layer2.translate(w, 0);
    layer2.scale(-1, 1);
    layer2.image(shaderLayer, 0, 0);
    layer2.pop();
  }
  layer2.image(segmentation.mask, 0, 0);
  // layer2.mask(segmentation.mask);

  // layer.image(layer2, 0, 0);
  {
    layer.push();
    layer.translate(w, 0);
    layer.scale(-1, 1);
    let img = layer2.get();
    // img.mask(segmentation.mask);
    layer.blendMode(EXCLUSION);
    layer.image(img, 0, 0);
    // layer.blend(img, 0, 0, w, h, 0, 0, w, h, EXCLUSION);
    // layer.image(layer2, 0, 0);
    layer.pop();
  }
  // ADD SOFT_LIGHT OVERLAY DIFFERENCE EXCLUSION
}

// https://p5js.org/reference/p5/blendMode/

// BLEND, DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY, EXCLUSION, SCREEN, REPLACE,
// OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN, ADD or NORMAL
// blend(srcImage, sx, sy, sw, sh, dx, dy, dw, dh, blendMode)

// image(img, x, y, [width], [height])
// image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight], [fit], [xAlign], [yAlign])

// --
function framesPerSecond() {
  return frameRate().toFixed(2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup_fullScreenBtn() {
  my.fullScreenBtn = createButton('?v=17 Full Screen');
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

// https://editor.p5js.org/jht9629-nyu/sketches/xK1q0EIQz
// Unexpected cut by Fabr v1

// https://editor.p5js.org/jht9629-nyu/sketches/Z3eRvpZqL0
// Unexpected cut by FabriGu v0

// https://editor.p5js.org/FabriGu/sketches/KXXLxkNmd
// Unexpected cut by FabriGu

// !!@ glitch path broken
// Original Sketch: https://glitch.com/edit/#!/tinted-glittery-feta?path=effect.vert%3A1%3A0

// https://docs.ml5js.org/#/reference/body-segmentation
