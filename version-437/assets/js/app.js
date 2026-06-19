(function() {
  const menuButton = document.querySelector(".mobile-menu-button");
  const mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function() {
      mobileNav.classList.toggle("open");
    });
  }

  const hero = document.querySelector(".hero-shell");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll(".hero-dot"));
    let index = 0;

    function setSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });

      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    dots.forEach(function(dot, dotIndex) {
      dot.addEventListener("click", function() {
        setSlide(dotIndex);
      });
    });

    setInterval(function() {
      setSlide(index + 1);
    }, 5200);

    setSlide(0);
  }

  const panels = Array.from(document.querySelectorAll("[data-filter-panel]"));

  panels.forEach(function(panel) {
    const scopeSelector = panel.getAttribute("data-filter-panel");
    const scope = scopeSelector ? document.querySelector(scopeSelector) : document;
    const input = panel.querySelector("[data-filter-input]");
    const yearSelect = panel.querySelector("[data-filter-year]");
    const regionSelect = panel.querySelector("[data-filter-region]");
    const categorySelect = panel.querySelector("[data-filter-category]");
    const empty = document.querySelector("[data-empty-state]");

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function applyFilter() {
      if (!scope) {
        return;
      }

      const query = normalize(input ? input.value : "");
      const yearValue = yearSelect ? yearSelect.value : "";
      const regionValue = regionSelect ? regionSelect.value : "";
      const categoryValue = categorySelect ? categorySelect.value : "";
      let visible = 0;

      Array.from(scope.querySelectorAll("[data-title]")).forEach(function(card) {
        const haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-region"),
          card.getAttribute("data-category"),
          card.getAttribute("data-tags")
        ].join(" "));
        const yearMatched = !yearValue || card.getAttribute("data-year") === yearValue;
        const regionMatched = !regionValue || card.getAttribute("data-region") === regionValue;
        const categoryMatched = !categoryValue || card.getAttribute("data-category") === categoryValue;
        const queryMatched = !query || haystack.indexOf(query) !== -1;
        const matched = yearMatched && regionMatched && categoryMatched && queryMatched;

        card.style.display = matched ? "" : "none";

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? "none" : "block";
      }
    }

    [input, yearSelect, regionSelect, categorySelect].forEach(function(control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });

    applyFilter();
  });

  window.startMoviePlayer = function(url, videoId, coverId) {
    const video = document.getElementById(videoId);
    const cover = document.getElementById(coverId);
    let attached = false;
    let hlsInstance = null;

    if (!video || !cover || !url) {
      return;
    }

    function attachSource() {
      if (attached) {
        return;
      }

      attached = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          maxBufferLength: 32,
          enableWorker: true
        });
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
      } else {
        video.src = url;
      }
    }

    function startPlay() {
      attachSource();
      cover.classList.add("is-hidden");
      video.controls = true;
      const promise = video.play();

      if (promise && typeof promise.catch === "function") {
        promise.catch(function() {});
      }
    }

    cover.addEventListener("click", startPlay);
    video.addEventListener("click", function() {
      if (video.paused) {
        startPlay();
      }
    });

    window.addEventListener("pagehide", function() {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
