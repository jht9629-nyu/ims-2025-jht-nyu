//

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
    figure_color: 0,
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
