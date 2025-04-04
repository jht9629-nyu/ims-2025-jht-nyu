// https://editor.p5js.org/jht9629-nyu/sketches/uAk60oX6b
// createVideo v0

function setup() {
  noCanvas();

  // Load a video and add it to the page.
  // Note: this may not work in some browsers.
  let video = createVideo('small.mp4');

  // Show the default video controls.
  video.showControls();

  // !!@ error if enabled
  // TypeError: Cannot read properties of null (reading 'parentNode')
  // describe('A video of a toy robot with playback controls beneath it.');
}

// https://p5js.org/reference/p5/createVideo/
