//

function videoKit_setup() {
  //
  videoKit = p5videoKit_init(videoKit_config);

  // handler to save canvas to server
  videoKit.save_canvas_handler = save_canvas_handler;

  // handler to tell videoKit where to find effects
  // videoKit.import_effect_handler = (effMeta) => import('../' + effMeta.import_path);
}

let videoKit_config = {
  // effects for import, will appear at top of the effect menu

  effects: [
    { label: 'eff_simplex', factory: eff_simplex },
    // { label: 'simplex', import_path: 'effects/eff_simplex.js' },
    // { label: 'worley', import_path: 'effects/eff_worley.js' },
  ],

  // settings for import, will appear in the settings menu

  settings: [
    // { label: 'example_props', import_path: 'settings/example_props.json' },
    // { label: 'simplex_speed_1', import_path: 'settings/simplex_speed_1.json' },
  ],
};

function ui_log(...args) {
  // console.log(...args);
}

function ui_verbose(...args) {
  // console.log(...args);
}
