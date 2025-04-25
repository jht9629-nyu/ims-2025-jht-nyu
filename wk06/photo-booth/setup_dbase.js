//

async function setup_dbase() {
  //
  my.fireb_config = 'jht9629';
  // my.fireb_config = 'jht1493';
  // my.fireb_config = 'jhtitp';

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

function observe_item() {
  my.dbase.observe('item', { observed_item });
  function observed_item(item) {
    console.log('observed_item item', item);
    if (item.photo_index != undefined) {
      my.photo_index = item.photo_index;
    }
  }
}

function observe_photo_store() {
  my.photo_store = {};
  my.dbase.observe('photo_store', { observed_event });
  function observed_event(event, key, item) {
    console.log('observed_event ', event, key, item);
    switch (event) {
      case 'add':
      case 'change':
        item.key = key;
        my.photo_store[key] = item;
        break;
      case 'remove':
        delete my.photo_store[key];
        remove_img(key);
        break;
    }
    my.photo_store_changed = 1;
  }
}

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

async function photo_download_url(entry) {
  let path = photo_path_entry(entry);
  let url = await my.dbase.fstorage_download_url({ path });
  return url;
}
