
(function () {
  window.initMoviePlayer = function (videoId, buttonId, source) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var attached = false;
    var hlsInstance = null;

    function bindSource() {
      if (!video || attached) return;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        attached = true;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new Hls({ enableWorker: true });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        attached = true;
        return;
      }
      video.src = source;
      attached = true;
    }

    function start() {
      if (!video) return;
      bindSource();
      if (button) button.classList.add("is-hidden");
      video.controls = true;
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", start);
    }
    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) start();
      });
      video.addEventListener("play", function () {
        if (button) button.classList.add("is-hidden");
      });
      video.addEventListener("emptied", function () {
        if (hlsInstance && typeof hlsInstance.destroy === "function") {
          hlsInstance.destroy();
        }
        hlsInstance = null;
        attached = false;
      });
    }
  };
})();
