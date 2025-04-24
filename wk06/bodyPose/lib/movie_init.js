//

function movie_init() {
  //

  // my.video = wait mediaDevice_create_capture(mediaDev, { flipped: flipH });
  my.video = createVideo(my.moviePath, function () {
    console.log('movie_init ready');

    my.video.loop();
    my.video.play();
  });

  // my.video.showControls();

  console.log('movie_init my.video.width, my.video.height', my.video.width, my.video.height);
}
