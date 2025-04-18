// https://editor.p5js.org/jht9629-nyu/sketches/nDXZJsqoY
// multi-video key start v7
// preload vs. completion call back
// fork of repo with original issue
// https://github.com/p5videoKit/ims03-olivia-GirlTime

// keys to start/stop video 1,2 | 3,4 | 5,6 | 7,8 | 9,0 | -,=
// 6 videos are layout in top quarter of canvas
// space key OR mouse press to show next 1 of 12 videos
// video is displayed centered in the window
// console.log must be used sparingly, affects performance

let my = {};
// Fork of source repo to preserve copy of media
// github pages used to share media across sketches
my.videoRootPath = 'https://p5videokit.github.io/ims03-olivia-GirlTime/images';
my.nvideos = 12;

function setup() {
  createCanvas(windowWidth, windowHeight - 60);

  my.videoIndex = 0;
  my.videos = [];
  my.videoPaths = [];
  my.videoShowTile = [];
  my.videoWaitingCount = my.nvideos;
  console.log('setup', secs());
  // console.time('setup_video');

  for (let num = 1; num <= my.nvideos; num++) {
    setup_video_num(num);
  }
  create_ui();

  // my.videos[0].play();
  // Attempting to play video before ui guesture gives error
  /*
  🌸 p5.js says: The media that tried to play (with
  'https://p5videokit.github.io/ims03-olivia-GirlTime/images/1.mov') 
  wasn't allowed to by this browser, 
  most likely due to the browser's autoplay policy.
  */
}

function setup_video_num(num) {
  let path = `${my.videoRootPath}/${num}.mov`;
  // console.log('path', path);
  let vid = createVideo(path, () => {
    console.log('setup_video_num videoWaitingCount', my.videoWaitingCount);
    my.videoWaitingCount--;
    if (my.videoWaitingCount == 0) {
      my.videoReady = true;
      console.log('setup_video_num videoReady', secs());
      // console.timeEnd('setup_video');
    }
  });
  vid.hide();
  my.videos.push(vid);
  my.videoPaths.push(path);
}

function draw() {
  background(220);
  //
  // draw selected video in center
  let vid = my.videos[my.videoIndex];
  let x = width * 0.25;
  let y = height * 0.25;
  let w = width * 0.5;
  let h = height * 0.5;
  image(vid, x, y, w, h);
  //
  draw_video_tiles();
}

// 6 videos are layout in top quarter of canvas
function draw_video_tiles() {
  let n = my.videoShowTile.length;
  for (let index = 0; index < n; index++) {
    let state = my.videoShowTile[index];
    // console.log('draw_updateVideos index', index, 'state', state);
    let frac = 1 / 6;
    if (state) {
      let vid = my.videos[index];
      let x = width * frac * index;
      let y = 0;
      let w = width * frac;
      let h = height * 0.25;
      // console.log('draw_updateVideos', x, y, w, y);
      image(vid, x, y, w, h, 0, 0, vid.width, vid.height);
    }
  }
}

// image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight]

// keys to start/stop video 1,2 | 3,4 | 5,6 | 7,8 | 9,0 | -,=
//
let startKeys = ['1', '3', '5', '7', '9', '-'];
let stoppKeys = ['2', '4', '6', '8', '0', '='];
//
// startKeys.includes('1')
// startKeys.indexOf('1')

function keyPressed() {
  let index;
  index = startKeys.indexOf(key);
  console.log('keyPressed startKey index', index);
  if (index >= 0) {
    start_video_atIndex(index);
  }
  index = stoppKeys.indexOf(key);
  console.log('keyPressed stoppKeys index', index);
  if (index >= 0) {
    stop_video_atIndex(index);
  }
  if (key == ' ') {
    my_mousePressed();
  }
}

function start_video_atIndex(index) {
  my.videoShowTile[index] = true;
}

function stop_video_atIndex(index) {
  my.videoShowTile[index] = false;
}

// disabled for my.nextButton
// function mousePressed() {
function my_mousePressed() {
  if (!my.mouseWasPressed) {
    // first mouse press - loop all the videos
    my.videos.forEach((vid) => vid.loop());
    console.log('first presss my.videoIndex', my.videoIndex);
    my.mouseWasPressed = true;
    return;
  }
  next_video();
}

function next_video() {
  my.videoIndex = (my.videoIndex + 1) % my.videos.length;
  console.log('next_video my.videoIndex', my.videoIndex);
  let path = my.videoPaths[my.videoIndex];
  // console.log('next_video path', path);
}

function secs() {
  return (millis() / 1000.0).toFixed(3);
}

function create_ui() {
  my.nextButton = createButton('?v=26 next');
  my.nextButton.mousePressed(my_mousePressed);
  my.nextButton.style('font-size:42px');
}
/*
https://developer.mozilla.org/en-US/docs/Web/API/console/time_static

https://github.com/p5videoKit/ims03-olivia-GirlTime
>> Fork of https://github.com/olivia-em/GirlTime
>> sharing large assets with github pages

https://p5js.org/reference/p5.MediaElement/loop/
!!@ not obvious
https://github.com/processing/p5.js/blob/v1.11.3/src/dom/dom.js#L4400
    this.elt.setAttribute('loop', true);
    this.play();

https://p5videokit.github.io/ims03-olivia-GirlTime/images/1.mov

https://p5js.org/reference/p5/createVideo/

createVideo(src, [callback]) 
src   - String|String[]: path to a video file, or an array of paths for supporting different browsers.
callback - Function: function to call once the video is ready to play.
*/

// https://editor.p5js.org/jht9629-nyu/sketches/X7LY4-mHp
// ims03-olivia v1

// https://editor.p5js.org/jht9629-nyu/sketches/VD7wYHXlN
// multi-video v0

// https://editor.p5js.org/jht9629-nyu/sketches/IC-PsTWqb
// multi-video image loop v1
// display of video in draw via image
// looping enabled

// https://editor.p5js.org/jht9629-nyu/sketches/4DzVlo-iT
// multi-video n12 fail v2
// Always plays first video??

// https://editor.p5js.org/jht9629-nyu/sketches/aATpuGnPb
// multi-video mouse next v3
// fails with autoplay policy running locally

// https://editor.p5js.org/jht9629-nyu/sketches/0P5zUjzEr
// multi-video mouse next v4
// use undocumented loadedmetadata in draw
/*
running local non-fatal warning
🌸 p5.js says: The media that tried to play (with 'https://p5videokit.github.io/ims03-olivia-GirlTime/images/1.mov') wasn't allowed to by this browser, most likely due to the browser's autoplay policy.
+ More info: https://developer.mozilla.org/docs/Web/Media/Autoplay_guide
*/

// https://editor.p5js.org/jht9629-nyu/sketches/mibDihRY1
// multi-video mouse next v5

// https://editor.p5js.org/jht9629-nyu/sketches/RUliTVBec
// multi-video mouse next v6
// mouse press to show next 1 of 12 videos
// video is displayed centered in the window
