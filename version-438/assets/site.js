(function () {
  "use strict";

  var defaultHlsSource = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

  window.posterFallback = function posterFallback(image, title) {
    var safeTitle = String(title || "影片海报").replace(/[<>&"']/g, "");
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='900' viewBox='0 0 600 900'>" +
      "<defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='#0ea5e9'/><stop offset='1' stop-color='#0c4a6e'/></linearGradient></defs>" +
      "<rect width='600' height='900' rx='42' fill='url(#g)'/>" +
      "<circle cx='480' cy='120' r='140' fill='#7dd3fc' opacity='.22'/>" +
      "<text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' fill='#fff' font-size='42' font-family='Arial, sans-serif' font-weight='700'>" + safeTitle.slice(0, 12) + "</text>" +
      "<text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='#e0f2fe' font-size='24' font-family='Arial, sans-serif'>" + safeTitle.slice(12, 24) + "</text>" +
      "</svg>";
    image.onerror = null;
    image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  };

  function queryAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupBackTop() {
    var button = document.querySelector("[data-back-top]");
    if (!button) {
      return;
    }
    window.addEventListener("scroll", function () {
      if (window.scrollY > 360) {
        button.classList.add("is-visible");
      } else {
        button.classList.remove("is-visible");
      }
    });
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function setupHero() {
    var carousel = document.querySelector("[data-hero-carousel]");
    if (!carousel) {
      return;
    }
    var slides = queryAll("[data-hero-slide]", carousel);
    var dots = queryAll("[data-hero-dot]", carousel);
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

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
  }

  function setupFilters() {
    var grid = document.querySelector("[data-card-grid]");
    var input = document.querySelector("[data-card-search]");
    var typeFilter = document.querySelector("[data-type-filter]");
    var yearSort = document.querySelector("[data-year-sort]");
    var count = document.querySelector("[data-result-count]");

    if (!grid) {
      return;
    }

    var cards = queryAll(".movie-card", grid);
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q");
    if (initialQuery && input) {
      input.value = initialQuery;
    }

    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : "";
      var selectedType = typeFilter ? typeFilter.value : "";
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags")
        ].join(" ").toLowerCase();
        var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchesType = !selectedType || haystack.indexOf(selectedType.toLowerCase()) !== -1;
        var showCard = matchesKeyword && matchesType;
        card.style.display = showCard ? "" : "none";
        if (showCard) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = "共 " + visible + " 部影片";
      }
    }

    function sortCards() {
      if (!yearSort) {
        return;
      }
      var direction = yearSort.value === "asc" ? 1 : -1;
      cards.sort(function (a, b) {
        var ay = Number(a.getAttribute("data-year") || 0);
        var by = Number(b.getAttribute("data-year") || 0);
        return (ay - by) * direction;
      });
      cards.forEach(function (card) {
        grid.appendChild(card);
      });
      apply();
    }

    if (input) {
      input.addEventListener("input", apply);
    }
    if (typeFilter) {
      typeFilter.addEventListener("change", apply);
    }
    if (yearSort) {
      yearSort.addEventListener("change", sortCards);
    }

    sortCards();
    apply();
  }

  function setupPlayers() {
    queryAll("[data-player]").forEach(function (playerCard) {
      var video = playerCard.querySelector("video");
      var button = playerCard.querySelector("[data-play-button]");
      var source = playerCard.getAttribute("data-video") || defaultHlsSource;

      if (!video || !button) {
        return;
      }

      button.addEventListener("click", function () {
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls();
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            playerCard.classList.add("is-playing");
            video.play().catch(function () {
              video.controls = true;
            });
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          playerCard.classList.add("is-playing");
          video.play().catch(function () {
            video.controls = true;
          });
        } else {
          video.src = source;
          playerCard.classList.add("is-playing");
          video.play().catch(function () {
            video.controls = true;
          });
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenu();
    setupBackTop();
    setupHero();
    setupFilters();
    setupPlayers();
  });
}());
