// https://editor.p5js.org/jht9629-nyu/sketches/88yxquMBl
// p5moExamples iframe_player 47

// my.items is play list of p5js sketches
// which are played in sequence
// switching every my.perSlideSecs seconds
// moLibrary is used to save my.item_index in firebase realtime database

// sketches harvested from
// https://github.com/molab-itp/p5mirror/forks

let my = {};

function my_setup() {
  my.width = windowWidth;
  my.height = windowHeight;

  my.perSlideSecs = 10;
  my.perSlideTime = millis();

  my.item_index = 0;
  my.items = [];
  my.items.push('https://molab-itp.github.io/p5moExamples/examples/lobby/?v=55&room=room0');
  my.items.push(
    'https://leey611.github.io/p5mirror-leey611/p5projects/Bezier%20Curve%20Interactive%20Tangents%20copy-ZfRGzFyhK/'
  );
  my.items.push('https://karakkzzk.github.io/p5mirror-karakkzzk/p5projects/Innovative%20crafter-OcjJ4foZE/');
  my.items.push('https://paulineium.github.io/p5mirror-pk2196/p5projects/ims01-paulineium-CHGZXqDjz/');
  my.items.push('https://jiaying0412.github.io/p5mirror---jiaying0822/p5projects/ims01-Jiaz-jYTEhmWCm/');
  my.items.push(
    'https://newbenjaminb.github.io/p5mirror-bb/p5projects/%20W6.4-1v4%20colliding%20balls%20DONE-VbVQXinn1/'
  );
  my.iframe_src = my.items[my.item_index];

  setup_dbase();
}

function setup() {
  my_setup();

  create_my_iframe();

  // my.canvas = createCanvas(my.width, my.height);
  noCanvas();

  // dbase_app_init({ completed: startup_completed });

  createButton('Next').mousePressed(next_action);
  createButton('Previous').mousePressed(previous_action);
  createButton('First').mousePressed(first_action);
  createSpan(' Index ');
  my.item_index_span = createSpan(my.item_index);
  createSpan(' ');
  my.timer_span = createSpan('');

  // Move the iframe below all the ui elements
  let body_elt = document.querySelector('body');
  let other_elt = my.iframe_element.elt;
  body_elt.insertBefore(other_elt, null);
}

function create_my_iframe() {
  my.iframe_element = createElement('iframe');
  item_index_changed();
}

function draw() {
  //
  my.item_index_span.html(my.item_index);

  let now = millis();
  let lapse = (now - my.perSlideTime) / 1000;
  if (lapse > my.perSlideSecs) {
    my.perSlideTime = now;
    next_action();
  }
  my.timer_span.html(lapse.toFixed(1));
}

function windowResized() {
  item_index_changed();
}

// https://editor.p5js.org/jht9629-nyu/sketches/23h3z1G82
// p5moExamples words 47
