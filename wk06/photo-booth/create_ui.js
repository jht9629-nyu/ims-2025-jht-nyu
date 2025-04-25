//
function create_ui() {
  //
  ui_span(0, my.version);

  my.effectBtn = ui_createButton('Effect');
  my.effectBtn.mousePressed(effect_action);

  my.addBtn = ui_createButton('Add');
  my.addBtn.mousePressed(add_action);

  my.takeBtn = ui_createButton('Take');
  my.takeBtn.mousePressed(take_action);

  my.removeBtn = ui_createButton('Remove');
  my.removeBtn.mousePressed(remove_action);

  my.showBtn = ui_createButton('Show');
  my.showBtn.mousePressed(photo_list_display);

  my.photo_count_span = createSpan('' + my.photo_list.length);

  my.gallery_div = ui_div_empty('igallery');
}

function effect_action() {
  my.slit_scan = !my.slit_scan;
}

function img_remove_all() {
  //
  // console.log('photo_remove_all');
  for (;;) {
    let child = my.gallery_div.elt.firstChild;
    // console.log('photo_remove_all child', child);
    if (!child) {
      break;
    }
    child.remove();
  }
}

function remove_img(key) {
  // console.log('remove_img index', index);
  let id = 'id_img_' + key;
  let img = select('#' + id);
  // console.log('remove_img img', img);
  if (img) {
    img.remove();
  }
}

// Create image element for an index
//  or return if already present
//
function find_img(key) {
  let id = 'id_img_' + key;
  let img = select('#' + id);
  if (!img) {
    // console.log('find_img id', id);
    img = createImg('', 'image');
    img.id(id);
    // console.log('find_img createImg', img);

    // my.gallery_div.elt.append(img.elt);
    // Add image as first child to see most recent first
    my.gallery_div.elt.prepend(img.elt);

    let iwidth = my.thumbWidth;
    img.style('width: ' + iwidth + 'px;');
  }
  return img;
}
