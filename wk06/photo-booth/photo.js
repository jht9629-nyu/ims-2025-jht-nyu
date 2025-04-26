//

function photo_list_entry(index) {
  let name = index.toString().padStart(3, '0');
  let uid = my.uid;
  let createdAt = new Date().toISOString();
  // let ext = my.imageExt;
  return { name, index, uid, createdAt };
}

function photo_path_entry(entry) {
  if (entry.path) return entry.path;
  return `${entry.uid}/${entry.name}_${entry.key}${my.imageExt}`;
}

async function photo_list_trim() {
  // remove the first entry in photo_list
  console.log('photo_list_trim my.photo_list', my.photo_list);
  let first = my.photo_list.shift();
  await photo_list_remove_entry(first);
}

async function take_action() {
  // console.log('take_action');

  remove_action();

  add_action();
}

async function photo_list_display() {
  // console.log('photo_list_display my.photo_list', my.photo_list);
  for (let entry of my.photo_list) {
    if (!entry.uploadedAt) {
      // console.log('photo_list_display skipping item', entry);
      continue;
    }
    try {
      let url = await photo_download_url(entry);
      url_result(url, entry.key);
    } catch (err) {
      console.log('photo_list_display err', err);
    }
  }
  function url_result(url, key) {
    // console.log('url_result index', index, 'url', url);
    let img = find_img(key);
    img.elt.src = url;
  }
}

function photo_store_changed_poll() {
  if (!my.photo_store_changed || !my.photo_store) return;
  my.photo_store_changed = 0;

  my.photo_list = Object.values(my.photo_store);
  // !!@ should sort by date

  // Remove entries that a beyond my max
  let myCount = 0;
  //
  // traverse backwards
  // will show most recent first in find_img / prepend
  //
  for (let index = my.photo_list.length - 1; index >= 0; index--) {
    let entry = my.photo_list[index];
    let isMine = entry.uid == my.uid;
    if (isMine) {
      myCount++;
      if (myCount > my.photo_max) {
        photo_list_remove_entry(entry);
      }
    }
  }
  photo_list_display();
}
