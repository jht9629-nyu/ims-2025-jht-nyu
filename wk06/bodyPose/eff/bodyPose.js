// import { ui_message } from '../../core-ui/a_ui_create.js?v={{vers}}';
// import { image_copy_to } from '../../util/image.js?v={{vers}}';

class eff_bodyPose {
  static meta_props = {
    alpha: [255, 230, 180, 100, 10],
    ndetect: [4, 1, 2, 3],
    figure_color: [0, 1],
    stroke_weight: [0, 1, 2, 4, 8],
    _points: [0, 1],
    points_size: [10, 20, 30, 40],
    points_color_offset: [0, 1, 2, 3],
    _skel: [0, 1],
    skel_weight: [1, 5, 10, 20],
    skel_color_offset: [0, 1, 2, 3],
    hflip: [1, 0],
    show_head: [1, 0],
  };
  constructor(props) {
    // console.log('eff_pose_net init');
    Object.assign(this, props);
    this.init();
  }
  prepareOutput() {
    // console.log('eff_pose_net prepareOutput poseNet', this.bodyPose);
    if (this.bodyPose) {
      this.bodyPose.video = this.video;
    }
    window.a_poses = this.poses;
    let layer = this.output;
    if (this.points) this.drawKeypoints(layer, this.poses);
    if (this.skel) this.drawSkeleton(layer, this.poses);
    this.drawFigure(layer, this.poses);
  }
  init() {
    // console.log('eff_pose_net this.input.elt', this.input.elt);

    let w = this.input.width;
    let h = this.input.height;
    if (this.hi_rez) {
      w = this.eff_spec.urect.width;
      h = this.eff_spec.urect.height;
    }
    console.log('eff_pose_net w, h', w, h);
    this.output = createGraphics(w, h);
    this.output.noStroke();

    this.video = this.input.elt;
    this.poses = [];

    if (this.figure_color) {
      // Copy of input for getting color
      let w = this.input.width;
      let h = this.input.height;
      this.img = createImage(w, h);
      this.init_input = this.input;
    }

    ui_message('loading model...');
    // let options = { flipHorizontal: this.hflip, maxPoseDetections: this.ndetect };
    this.bodyPose = ml5.bodyPose('MoveNet', { flipped: this.hflip }, () => {
      console.log('eff_bodyPose modelLoaded!');
      ui_message('');
      this.bodyPose.detectStart(this.input, (results) => {
        // console.log('eff_bodyPose results', results);
        this.poses = results;
        a_poses = results;
      });
    });
    // this.bodyPose.on('pose', (results) => {
    //   // console.log('eff_pose_net pose results.length', results.length);
    //   this.poses = results;
    // });
  }
  drawFigure(layer, poses) {
    my.lipsDiff = 0;
    if (this.figure_color) {
      image_copy_to(this.img, this.init_input);
    }
    // noFill();
    layer.strokeWeight(this.stroke_weight);
    let urect = this.eff_spec.urect;
    // let w = urect.width;
    let h = urect.height;
    this.px0 = urect.x0;
    this.py0 = urect.y0;
    this.r1 = h / this.input.height;
    // Loop through all the poses detected
    let n = min(this.ndetect, poses.length);
    for (let i = 0; i < n; i++) {
      let pose = poses[i];

      let cols = my.adjacent_color();
      // let cols = dot_colors[i % dot_colors.length];
      let colf;
      if (this.figure_color) {
        let x1 = pose.nose.x;
        let y1 = pose.nose.y;
        if (this.hflip) {
          x1 = this.img.width - x1;
        }
        colf = this.img.get(x1, y1);
      } else {
        colf = cols;
      }
      cols[3] = this.alpha;
      colf[3] = this.alpha;
      layer.stroke(cols);
      layer.fill(colf);

      this.draw_pose(layer, pose);

      my.lipsDiff = 1;
    }
  }
  draw_pose(layer, pose) {
    this.draw_top(layer, pose);
    this.draw_torso(layer, pose);
  }
  draw_top(layer, pose) {
    let { px0, py0, r1 } = this;

    let x1 = pose.right_shoulder.x * r1 + px0;
    let y1 = pose.right_shoulder.y * r1 + py0;
    let x2 = pose.left_shoulder.x * r1 + px0;
    let y2 = pose.left_shoulder.y * r1 + py0;

    let x0 = pose.nose.x * r1 + px0;
    let y0 = pose.nose.y * r1 + py0;

    let dx = x2 - x1;
    let dy = y2 - y1;
    // + Math.PI needed for flipHorizontal: 1
    let a = atan2(dy, dx);
    if (this.hflip) a += Math.PI;

    let x3 = x1 + dx / 2;
    let y3 = y1 + dy / 2;

    let fh = dist(x3, y3, x0, y0);
    let fw = abs(pose.right_ear.x - pose.left_ear.x) * r1;
    let w = fw / 8;
    let h = fh / 2;

    layer.push();
    layer.translate(x3, y3);
    layer.rotate(a);

    if (this.show_head) {
      layer.ellipse(0, -2 * h, fw, fh);
    }

    // Neck
    let x4 = 0 - w;
    let y4 = 0 - h;
    let x5 = 0 + w;
    let y5 = 0 - h;
    let x6 = 0 - 2 * w;
    let y6 = 0;
    let x7 = 0 + 2 * w;
    let y7 = 0;
    layer.quad(x4, y4, x5, y5, x7, y7, x6, y6);

    layer.pop();

    this.w = w;
    this.h = h;
  }
  draw_torso(layer, pose) {
    let { px0, py0, r1, h } = this;
    let x1 = pose.right_shoulder.x * r1 + px0;
    let y1 = pose.right_shoulder.y * r1 + py0;
    let x2 = pose.left_shoulder.x * r1 + px0;
    let y2 = pose.left_shoulder.y * r1 + py0;
    let x3 = pose.left_hip.x * r1 + px0;
    let y3 = pose.left_hip.y * r1 + py0;
    let x4 = pose.right_hip.x * r1 + px0;
    let y4 = pose.right_hip.y * r1 + py0;
    let x5 = x4 + (x3 - x4) / 6;
    let y5 = y1 + ((y4 - y1) * 2) / 3;
    let x6 = x3 - (x3 - x4) / 6;
    let y6 = y2 + ((y3 - y2) * 2) / 3;
    // quad(x1, y1, x2, y2, x3, y3, x4, y4);
    layer.quad(x1, y1, x2, y2, x6, y6, x5, y5);
    layer.quad(x5, y5, x6, y6, x3, y3, x4, y4);

    // Arms
    this.draw_limb(layer, pose.right_elbow, pose.right_wrist, x1, y1, h);
    this.draw_limb(layer, pose.left_elbow, pose.left_wrist, x2, y2, h);

    // Legs
    let hh = h / 2;
    let hhy = hh;
    if (!this.hflip) hh = -hh;
    this.draw_limb(layer, pose.right_knee, pose.right_ankle, x4 - hh, y4 - hhy, h);
    this.draw_limb(layer, pose.left_knee, pose.left_ankle, x3 + hh, y3 - hhy, h);
  }
  draw_limb(layer, elbow, wrist, x2, y2, h) {
    let { px0, py0, r1 } = this;
    let x1 = elbow.x * r1 + px0;
    let y1 = elbow.y * r1 + py0;
    let hh = h / 2;
    y2 += hh;
    // circle(x2, y2, h);
    let dx = x2 - x1;
    let dy = y2 - y1;
    let r = hh;
    let a = atan2(dy, dx);
    let x3 = x2 + r * cos(a - HALF_PI);
    let y3 = y2 + r * sin(a - HALF_PI);
    let x4 = x2 + r * cos(a + HALF_PI);
    let y4 = y2 + r * sin(a + HALF_PI);
    r = hh / 2;
    let x5 = x1 + r * cos(a - HALF_PI);
    let y5 = y1 + r * sin(a - HALF_PI);
    let x6 = x1 + r * cos(a + HALF_PI);
    let y6 = y1 + r * sin(a + HALF_PI);
    layer.quad(x3, y3, x4, y4, x6, y6, x5, y5);
    this.draw_fore_limb(layer, wrist, x1, y1, r);

    layer.circle(x2, y2, h);
  }
  draw_fore_limb(layer, wrist, x1, y1, r) {
    let { px0, py0, r1 } = this;
    let x0 = wrist.x * r1 + px0;
    let y0 = wrist.y * r1 + py0;
    // circle(x1, y1, r * 2);
    let dx = x1 - x0;
    let dy = y1 - y0;
    let a = atan2(dy, dx);
    let x3 = x1 + r * cos(a - HALF_PI);
    let y3 = y1 + r * sin(a - HALF_PI);
    let x4 = x1 + r * cos(a + HALF_PI);
    let y4 = y1 + r * sin(a + HALF_PI);
    let x5 = x0 + r * cos(a - HALF_PI);
    let y5 = y0 + r * sin(a - HALF_PI);
    let x6 = x0 + r * cos(a + HALF_PI);
    let y6 = y0 + r * sin(a + HALF_PI);
    layer.quad(x3, y3, x4, y4, x6, y6, x5, y5);
    // circle(x0, y0, r * 2);
    this.draw_hand_foot(layer, x0, y0, r, a);

    layer.circle(x0, y0, r * 2);
    layer.circle(x1, y1, r * 2);
  }
  draw_hand_foot(layer, x0, y0, r, a) {
    // r = r * 0.75;
    let x2 = x0 - 1 * r * cos(a);
    let y2 = y0 - 1 * r * sin(a);
    let x1 = x0 - 3 * r * cos(a);
    let y1 = y0 - 3 * r * sin(a);
    let r1 = r * 0.75;
    let x3 = x2 + r1 * cos(a - HALF_PI);
    let y3 = y2 + r1 * sin(a - HALF_PI);
    let x4 = x2 + r1 * cos(a + HALF_PI);
    let y4 = y2 + r1 * sin(a + HALF_PI);
    let r2 = r * 1.5;
    let x5 = x1 + r2 * cos(a - HALF_PI);
    let y5 = y1 + r2 * sin(a - HALF_PI);
    let x6 = x1 + r2 * cos(a + HALF_PI);
    let y6 = y1 + r2 * sin(a + HALF_PI);
    layer.quad(x3, y3, x4, y4, x6, y6, x5, y5);
  }
  drawKeypoints(layer, poses) {
    // fill('yellow');
    noStroke();
    let urect = this.eff_spec.urect;
    // let w = urect.width;
    let h = urect.height;
    let px0 = urect.x0;
    let py0 = urect.y0;
    let r1 = h / this.input.height;
    let len = this.points_size;
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let ii = i + this.points_color_offset;
      let col = dot_colors[ii % dot_colors.length];
      col[3] = this.alpha;
      layer.fill(col);
      let pose = poses[i].pose;
      for (let j = 0; j < pose.keypoints.length; j++) {
        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
        let keypoint = pose.keypoints[j];
        // Only draw an ellipse is the pose probability is bigger than 0.2
        if (keypoint.score > 0.2) {
          // ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
          let { x, y } = keypoint.position;
          x = x * r1 + px0;
          y = y * r1 + py0;
          layer.ellipse(x, y, len, len);
        }
      }
    }
  }
  drawSkeleton(layer, poses) {
    layer.strokeWeight(this.skel_weight);
    // stroke('red');
    let urect = this.eff_spec.urect;
    // let w = urect.width;
    let h = urect.height;
    let px0 = urect.x0;
    let py0 = urect.y0;
    let r1 = h / this.input.height;
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
      // For every skeleton, loop through all body connections
      let ii = i + this.skel_color_offset;
      let col = dot_colors[ii % dot_colors.length];
      col[3] = this.alpha;
      layer.stroke(col);
      let skeleton = poses[i].skeleton;
      for (let j = 0; j < skeleton.length; j++) {
        let skel = skeleton[j];
        let partA = skel[0].position;
        let partB = skel[1].position;
        let x1 = partA.x;
        let y1 = partA.y;
        let x2 = partB.x;
        let y2 = partB.y;
        x1 = x1 * r1 + px0;
        y1 = y1 * r1 + py0;
        x2 = x2 * r1 + px0;
        y2 = y2 * r1 + py0;
        layer.line(x1, y1, x2, y2);
      }
    }
  }
}

let a_alpha = 255; // will be overriden by meta_props
let dot_colors = [
  [255, 255, 0, a_alpha],
  [0, 255, 0, a_alpha],
  [255, 0, 0, a_alpha],
  [255, 255, 255, a_alpha],
];

// For debugging
let a_poses;

// https://learn.ml5js.org/#/reference/posenet
// https://editor.p5js.org/ml5/sketches/PoseNet_webcam
