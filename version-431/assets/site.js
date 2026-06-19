document.addEventListener("DOMContentLoaded", function () {
  initNavigation();
  initHeroSliders();
});

function initNavigation() {
  var toggle = document.querySelector("[data-nav-toggle]");
  var panel = document.querySelector("[data-mobile-panel]");

  if (!toggle || !panel) {
    return;
  }

  toggle.addEventListener("click", function () {
    panel.classList.toggle("is-open");
  });
}

function initHeroSliders() {
  var sliders = document.querySelectorAll("[data-hero-slider]");

  sliders.forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var prev = slider.querySelector("[data-hero-prev]");
    var next = slider.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    if (slides.length <= 1) {
      return;
    }

    function setActive(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        setActive(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        setActive(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        setActive(index + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var dotIndex = Number(dot.getAttribute("data-hero-dot"));
        if (!Number.isNaN(dotIndex)) {
          setActive(dotIndex);
          start();
        }
      });
    });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    start();
  });
}
