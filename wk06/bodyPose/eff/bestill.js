// import { image_copy_to } from '../../util/image.js?v={{vers}}';

// export default
class eff_bestill {
  // static meta_props = {
  //   factor: [10, 1, 5, 10, 20, 40, 50, 100, 200, 500, 1000, 2000, 3000, 5000, 10000],
  //   mirror: [0, 1],
  // };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  prepareOutput() {
    this.bestill_prepareOutput();
  }
  init() {
    this.stillf = [this.factor, this.factor, this.factor];
    let input = this.input;
    this.output = createGraphics(input.width, input.height);
    this.srcimage = createImage(this.output.width, this.output.height);
    this.buf = [];
    // console.log('eff_bestill stillf', this.stillf);
  }
  bestill_prepareOutput() {
    // console.log('bestill_render this', this);
    if (!this.inited) {
      this.buf_init();
      return;
    }
    let { output, srcimage, buf } = this;
    image_copy_to(srcimage, this.input);
    srcimage.loadPixels();
    output.loadPixels();
    let rf = this.stillf[0];
    let bf = this.stillf[1];
    let gf = this.stillf[2];
    let rm = rf - 1;
    let bm = bf - 1;
    let gm = gf - 1;
    // let w = srcimage.width;
    // let h = srcimage.height;
    let n = srcimage.pixels.length;
    for (let index = 0; index < n; index++) {
      buf[index + 0] = (buf[index + 0] * rm + srcimage.pixels[index + 0]) / rf;
      buf[index + 1] = (buf[index + 1] * bm + srcimage.pixels[index + 1]) / bf;
      buf[index + 2] = (buf[index + 2] * gm + srcimage.pixels[index + 2]) / gf;
      output.pixels[index + 0] = buf[index + 0];
      output.pixels[index + 1] = buf[index + 1];
      output.pixels[index + 2] = buf[index + 2];
    }
    // for (let y = 0; y < h; y += 1) {
    //   for (let x = 0; x < w; x += 1) {
    //     let ii = (w * y + x) * 4;
    //     buf[ii + 0] = (buf[ii + 0] * rm + srcimage.pixels[ii + 0]) / rf;
    //     buf[ii + 1] = (buf[ii + 1] * bm + srcimage.pixels[ii + 1]) / bf;
    //     buf[ii + 2] = (buf[ii + 2] * gm + srcimage.pixels[ii + 2]) / gf;
    //     output.pixels[ii + 0] = buf[ii + 0];
    //     output.pixels[ii + 1] = buf[ii + 1];
    //     output.pixels[ii + 2] = buf[ii + 2];
    //     // output.pixels[ii + 3] = 255;
    //   }
    // }
    output.updatePixels();
    // console.log('bestill_prepareOutput', output.pixels.length, output.pixels[1000]);
  }
  buf_init() {
    this.inited = 1;
    let { buf, output } = this;
    image_copy_to(output, this.input);
    output.loadPixels();
    let n = output.pixels.length;
    for (let index = 0; index < n; index++) {
      buf[index + 0] = output.pixels[index + 0];
      buf[index + 1] = output.pixels[index + 1];
      buf[index + 2] = output.pixels[index + 2];
    }
    // let w = output.width;
    // let h = output.height;
    // for (let y = 0; y < h; y += 1) {
    //   for (let x = 0; x < w; x += 1) {
    //     let ii = (w * y + x) * 4;
    //     buf[ii + 0] = output.pixels[ii + 0];
    //     buf[ii + 1] = output.pixels[ii + 1];
    //     buf[ii + 2] = output.pixels[ii + 2];
    //   }
    // }
    // console.log('buf_init', w, h);
  }
}
// window.eff_bestill = eff_bestill;
