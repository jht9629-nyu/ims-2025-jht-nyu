//

async function setup_dbase() {
  my.fireb_config = 'jht9629';
  // my.fireb_config = 'jht1493';
  // my.fireb_config = 'jhtitp';

  my.mo_app = 'mo-iframe-player';
  my.mo_room = 'm0-iframe-player';
  my.mo_group = 's0';

  my.dbase = await mo_dbase_init(my);

  observe_item(my);
}

function observe_item(my) {
  my.dbase.observe('item', { observed_item });
  function observed_item(item) {
    console.log('observed_item item', item);
    if (item.item_index != undefined) {
      my.item_index = item.item_index;
      item_index_changed();
    }
  }
}

function item_index_changed() {
  my.iframe_src = my.items[my.item_index];
  my.iframe_element.elt.src = my.iframe_src;
  my.iframe_element.elt.width = windowWidth;
  my.iframe_element.elt.height = windowHeight;
}

function first_action() {
  my.dbase.update_item('item', { item_index: 0 });
  // dbase_update_props({ item_index: 0 });
  // my.dbase.update_item('item', { photo_index: my.dbase.increment(1) });
}

function next_action() {
  reset_timer();
  let last = my.items.length - 1;
  if (my.item_index >= last) {
    my.dbase.update_item('item', { item_index: 0 });
    // dbase_update_props({ item_index: 0 });
  } else {
    my.dbase.update_item('item', { item_index: my.dbase.increment(1) });
    // dbase_update_props({ item_index: dbase_increment(1) });
  }
}

function previous_action() {
  reset_timer();
  let last = my.items.length - 1;
  if (my.item_index <= 0) {
    my.dbase.update_item('item', { item_index: last });
    // dbase_update_props({ item_index: last });
  } else {
    my.dbase.update_item('item', { item_index: my.dbase.increment(-1) });
    // dbase_update_props({ item_index: dbase_increment(-1) });
  }
}

// --

function ui_log(...args) {
  console.log(...args);
  let str = args.join(' ') + '<br/>';
  if (globalThis.id_console_ul) {
    id_console_ul.innerHTML += str;
  }
}
globalThis.ui_log = ui_log;

function ui_verbose(...args) {
  // console.log(...args);
}
globalThis.ui_verbose = ui_verbose;
