// https://editor.p5js.org/jht9629-nyu/sketches/88yxquMBl
// p5moExamples iframe_player 47

// my.items is play list of p5js sketches
// which are played in sequence
// switching every my.perSlideSecs seconds

let my = {};
my.items = [
  'https://jiaying0412.github.io/p5mirror---jiaying0822/p5projects/ims01-Jiaz-jYTEhmWCm/',
  'https://jht9629-gmail.github.io/ims-2025-jht/wk01-noise/ims_noise_inst/',
  'https://jht9629-gmail.github.io/ims-2025-jht/wk01-noise/OpenSimplex-Noise/',
  'https://jht9629-gmail.github.io/ims-2025-jht/wk01-noise/Worley-Noise-Port/',
  'https://jht9629-gmail.github.io/ims-2025-jht/wk02/ims01-Vi/',
  // !!@ Takes a long time to load
  'https://jht9629-gmail.github.io/ims-2025-jht/wk02/moire_shader_3/',
  // !!@ camera access NOT permitted in iframes
  // 'https://jht9629-gmail.github.io/ims-2025-jht/wk02/portals_by_oliviaemlee_v0/',
  // 'https://jht9629-gmail.github.io/ims-2025-jht/wk02/Unexpected-cut/',
  // 'https://jht9629-gmail.github.io/ims-2025-jht/wk02/Unexpected-cut-mask/',
];

function my_setup() {
  //
  my.perSlideSecs = 30;
  my.perSlideTime = millis();

  my.item_index = 0;
  my.iframe_src = my.items[my.item_index];

  setup_dbase();
}

function setup() {
  my_setup();

  create_my_iframe();

  // my.canvas = createCanvas(my.width, my.height);
  noCanvas();

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
// moLibrary is used to save my.item_index in firebase realtime database

// <script type="module" src="https://unpkg.com/itp-molib@0.2.44/dist/moLib.esm.js"></script>

// sketches harvested from
// https://github.com/molab-itp/p5mirror/forks
