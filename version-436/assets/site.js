(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupNavigation() {
    var button = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!button || !links) {
      return;
    }
    button.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function setupHero() {
    var slider = document.querySelector('.hero-slider');
    if (!slider) {
      return;
    }
    var slides = selectAll('.hero-slide', slider);
    var dots = selectAll('.hero-dot', slider);
    var prev = slider.querySelector('.hero-prev');
    var next = slider.querySelector('.hero-next');
    var current = slides.findIndex(function (slide) {
      return slide.classList.contains('active');
    });
    if (current < 0) {
      current = 0;
    }

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle('active', position === current);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle('active', position === current);
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-slide'), 10));
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5000);
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupFilters() {
    selectAll('.js-filter-list').forEach(function (list) {
      var scope = list.closest('main') || document;
      var input = scope.querySelector('.js-filter-input');
      var year = scope.querySelector('.js-year-filter');
      var cards = selectAll('.movie-card', list);
      var params = new URLSearchParams(window.location.search);
      var keyword = params.get('q');
      if (keyword && input) {
        input.value = keyword;
      }

      function apply() {
        var query = normalize(input ? input.value : '');
        var selectedYear = year ? year.value : '';
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-year'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-tags')
          ].join(' '));
          var matchesQuery = !query || haystack.indexOf(query) !== -1;
          var matchesYear = !selectedYear || card.getAttribute('data-year') === selectedYear;
          card.classList.toggle('is-filter-hidden', !(matchesQuery && matchesYear));
        });
      }

      if (input) {
        input.addEventListener('input', apply);
      }
      if (year) {
        year.addEventListener('change', apply);
      }
      apply();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupNavigation();
    setupHero();
    setupFilters();
  });
}());
