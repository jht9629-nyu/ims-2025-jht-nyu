//
// eff_simplex

//export default
class eff_simplex {
  static meta_props = [
    //
    { prop: 'uwidth', label: 'width', selection: [100, 200, 300] },
    // { prop: 'uheight', label: 'height', selection: [60, 100, 200, 300] },
    { prop: 'uspeed', label: 'speed', selection: [1, 0.05, 0.1, 0.2, 0.5, 1, 2, 4, 10] },
    { prop: 'umix', label: 'mix', selection: [0.5, 0.1, 0.2, 0.5, 0.6, 0.7, 0.8, 0.9] },
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
    let { width, height } = this.input;
    console.log('eff_worley initGraphics width, height', width, height);
    // this.output = createImage(width, height);
    this.prepLayer = createGraphics(width, height);
    this.output = createGraphics(width, height);
    // console.log('eff_worley initGraphics width, height', width, height);
    //
    let aspectRatio = height / width;
    let w = this.uwidth || 100;
    let h = Math.floor(w * aspectRatio);
    console.log('eff_worley initGraphics w h', w, h);
    this.noiseLayer = createGraphics(w, h);
  }

  prepareOutput() {
    // console.log('eff_example prepareOutput text_prop', this.text_prop);
    let { noiseLayer, prepLayer, output } = this;
    this.updateLayer(noiseLayer);

    // prepLayer = Scale up low rez noise image to input rez
    let sw = this.noiseLayer.width;
    let sh = this.noiseLayer.height;
    let dw = prepLayer.width;
    let dh = prepLayer.height;
    prepLayer.image(noiseLayer, 0, 0, dw, dh, 0, 0, sw, sh);

    // Output starts out black
    output.background(0);

    // input (video) is combined with prepLayer (noise) and canvas
    //
    let srcImage = this.input.get();
    srcImage.loadPixels();
    prepLayer.loadPixels();
    output.loadPixels();
    loadPixels();
    // console.log('prepLayer.pixels.length', prepLayer.pixels.length);
    // mixLevel determines if pixel comes from input
    // or canvas
    let mixLevel = this.umix || 0.5;
    //
    // x, y, step maps to canvas dimension
    let x = 0;
    let y = 0;
    let w = width;
    let step = w / dw;
    // console.log('eff_simplex step', step);
    for (let index = 0; index < prepLayer.pixels.length; index += 4) {
      let pix = prepLayer.pixels[index];
      let mix = pix / 255;
      if (mix > mixLevel) {
        output.pixels[index] = srcImage.pixels[index];
        output.pixels[index + 1] = srcImage.pixels[index + 1];
        output.pixels[index + 2] = srcImage.pixels[index + 2];
      } else {
        let cindex = (x + y * w) * 4;
        output.pixels[index] = pixels[cindex + 0];
        output.pixels[index + 1] = pixels[cindex + 1];
        output.pixels[index + 2] = pixels[cindex + 2];
      }
      x += step;
      if (x >= w) {
        x = 0;
        y += step;
      }
    }
    output.updatePixels();
    //
    // output.image(prepLayer, 0, 0);
    // output.image(srcImage, 0, 0);
  }

  // image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight], [fit], [xAlign], [yAlign])

  // copy(srcImage, sx, sy, sw, sh, dx, dy, dw, dh)

  // BLEND, DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY, EXCLUSION, SCREEN, REPLACE,
  // OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN, ADD
  // blend(srcImage, sx, sy, sw, sh, dx, dy, dw, dh, blendMode)

  updateLayer(noiseLayer) {
    let xoff = 0;
    let w = noiseLayer.width;
    let h = noiseLayer.height;
    // noiseLayer.clear();
    for (let x = 0; x < w; x++) {
      let yoff = 0;
      for (let y = 0; y < h; y++) {
        let n;
        n = this.noise.noise3D(xoff, yoff, this.zoff);
        // console.log('n',n)
        // let bright = n > 0 ? 255 : 0;
        let bright = map(n, -1, 1, 0, 255);
        noiseLayer.stroke(bright);
        noiseLayer.point(x, y);
        yoff += this.increment;
      }
      xoff += this.increment;
    }
    this.zoff += this.incrementZ;
  }
}
