// https://editor.p5js.org/jht9629-nyu/sketches/I9vT_uniR
// get_url_params v2

let my = {};

function setup() {
  my.version = '?v=2';

  my.canvas = createCanvas(windowWidth, windowHeight);

  my.urlParams = get_url_params();

  console.log('my.urlParams', my.urlParams);
}

function draw() {
  background(200);
  let x = 10;
  let y = height * 0.2;
  let str = 'no params';
  let params = my.urlParams;
  if (params) {
    str = JSON.stringify(params, null, 2);
    draw_params(params);
  }
  textSize(height * 0.05);
  text(str, x, y);
}

function draw_params(params) {
  let c = params.c;
  let r = params.r * 0.01 * width;
  let x = width * 0.5;
  let y = height * 0.5;
  fill(c);
  circle(x, y, r);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

//
function get_url_params() {
  let query = window.location.search;
  // console.log('query |' + query + '|');
  console.log('query.length', query.length);
  if (query.length < 1) return null;
  let params = params_query(query);
  return params;
  // let store = params['store'];
  // console.log('nstore', store);
  // return store;
}

// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
function params_query(query) {
  // eg. query='abc=foo&def=%5Basf%5D&xyz=5'
  // params={abc: "foo", def: "[asf]", xyz: "5"}
  const urlParams = new URLSearchParams(query);
  const params = Object.fromEntries(urlParams);
  return params;
}

// localStorage.clear()

// https://www.buildingh.org

// https://editor.p5js.org/jht9629-nyu/sketches/MbS5C3j-F
// Necessary-forgery-DrawPoints

// convert to my.
// startTimedDraw as slider changes
// added a_drawings
// generalize draw_to
// remove class Point, use object literal for point
// added funtion lineFrom

// project files created with p5.vscode "Create p5.js Project"
// https://editor.p5js.org/jht9629-nyu/sketches/-t2O5JfBr
// DrawPoints
// !!@ p5.js/0.10.2

// TRY: use storeItem / getItem to save drawing locally
// https://p5js.org/reference/#/p5/storeItem
// https://p5js.org/reference/#/p5/getItem

// Code! Programming with p5.js
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/beginners/p5js/7.3-array-of-objects.html
// https://youtu.be/fBqaA7zRO58
// https://editor.p5js.org/codingtrain/sketches/1y_xfueO

// https://editor.p5js.org/jht9629-nyu/sketches/TQyVoswjQ
// p5moLibrary DrawPoints
// https://molab-itp.github.io/p5moLibrary/src/demo/DrawPoints/?v=65
// https://github.com/molab-itp/p5moLibrary

// https://editor.p5js.org/jht9629-nyu/sketches/5fTCCJ_Sh
// get_url_params demo
