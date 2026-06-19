document.addEventListener("DOMContentLoaded", function () {
  var players = document.querySelectorAll("[data-player]");

  players.forEach(function (stage) {
    var video = stage.querySelector("video");
    var button = stage.querySelector("[data-play-button]");
    var source = stage.getAttribute("data-src");
    var hlsInstance = null;
    var initialized = false;

    if (!video || !button || !source) {
      return;
    }

    function initializePlayer() {
      if (initialized) {
        return;
      }

      initialized = true;

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function playVideo() {
      initializePlayer();
      stage.classList.add("is-loading");

      var playPromise = video.play();

      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(function () {
          stage.classList.add("is-playing");
          stage.classList.remove("is-loading");
        }).catch(function () {
          stage.classList.remove("is-loading");
          stage.classList.remove("is-playing");
        });
      } else {
        stage.classList.add("is-playing");
        stage.classList.remove("is-loading");
      }
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      playVideo();
    });

    video.addEventListener("play", function () {
      stage.classList.add("is-playing");
      stage.classList.remove("is-loading");
    });

    video.addEventListener("pause", function () {
      if (!video.ended) {
        stage.classList.remove("is-playing");
      }
    });

    video.addEventListener("ended", function () {
      stage.classList.remove("is-playing");
    });

    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
});
