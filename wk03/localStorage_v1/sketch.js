// https://editor.p5js.org/jht9629-nyu/sketches/qz9-Y-Sc4
// localStorage v1

let my = {};

// url parameter for color items added to local storage array
// ?c=blue&r=5
// c = color
// r = radius in percent of screen width 0 to 100

function setup() {
  my.version = '?v=1';

  my.canvas = createCanvas(windowWidth, windowHeight);

  my.urlParams = get_url_params();

  console.log('my.urlParams', my.urlParams);

  let str = localStorage.getItem('storageParams');
  if (str) {
    my.storageParams = JSON.parse(str);
    console.log('my.storageParams', my.storageParams);
  }

  my.addButton = createButton('add');
  my.addButton.mousePressed(add_action);
  my.addButton.style('font-size:42px');
  my.addButton.position(width * 0.01, height * 0.01);

  my.removeButton = createButton('remove');
  my.removeButton.mousePressed(remove_action);
  my.removeButton.style('font-size:42px');
  my.removeButton.position(width * 0.1, height * 0.01);
}

function draw() {
  background(200);
  let x = 10;
  let y = height * 0.2;
  let str1 = 'no params';
  let str2 = 'no params from storage';
  let params = my.urlParams;
  if (params) {
    str1 = 'url: ' + JSON.stringify(params, null, 2);
    draw_params(params, 0);
  }
  if (my.storageParams) {
    str2 = 'storage: ' + JSON.stringify(my.storageParams, null, 2);
    draw_params_array(my.storageParams);
  }
  fill(0);
  textSize(height * 0.05);
  text(str1 + '\n' + str2, x, y);
}

function draw_params_array(arr) {
  for (let index = 0; index < arr.length; index++) {
    let params = arr[index];
    draw_params(params, (index + 1) * 50);
  }
}

function draw_params(params, xoffset) {
  let c = params.c || 'red';
  let r = params.r || 50;
  r = r * 0.01 * width;
  let x = width * 0.5 + xoffset;
  let y = height * 0.5;
  fill(c);
  circle(x, y, r);
}

function add_action() {
  if (!my.storageParams) {
    my.storageParams = [];
  }
  let params = my.urlParams;
  if (params) {
    my.storageParams.push(params);
    save_storageParams();
  }
}

function remove_action() {
  if (my.storageParams) {
    my.storageParams.splice(0, 1);
    save_storageParams();
  }
}

function save_storageParams() {
  let str = JSON.stringify(my.storageParams, null, 2);
  localStorage.setItem('storageParams', str);
}

// localStorage.clear();

// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
// https://developer.mozilla.org/en-US/docs/Web/API/Storage

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

// https://editor.p5js.org/jht9629-nyu/sketches/I9vT_uniR
// get_url_params v2
