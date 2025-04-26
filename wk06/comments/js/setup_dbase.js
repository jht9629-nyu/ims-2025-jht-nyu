//

// Adjust to your own firebase config settings
// from Firebase console Web App settings
// https://console.firebase.google.com/project/molab-485f5

const firebaseConfig = {
  apiKey: 'AIzaSyDLxi_fvCG2kzD2eJ4MxEZbOJ_GFSpIVe0',
  authDomain: 'molab-485f5.firebaseapp.com',
  databaseURL: 'https://molab-485f5-default-rtdb.firebaseio.com',
  projectId: 'molab-485f5',
  storageBucket: 'molab-485f5.appspot.com',
  messagingSenderId: '219508380677',
  appId: '1:219508380677:web:b5d846a150e7d60368b86c',
  measurementId: 'G-40F0BN8L7L',
};

async function setup_dbase() {
  //
  my.fireb_config = firebaseConfig;
  // my.fireb_config = 'jht9629';
  // my.fireb_config = 'jht1493';
  // my.fireb_config = 'jhtitp';
  //
  my.fireb_config = 'jht9629';
  // my.fireb_config = 'jhtitp';
  my.mo_app = 'mo-comments';
  my.mo_room = 'm1-comments';
  my.mo_group = 's0';
  my.appTitle = 'comments';

  my_setup();

  my.comment_count = 0;

  my.dbase = await mo_dbase_init(my);

  observe_item();

  observe_comment_store();
}

function observe_item() {
  my.dbase.observe('item', { observed_item });
  function observed_item(item) {
    console.log('observed_item item', item);
    if (item.comment_count != undefined) {
      my.comment_count = item.comment_count;
    }
    my.item_update_pending = 1;
  }
}

function observe_comment_store() {
  my.comment_store = {};
  my.dbase.observe('comment_store', { event_update, event_remove });
  function event_update(key, item, event) {
    console.log('event_update key', key, 'item', item, 'event', event);
    // event = add | change -- optional
    my.comment_store[key] = item;
    my.comment_update_pending = 1;
  }
  function event_remove(key, item) {
    console.log('event_remove', key, item);
    delete my.comment_store[key];
    my.comment_update_pending = 1;
  }
}

function new_entry() {
  let name = id_name.value;
  let comment = id_comment.value;
  let createdAt = new Date().toISOString();
  let index = my.comment_count + 1;
  let uid = my.uid;
  return { name, comment, createdAt, index, uid };
}

async function add_action() {
  console.log('add_action ');
  let entry = new_entry();
  console.log('add_action entry', entry);
  if (!entry.name && !entry.comment) {
    console.log('add_action empty');
    return;
  }
  let key = await my.dbase.add_key('comment_store', entry);
  console.log('add_action key', key);
  entry.key = key;
  try {
    my.dbase.update_item('item', { comment_count: my.dbase.increment(1) });
  } catch (err) {
    console.log('take_action err', err);
  }
}

async function remove_action() {
  let response = confirm('remove my comment');
  if (response) {
    remove_action_confirmed();
  }
}

async function remove_action_confirmed() {
  //
  for (let key in my.comment_store) {
    let entry = my.comment_store[key];
    if (entry.uid != my.uid) {
      // console.log('remove skipping', entry.uid);
      // continue;
    }
    await my.dbase.remove_key('comment_store', key);
    break;
  }
}

// show details of moLib database calls
//
function ui_log(...args) {
  // console.log(...args);
}

// show verbose details of moLib database calls
//
function ui_verbose(...args) {
  // console.log(...args);
}

// issue alert if error from moLib
//
function ui_error(...args) {
  // enter  ui_error
  console.log(...args);
  alert(...args);
}
