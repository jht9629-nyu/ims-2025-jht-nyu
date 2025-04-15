//
// eff_simplex

//export default
class eff_simplex {
  static meta_props = [
    //
    { prop: 'uwidth', label: 'width', selection: [106, 100, 200, 300] },
    { prop: 'uheight', label: 'height', selection: [60, 100, 200, 300] },
    { prop: 'uspeed', label: 'speed', selection: [1, 0.2, 0.5, 1, 2, 4, 10] },
  ];

  // new eff_example({message_prop1, num_prop, text_prop})
  constructor(props) {
    Object.assign(this, props);
    // console.log('eff_simplex props.uspeed', props.uspeed);
    this.increment = 0.03;
    let uspeed = this.uspeed || 1;
    this.incrementZ = this.increment * uspeed;
    this.zoff = 0;
    this.noise = new OpenSimplexNoise(Date.now());
    this.initGraphics();
  }

  initGraphics() {
    let w = this.uwidth || 106;
    let h = this.uheight || 60;
    console.log('eff_worley initGraphics w h', w, h);
    this.layer = createGraphics(w, h);
    let { width, height } = this.input;
    console.log('eff_worley initGraphics width, height', width, height);
    this.output = createImage(width, height);
    // this.output = createGraphics(width, height);
    // console.log('eff_worley initGraphics width, height', width, height);
  }

  prepareOutput() {
    // console.log('eff_example prepareOutput text_prop', this.text_prop);
    let { layer, output } = this;
    this.updateLayer(layer);
    // Compute mask based on existing gray levels
    layer.loadPixels();
    let pixels = layer.pixels;
    for (let index = pixels; index < pixels.length; index += 4) {
      pixels[index + 3] = pixels[index];
    }
    layer.updatePixels();
    let sw = this.input.width;
    let sh = this.input.height;
    let img = this.input.get();
    output.copy(img, 0, 0, sw, sh, 0, 0, sw, sh);
    output.mask(layer);
    // output.image(this.input, 0, 0);
    // let sw = this.layer.width;
    // let sh = this.layer.height;
    // let dw = this.output.width;
    // let dh = this.output.height;
    // this.output.blend(this.layer, 0, 0, sw, sh, 0, 0, dw, dh, REPLACE);
  }

  // copy(srcImage, sx, sy, sw, sh, dx, dy, dw, dh)

  // BLEND, DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY, EXCLUSION, SCREEN, REPLACE,
  // OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN, ADD
  // blend(srcImage, sx, sy, sw, sh, dx, dy, dw, dh, blendMode)

  updateLayer(layer) {
    let xoff = 0;
    let w = layer.width;
    let h = layer.height;
    // layer.clear();
    for (let x = 0; x < w; x++) {
      let yoff = 0;
      for (let y = 0; y < h; y++) {
        let n;
        n = this.noise.noise3D(xoff, yoff, this.zoff);
        // console.log('n',n)
        // let bright = n > 0 ? 255 : 0;
        let bright = map(n, -1, 1, 0, 255);
        layer.stroke(bright, 255);
        layer.point(x, y);
        yoff += this.increment;
      }
      xoff += this.increment;
    }
    this.zoff += this.incrementZ;
  }
}
