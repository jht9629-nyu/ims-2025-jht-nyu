//

// !!@ flipH=true does not preview correctly
// unless capture is sized immediately
let flipH = true;
// let flipH = false;

async function video_init() {
  //
  await mediaDevices_preflight();

  await video_init_capture();
}

// Create the webcam video and hide it
//
async function video_init_capture() {
  // console.log('video_init_capture enter');
  //
  await mediaDevices_enum();

  if (!my.mediaDevices.length) {
    console.log('video_init_capture No my.mediaDevices');
    return;
  }

  let mediaDev = my.mediaDevices[0];

  if (my.video) {
    my.video.remove();
  }
  my.video = await mediaDevice_create_capture(mediaDev, { flipped: flipH });

  my.video.hide();

  console.log('video_init_capture my.video.width, my.video.height', my.video.width, my.video.height);

  video_init_mask();
}

function video_init_mask() {
  let { width, height } = my.video;
  my.videoMask = createGraphics(width, height);
  my.videoBuff = createGraphics(width, height);
}

// image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight]

// let capture = createCapture(VIDEO, function (stream)
// try {
// } catch (err) {
//   console.log('init_device_capture err', err);
//   alert('init_device_capture err=' + err);
// }
