(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  window.startMoviePlayer = function (source) {
    ready(function () {
      var video = document.getElementById('movie-video');
      var button = document.querySelector('.play-overlay');
      var active = false;
      var hls = null;

      if (!video || !source) {
        return;
      }

      function hideButton() {
        if (button) {
          button.classList.add('is-hidden');
        }
      }

      function playVideo() {
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            video.controls = true;
          });
        }
      }

      function attachAndPlay() {
        hideButton();
        if (!active) {
          active = true;
          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.addEventListener('loadedmetadata', playVideo, { once: true });
            playVideo();
          } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
            playVideo();
          } else {
            video.src = source;
            video.addEventListener('loadedmetadata', playVideo, { once: true });
            playVideo();
          }
        } else {
          playVideo();
        }
      }

      if (button) {
        button.addEventListener('click', attachAndPlay);
      }
      video.addEventListener('click', function () {
        if (!active) {
          attachAndPlay();
        }
      });
      video.addEventListener('play', hideButton);
      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  };
}());
