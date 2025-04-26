//

// Adjust to your own firebase config settings
// from Firebase console Web App settings
// https://console.firebase.google.com/project/molab-485f5

function my_setup() {
  my.version = '?v=31';
  // console.log('my_setup ');

  // set group for all devices to share item values
  let params = get_url_params();
  my.query = params;
  console.log('params', params);
  my.mo_group = params.group || my.mo_group;

  if (my.mo_group == 's0') {
    // m0-comments
    my.mo_room = 'm0-' + my.mo_room.substring(3);
  }

  my.report_status_formatter = report_status_formatter;
}

function report_status_formatter({ version, muid, nvisit, ndevice, uid }) {
  return `${my.mo_group} ${version} ${muid} (ndevice=${ndevice}) (nvisit=${nvisit})`;
}
