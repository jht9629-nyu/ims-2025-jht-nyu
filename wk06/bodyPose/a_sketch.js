// https://editor.p5js.org/jht9629-nyu/sketches/xxx
// poseNet

let my = {};
let colorPalette = ['red', 'green', 'gold', 'black'];

function setup() {
  // createCanvas(640, 480);

  pixelDensity(1);

  my_init();

  let nh = Math.floor(windowHeight * (my.top_percent / 100));
  my.canvas = createCanvas(windowWidth, nh);

  video_setup();

  create_ui();

  setup_dbase();

  // delay any photo add for 5 secs during startup
  add_action_block(5);
}

async function video_setup() {
  //
  console.log('video_setup await video_init');

  await video_init();
  // movie_init();

  // console.log('video_setup new eff_bars');

  my.bars = new eff_bars({ width: my.video.width, height: my.video.height });

  my.input = my.video;

  bodyPose_init();

  my.bestill = new eff_bestill({ factor: 10, input: my.output });

  console.log('video_setup return');
}

function bodyPose_init() {
  // my.output = createGraphics(width, height);
  // // my.output.noStroke();
  // my.output.clear();
  let eff_spec = {
    ipatch: 2,
    imedia: 1,
    eff_label: 'bodyPose',
    urect: {
      x0: 0,
      y0: 0,
      width: width,
      height: height,
    },
  };
  let props = {
    eff_spec,
    input: my.video,
    hi_rez: 1,
    alpha: 255,
    ndetect: 1,
    figure_color: 1,
    stroke_weight: 0,
    points: 0,
    points_size: 10,
    points_color_offset: 0,
    skel: 0,
    skel_weight: 0,
    skel_color_offset: 0,
    hflip: 0,
    show_head: 1,
  };
  my.bodyPose = new eff_bodyPose(props);

  my.output = my.bodyPose.output;
}

function draw() {
  //
  photo_list_update_poll();

  proto_prune_poll();

  let str = my.photo_list.length + ' ' + my.photo_index;
  my.photo_count_span.html(str);

  if (my.imgLayer) {
    let clr = my.imgLayer.get(0, 0);
    document.body.style.backgroundColor = `rgb(${clr[0]},${clr[1]},${clr[2]}`;
  } else {
    let clr = [0, 0, 0];
    document.body.style.backgroundColor = `rgb(${clr[0]},${clr[1]},${clr[2]}`;
  }

  my.lipsDiff = 0;

  if (!my.bodyPose || !my.bodyPose.poses) return;

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

function draw_mesh() {
  // my.output.background(my.avg_color);
  my.output.background(0);

  my.bodyPose.prepareOutput();

  my.bestill.prepareOutput();

  let aspect = my.video.height / my.video.width;
  let w = my.output.width;
  let h = my.output.width * aspect;
  image(my.bestill.output, 0, 0, w, h);

  // image(my.bestill.output, 0, 0);
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
