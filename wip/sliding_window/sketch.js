// https://editor.p5js.org/jht9629-nyu/sketches/0OwCIFLm-
// sliding window v0

// https://editor.p5js.org/leey611/sketches/yzRvaE7Da
// sliding window v0

let video;
let handPose;
let hands = [];
let painting;
let windowGraphic
let window_left = 100
let window_right = 360
let shaderGraphic
let myShader
let px = 0;
let py = 0;

function preload() {
  handPose = ml5.handPose({ flipped: true, runtime:"mediapipe" });
  myShader = loadShader('shader.vert', 'shader.frag');
}

function mousePressed() {
  console.log(hands);
  setTimeout(() => save("emitter.png"), 2000);

}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  painting = createGraphics(640, 480);
  painting.clear();
  
  windowGraphic = createGraphics(640, 480)
  windowGraphic.clear()
  
  shaderGraphic = createGraphics(640, 480, WEBGL)
  shaderGraphic.clear()

  video = createCapture(VIDEO, { flipped: true });
  video.size(1920, 1080)
  video.hide();
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);
  shaderGraphic.image(video,0,0)
  shaderGraphic.shader(myShader)
  myShader.setUniform('tex0', video);
  myShader.setUniform('mouseX',0.5);
  myShader.setUniform('window_left', window_left/width)
  myShader.setUniform('window_right', window_right/width)
  shaderGraphic.shader(myShader)
  windowGraphic.clear()
  if (hands.length > 0) {
    let hand = hands[0];
    let index = hand.index_finger_tip;
    let thumb = hand.thumb_tip;
    let x = (index.x + thumb.x) * 0.5;
    let y = (index.y + thumb.y) * 0.5;
    
    let d = dist(index.x, index.y, thumb.x, thumb.y);
    // if (d < 20) {
    //   painting.stroke(255, 255, 0);
    //   painting.strokeWeight(8);
    //   painting.line(px, py, x, y);
    // }
    // grab right window
    if (d < 20 && dist(index.x, index.y, window_right, index.y) < 20) {
      window_right = lerp(window_right, index.x, 0.5);//index.x
    }
    // grab left window
    if (d < 20 && dist(index.x, index.y, window_left, index.y) < 20) {
      window_left = lerp(window_left, index.x, 0.5)//index.x
    }
    px = x;
    py = y;
  }
  // Draw all the tracked hand points
  // for (let i = 0; i < hands.length; i++) {
  //   let hand = hands[i];
  //   for (let j = 0; j < hand.keypoints.length; j++) {
  //     let keypoint = hand.keypoints[j];
  //     fill(0, 255, 0);
  //     noStroke();
  //     circle(keypoint.x, keypoint.y, 10);
  //   }
  // }
  windowGraphic.line(window_left,0,window_left,windowHeight)
  windowGraphic.line(window_right,0,window_right,windowHeight)

  shaderGraphic.rect(0,0,width,height)
  image(shaderGraphic,0,0)
  // image(painting, 0, 0);
  image(windowGraphic, 0, 0)
  
}
