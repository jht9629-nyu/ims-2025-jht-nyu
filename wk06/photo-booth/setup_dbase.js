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

  // Settings for document folders to store in database
  // Adjust for to define your store
  //
  my.mo_app = 'mo-photo';
  my.mo_room = 'm0-photo';
  my.mo_group = 's0';

  // my.nameDevice = '';
  my.query = get_url_params();
  if (my.query) {
    my.mo_room = my.query.room || my.mo_room;
    my.mo_group = my.query.group || my.mo_group;
  }

  console.log('setup_dbase');
  my.dbase = await mo_dbase_init(my);

  observe_item();

  observe_photo_store();
}

// Establish call back function to detect changes to an item in the database
// stores item.photo_index
//
function observe_item() {
  my.dbase.observe('item', { observed_item });
  function observed_item(item) {
    console.log('observed_item item', item);
    if (item.photo_index != undefined) {
      my.photo_index = item.photo_index;
    }
  }
}

// Establish call back function to detect changes to an photo_store in the database
// stores photo_store key value of
// my.photo_store = {
//    key: {
//      createdAt, index, name, path, uid, uploadedAt
//    }
//  }
// eg:
//
// mo-photo / mo-photo / a_group / s0 / photo_store
//
// {
//   "-OOjpmtj0NTPQukqJajc": {
//       "createdAt": "2025-04-26T02:04:55.272Z",
//       "index": 1,
//       "name": "001",
//       "path": "anmowvsL0LhjNEUiAc1D4ITwKRE2/001_-OOjpmtj0NTPQukqJajc.jpg",
//       "uid": "anmowvsL0LhjNEUiAc1D4ITwKRE2",
//       "uploadedAt": "2025-04-26T02:04:55.798Z",
//       "key": "-OOjpmtj0NTPQukqJajc"
//   }
// }
//
function observe_photo_store() {
  my.photo_store = {};
  //
  my.dbase.observe('photo_store', { event_update, event_remove });
  function event_update(key, item, event) {
    console.log('event_update key', key, 'item', item, 'event', event);
    // event = add | change -- optional
    item.key = key;
    my.photo_store[key] = item;
    my.photo_store_changed = 1;
  }
  function event_remove(key, item) {
    console.log('event_remove', key, item);
    delete my.photo_store[key];
    remove_img(key);
    my.photo_store_changed = 1;
  }
}

// Add a photo to the database
//
async function add_action() {
  //
  toggle_cross_direction();

  // { name, index, uid, date }
  let entry = photo_list_entry(my.photo_index + 1);

  let key = await my.dbase.add_key('photo_store', entry);
  entry.key = key;

  let path = photo_path_entry(entry);
  my.dbase.update_item('photo_store/' + key, { path });

  let layer = my.canvas;
  let imageQuality = my.imageQuality;
  try {
    //
    await my.dbase.fstorage_upload({ path, layer, imageQuality });

    let uploadedAt = new Date().toISOString();
    my.dbase.update_item('photo_store/' + key, { uploadedAt });

    photo_index_increment();
    //
  } catch (err) {
    console.log('take_action err', err);
  }
}

// Remove a photo entry from the database
//
async function photo_list_remove_entry(entry) {
  console.log('photo_list_remove_entry entry', entry);

  // delete getting issued twice -- try to avoid repeated delete
  if (!my.delete_photos) {
    my.delete_photos = {};
  }
  let path = photo_path_entry(entry);
  if (my.delete_photos[path]) {
    console.log('photo_list_remove_entry repeated delete path', path);
    return;
  }
  my.delete_photos[path] = 1;
  try {
    await my.dbase.fstorage_remove({ path });
    remove_img(entry.key);
    await my.dbase.remove_key('photo_store', entry.key);
  } catch (err) {
    console.log('photo_list_remove_entry err', err);
  }
}

// Remove a photo from the database
//
async function remove_action() {
  // console.log('remove_action photo_count', my.photo_list.length);
  if (my.photo_list.length < 1) {
    // No more images in the cloud
    //  zero out photo_index
    // dbase_group_update({ photo_index: 0 });
    my.dbase.update_item('item', { photo_index: 0 });
    return;
  }
  // remove the last entry in photo_list
  //
  let last = my.photo_list.pop();
  await photo_list_remove_entry(last);
}

// Return the url to download a photo
//
async function photo_download_url(entry) {
  let path = photo_path_entry(entry);
  let url = await my.dbase.fstorage_download_url({ path });
  return url;
}

// Increment photo_index
//
// eg:
//
// mo-photo / mo-photo / a_group / s0 / item / photo_index
//
function photo_index_increment() {
  my.dbase.update_item('item', { photo_index: my.dbase.increment(1) });
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
