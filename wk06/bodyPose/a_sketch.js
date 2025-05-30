// https://editor.p5js.org/jht9629-nyu/sketches/xxx
// poseNet

let my = {};
my.cycleColors = ['red', 'green', 'gold', 'black'];
my.cycleIndex = 0;

function setup() {
  // createCanvas(640, 480);

  pixelDensity(1);

  my_init();

  let nh = Math.floor(windowHeight * (my.top_percent / 100));
  my.canvas = createCanvas(windowWidth, nh);

  video_setup();

  create_ui();

  // setup_dbase();
  my.waiting_for_first_mesh = 1;

  // delay any photo add for 5 secs during startup
  add_action_block(5);

  document.body.style.backgroundColor = `rgb(0,0,0)`;
}

async function video_setup() {
  //
  console.log('video_setup await video_init');

  await video_init();
  // movie_init();

  // console.log('video_setup new eff_bars');

  // my.bars = new eff_bars({ width: my.video.width, height: my.video.height });

  my.input = my.video;

  if (my.slime_mold) {
    my.slime_mold.output.remove();
  }
  my.slime_mold = slime_mold_init();

  if (my.bodyPose) {
    my.bodyPose.output.remove();
  }
  my.bodyPose = bodyPose_init();

  if (my.bestill) {
    my.bestill.output.remove();
  }
  my.bestill = new eff_bestill({ factor: 10, input: my.bodyPose.output });

  my.cycleIndex = 1;
  // my.cycleColors = ['white', 'red', 'green', 'gold', 'black'];
  // from: projects/_2025/let-america-be/src/js/a-main.js
  // my.overlayColors = ['rgba(255, 80, 80, 0.25)', 'rgba(60, 190, 70, 0.5)', 'rgba(255, 180, 60, 0.5)'];
  my.cycleColors = [
    [255, 255, 255],
    [255, 80, 80],
    [60, 190, 70],
    [255, 180, 60],
    [0, 0, 0],
  ];
  my.next_color = () => {
    my.cycleIndex = (my.cycleIndex + 1) % my.cycleColors.length;
  };
  my.current_color = () => {
    return my.cycleColors[my.cycleIndex];
  };
  my.adjacent_color = () => {
    // exclude black
    let index = (my.cycleIndex + 1) % (my.cycleColors.length - 1);
    return my.cycleColors[index];
  };
  console.log('video_setup return');
}

function slime_mold_init() {
  let { width, height } = my.video;
  let props = { width, height };

  return new eff_slime_mold(props);
  // my.slime_mold = new eff_slime_mold(props);
  // my.output = my.slime_mold.output;
}

function draw() {
  //
  photo_list_update_poll();

  proto_prune_poll();

  let str = my.photo_list.length + ' ' + my.photo_index;
  my.photo_count_span.html(str);

  my.lipsDiff = 0;

  if (!my.bodyPose || !my.bodyPose.poses) {
    console.log('no bodyPose');
  } else {
    if (my.bodyPose.poses.length > 0) {
      first_mesh_check();
    }

    check_show_hide();

    if (my.show_mesh) {
      draw_mesh();
    } else {
      image(my.video, 0, 0);
      if (my.imgLayer) {
        image(my.imgLayer, width / 2, 0);
      }
    }
  }

  // draw_slim_mold();

  if (my.fpsSpan) {
    my.fpsSpan.html(framesPerSecond() + ' ');
  }
}

function framesPerSecond() {
  return frameRate().toFixed(2);
}

function draw_slim_mold() {
  if (!my.slime_mold) {
    return;
  }
  first_mesh_check();

  // my.output.background(0);
  my.slime_mold.prepareOutput();

  let sw = my.video.width;
  let sh = my.video.height;
  let aspect = sh / sw;
  let w = width;
  let h = width * aspect;
  // blendMode(OVERLAY);
  image(my.slime_mold.output, 0, 0, w, h, 0, 0, sw, sh);
}

// BLEND, DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY, EXCLUSION, SCREEN, REPLACE,
// OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN, ADD or NORMAL
// image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight], [fit], [xAlign], [yAlign])

function draw_mesh() {
  //
  my.bodyPose.output.background(0);

  my.bodyPose.prepareOutput();

  my.bestill.prepareOutput();

  my.slime_mold.prepareOutput();
  mix_graphics(my.bestill.output, my.slime_mold.output);

  let sw = my.video.width;
  let sh = my.video.height;
  let dw = width;
  let dh = height;
  // !!@ fit
  // let aspect = sh / sw;
  // let dh = width * aspect;
  image(my.bestill.output, 0, 0, dw, dh, 0, 0, sw, sh);
}

// image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight], [fit], [xAlign], [yAlign])

// non-black pixels from input are mixed into output
//
function mix_graphics(output, input) {
  //
  output.loadPixels();
  input.loadPixels();
  let n = input.pixels.length;
  let in_r, in_g, in_b;
  let ou_r, ou_g, ou_b;
  let thresHold = 20;
  for (let index = 0; index < n; index += 4) {
    in_r = input.pixels[index];
    in_g = input.pixels[index + 1];
    in_b = input.pixels[index + 2];
    if (in_r + in_g + in_b > thresHold) {
      output.pixels[index] = in_r;
      output.pixels[index + 1] = in_g;
      output.pixels[index + 2] = in_b;
    }
  }
  output.updatePixels();
}

// wait 0.5 seconds before showing face mesh
// to avoid false flashes
function check_show_hide() {
  if (!my.show_hide_taken) {
    if (my.bodyPose.poses.length == 0) {
      hide_action();
      my.hiden_time = Date.now() / 1000;
    } else {
      if (my.hiden_time) {
        let now = Date.now() / 1000;
        let diff = now - my.hiden_time;
        if (diff > 0.5) {
          my.hiden_time = 0;
          show_action();
        } else {
          // console.log('hiden wait diff', diff);
        }
      } else {
        my.hiden_time = 0;
        show_action();
      }
    }
  }
}

function trackLipsDiff() {
  //
  if (my.face_hidden) {
    let lapse = lipsOpenLapseSecs();
    // console.log('trackLipsDiff face_hidden lapse', lapse);
    if (lapse < my.add_action_delay) {
      // console.log('trackLipsDiff return lapse', lapse, 'my.lipsOpenState', my.lipsOpenState);
      if (!lipsAreOpen()) {
        my.lipsOpenState = 0;
      }
      return;
    }
  }

  if (lipsAreOpen()) {
    if (my.lipsOpenState == 0) {
      // edge into lips opened
      my.lipsOpenStartTime = Date.now();
      my.lipsOpenCount++;
      // console.log('lips open my.lipsOpenCount', my.lipsOpenCount, 'my.lipsDiff', my.lipsDiff);
      // console.log('my.lipsOpenState', my.lipsOpenState, 'openSecs', lipsOpenLapseSecs());
      my.lipsOpenState = 1;
    } else if (my.lipsOpenState == 1) {
      // lips already open
      let lapse = lipsOpenLapseSecs();
      if (lapse > my.add_action_delay) {
        if (my.add_action_timeoutid) {
          console.log('trackLipsDiff return add_action_timeoutid', my.add_action_timeoutid);
          return;
        }
        console.log('lips open add_action', lipsOpenLapseSecs());
        add_action();
        add_action_block(my.add_action_delay);
        my.lipsOpenState = 2;
      }
    } else {
      // lips open already trigger add
      // console.log('my.lipsOpenState', my.lipsOpenState, 'openSecs', lipsOpenLapseSecs());
    }
  } else {
    // lips NOT open
    if (my.lipsOpenState) {
      lipsOpenLapseSecs();
    }
    my.lipsOpenState = 0;
  }
}

function lipsAreOpen() {
  return my.lipsDiff > 0.05;
}

function lipsOpenLapseSecs() {
  if (!lipsAreOpen()) {
    my.lipsOpenStartTime = Date.now();
    return 0;
  }
  let lapse = (Date.now() - my.lipsOpenStartTime) / 1000;
  // console.log('lipsOpenLapseSecs lapse', lapse);
  return lapse;
}

function add_action_block(delay) {
  let mdelay = delay * 1000;
  my.add_action_timeoutid = setTimeout(add_action_unblock, mdelay);
}

function add_action_unblock() {
  console.log('add_action_unblock add_action_timeoutid', my.add_action_timeoutid);
  my.add_action_timeoutid = 0;
}

function windowResized() {
  console.log('windowResized');
  resizeCanvas(windowWidth, windowHeight);
  video_setup();
}

// https://editor.p5js.org/ml5/sketches/lCurUW1TT
// faceMesh-keypoints --ml5
/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates face tracking on live video through ml5.faceMesh.
 */

// https://editor.p5js.org/jht9629-nyu/sketches/9fOM25TRl
// faceMesh-keypoints --ml5 copy

// https://editor.p5js.org/jht9629-nyu/sketches/PrJvjyxb6
// faceMesh mesh_nits

// https://editor.p5js.org/jht9629-nyu/sketches/7y2gqHeZz
// faceMesh mesh_nits v2
// scale to height

// https://editor.p5js.org/jht9629-nyu/sketches/hFnQmY-Jy
// faceMesh mesh_nits v3
// fit to width

// frameRate()
// 36.63003701391713

// https://editor.p5js.org/jht9629-nyu/sketches/p4Uu0B2sk
// faceMesh mesh_nits v4
// fill to width and height

// https://editor.p5js.org/jht9629-nyu/sketches/nDEtGRehq
// faceMesh mesh_nits v5

// https://editor.p5js.org/jht9629-nyu/sketches/fsOAbI6SJ
// faceMesh mesh_nits v6 -- stray mask

// https://editor.p5js.org/jht9629-nyu/sketches/PuoF9-3xy
// faceMesh mesh_nits v7 mask

// https://editor.p5js.org/jht9629-nyu/sketches/_3QMiI-fM
// faceMesh mesh_nits v8 bestill
