(function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var current = 0;
  function setSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === current);
    });
  }
  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      setSlide(Number(dot.getAttribute("data-go")) || 0);
    });
  });
  if (slides.length > 1) {
    window.setInterval(function () {
      setSlide(current + 1);
    }, 5200);
  }

  var input = document.querySelector(".js-filter-input");
  var year = document.querySelector(".js-year-filter");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
  var params = new URLSearchParams(window.location.search);
  var q = params.get("q");
  if (input && q) {
    input.value = q;
  }
  function filterCards() {
    var text = input ? input.value.trim().toLowerCase() : "";
    var selectedYear = year ? year.value : "";
    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-genre"),
        card.textContent
      ].join(" ").toLowerCase();
      var cardYear = card.getAttribute("data-year") || "";
      var matchedText = !text || haystack.indexOf(text) !== -1;
      var matchedYear = !selectedYear || cardYear === selectedYear;
      card.style.display = matchedText && matchedYear ? "" : "none";
    });
  }
  if (input || year) {
    if (input) {
      input.addEventListener("input", filterCards);
    }
    if (year) {
      year.addEventListener("change", filterCards);
    }
    filterCards();
  }
}());

function initMoviePlayer(streamUrl) {
  var shell = document.querySelector(".js-player-shell");
  var video = document.querySelector(".js-player-video");
  var button = document.querySelector(".js-player-button");
  var attached = false;

  if (!shell || !video || !streamUrl) {
    return;
  }

  function attach() {
    if (attached) {
      return;
    }
    attached = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else {
      video.src = streamUrl;
    }
  }

  function play() {
    attach();
    shell.classList.add("is-playing");
    video.controls = true;
    var result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {
        shell.classList.remove("is-playing");
      });
    }
  }

  if (button) {
    button.addEventListener("click", play);
  }
  shell.addEventListener("click", function (event) {
    if (event.target === video && attached) {
      return;
    }
    if (!attached || !shell.classList.contains("is-playing")) {
      play();
    }
  });
}
