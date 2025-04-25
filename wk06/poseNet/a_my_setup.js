//
function my_init() {
  // updated to verify change on mobile
  my.version = '?v=31';
  // my.moviePath = '../../moRelease/media/IMG_2772-2m33s.mov';
  my.moviePath = '../../moRelease/media/IMG_2772-6m53s.mov';
  my.appTitle = 'Posenet';
  my.isRemote = 1;
  // show detailed log
  my.logLoud = 1;

  my.add_action_delay = 0.5;
  my.lipsDiff = 0;

  my.fireb_config = 'jht9629';
  // my.fireb_config = 'jht1493';
  // my.fireb_config = 'jhtitp';
  my.dbase_rootPath = 'm0-@r-@w-';
  my.mo_app = 'mo-posenet';
  my.mo_room = 'm1-posenet';
  my.mo_group = 's0';
  my.nameDevice = 'posenet';

  my.photo_index = 0;
  my.photo_max = 64;
  // my.photo_max = 4;
  my.photo_list = [];

  let scale = 0.5;
  // let scale = 1.0;
  my.vwidth = 480 * scale;
  my.vheight = 640 * scale;
  // my.vwidth = 640 * scale;
  // my.vheight = 480 * scale;
  // my.top_percent = 80;
  my.top_percent = 100;
  my.long = 0;

  // my.imageQuality = 1;
  my.imageQuality = 0.5;
  my.imageExt = '.jpg';

  my.query = get_url_params();
  if (my.query) {
    my.mo_room = my.query.room || my.mo_room;
    my.mo_group = my.query.group || my.mo_group;
    my.isRemote = parseFloat(my.query.remote || my.isRemote);
    my.photo_max = parseFloat(my.query.photo_max || my.photo_max);
    my.top_percent = parseFloat(my.query.top_percent || my.top_percent);
    my.long = parseFloat(my.query.long || my.long);
    my.showButtons = parseFloat(my.query.show_buttons || my.showButtons);
    my.showRemove = parseFloat(my.query.show_remove || my.showRemove);
  }
  if (my.long) {
    [my.vwidth, my.vheight] = [my.vheight, my.vwidth];
  }
  console.log('my.vwidth, my.vheight', my.vwidth, my.vheight, 'my.long', my.long);

  my.show_mesh = 1;

  my.footerHeight = '288px';
  my.qrCodeWidth = '25%';

  if (my.mo_group == 's0') {
    my.mo_room = 'm0-posenet';
    my.showButtons = 1;
    my.showRemove = 1;
  }
  if (my.showRemove) {
    my.photo_max = Number.MAX_SAFE_INTEGER;
  }

  if (0) {
    my.qrcode_url = () => {
      return `qrcode/${my.mo_group}.png`;
    };
    my.showQRCode = () => {
      // qrCode is only shown for screen width greater than 800
      return window.innerWidth > 800;
    };
  }

  window_resized();
}

window.addEventListener('resize', window_resized);

function window_resized() {
  my.gallery_margin = '40px';
  let perRow = 4.4; // 6.1
  my.thumbWidth = Math.floor(windowWidth) / perRow;
  console.log('window_resized my.thumbWidth', my.thumbWidth);
  if (my.thumbWidth < 120) {
    perRow = 4.5;
    my.thumbWidth = Math.floor(windowWidth) / perRow;
    my.gallery_margin = '20px';
  }
  console.log('window_resized windowWidth', windowWidth, 'my.thumbWidth', my.thumbWidth);
}
