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
    // this.output = createImage(width, height);
    this.layer2 = createGraphics(width, height);
    this.output = createGraphics(width, height);
    // console.log('eff_worley initGraphics width, height', width, height);
  }

  prepareOutput() {
    // console.log('eff_example prepareOutput text_prop', this.text_prop);
    let { layer, layer2, output } = this;
    this.updateLayer(layer);

    // layer2 = Scale up low rez noise image to input rez
    let sw = this.layer.width;
    let sh = this.layer.height;
    let dw = layer2.width;
    let dh = layer2.height;
    layer2.image(layer, 0, 0, dw, dh, 0, 0, sw, sh);

    let srcImage = this.input.get();
    srcImage.loadPixels();
    layer2.loadPixels();
    output.background(0);
    output.loadPixels();
    console.log('layer2.pixels.length', layer2.pixels.length);
    for (let index = 0; index < layer2.pixels.length; index += 4) {
      let srcPix = layer2.pixels[index];
      // console.log('', index, srcPix);
      // if (srcPix) {
      output.pixels[index] = srcImage.pixels[index];
      output.pixels[index + 1] = srcImage.pixels[index + 1];
      output.pixels[index + 2] = srcImage.pixels[index + 2];
      // console.log('', output.pixels[index], output.pixels[index + 1], output.pixels[index + 2]);
      // }
    }
    // output.updatePixels();

    output.image(layer2, 0, 0);
    // output.image(srcImage, 0, 0);
  }

  // image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight], [fit], [xAlign], [yAlign])

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
