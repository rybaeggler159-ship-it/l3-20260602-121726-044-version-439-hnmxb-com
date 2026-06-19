(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  ready(function () {
    initMobileNav();
    initHeroCarousel();
    initFilters();
    initPlayer();
    hydrateSearchQuery();
  });

  function initMobileNav() {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".mobile-nav");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHeroCarousel() {
    var root = document.querySelector("[data-hero-carousel]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll(".hero-dot"));
    var index = 0;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide")) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
  }

  function initFilters() {
    var bars = Array.prototype.slice.call(document.querySelectorAll("[data-filter-bar]"));
    bars.forEach(function (bar) {
      var section = bar.parentElement;
      var list = section ? section.querySelector("[data-filter-list]") : null;
      if (!list) {
        return;
      }
      var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
      var search = bar.querySelector("[data-filter-search]");
      var year = bar.querySelector("[data-filter-year]");
      var type = bar.querySelector("[data-filter-type]");
      var reset = bar.querySelector("[data-filter-reset]");
      var count = section.querySelector("[data-filter-count]");

      function apply() {
        var keyword = normalize(search && search.value);
        var selectedYear = year ? year.value : "";
        var selectedType = type ? type.value : "";
        var visible = 0;

        cards.forEach(function (card) {
          var text = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-year")
          ].join(" "));
          var okKeyword = !keyword || text.indexOf(keyword) !== -1;
          var okYear = !selectedYear || card.getAttribute("data-year") === selectedYear;
          var okType = !selectedType || (card.getAttribute("data-type") || "").indexOf(selectedType) !== -1;
          var ok = okKeyword && okYear && okType;
          card.classList.toggle("is-hidden", !ok);
          if (ok) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = "当前显示 " + visible + " 部影片，共 " + cards.length + " 部。";
        }
      }

      [search, year, type].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });

      if (reset) {
        reset.addEventListener("click", function () {
          if (search) {
            search.value = "";
          }
          if (year) {
            year.value = "";
          }
          if (type) {
            type.value = "";
          }
          apply();
        });
      }

      apply();
    });
  }

  function hydrateSearchQuery() {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");
    if (!query) {
      return;
    }
    var input = document.querySelector("[data-filter-search]");
    if (input) {
      input.value = query;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  function initPlayer() {
    var boxes = Array.prototype.slice.call(document.querySelectorAll(".player-box"));
    boxes.forEach(function (box) {
      var video = box.querySelector("video");
      var button = box.querySelector(".play-cover");
      var source = box.getAttribute("data-hls-source");
      var hlsInstance = null;

      function destroyHls() {
        if (hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
        }
      }

      function loadSource(url) {
        if (!video || !url) {
          return;
        }
        destroyHls();
        box.setAttribute("data-hls-source", url);

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(url);
          hlsInstance.attachMedia(video);
        } else {
          video.src = url;
        }
      }

      function play() {
        source = box.getAttribute("data-hls-source") || source;
        if (!video.getAttribute("src")) {
          loadSource(source);
        }
        box.classList.add("is-playing");
        var playPromise = video.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(function () {
            video.setAttribute("controls", "controls");
          });
        }
      }

      if (button) {
        button.addEventListener("click", play);
      }

      var sourceButtons = Array.prototype.slice.call(document.querySelectorAll(".source-button"));
      sourceButtons.forEach(function (sourceButton) {
        sourceButton.addEventListener("click", function () {
          sourceButtons.forEach(function (item) {
            item.classList.remove("is-active");
          });
          sourceButton.classList.add("is-active");
          loadSource(sourceButton.getAttribute("data-source"));
          play();
        });
      });
    });
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }
})();
