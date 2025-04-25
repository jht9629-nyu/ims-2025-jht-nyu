//

let my = {};

console.log('main.js');

document.addEventListener('DOMContentLoaded', document_loaded);

// window.addEventListener('resize', resize_window);

id_button_add.addEventListener('click', add_click_action);
id_button_remove.addEventListener('click', remove_click_action);

function document_loaded() {
  console.log('document_loaded');

  setup_dbase();

  let period = 0.1; // poll_timer
  my.poll_timer = new PeriodTimer({ period, timer_event: poll_event });
}

function poll_event() {
  if (my.comment_update_pending) {
    my.comment_update_pending = 0;
    show_comments();
  }
}

function remove_click_action(event) {
  console.log('remove_click_action event.target', event.target);
  remove_action();
}

function show_comments() {
  let items = [];
  let num = 1;
  for (let prop in my.comment_store) {
    let entry = my.comment_store[prop];
    items.push(`<li>${num} ${entry.name}: ${entry.comment}</li>`);
    num++;
  }
  items.reverse();
  id_comments_ul.innerHTML = items.join('');
}

function add_click_action(event) {
  console.log('add_click_action ');
  //
  add_action();
  id_name.value = '';
  id_comment.value = '';
}

function link_click_action(event) {
  console.log('link_click_action event.target', event.target);
}

// function resize_window() {
//   // console.log('resize_window');
// }
