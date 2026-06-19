(function() {
  const body = document.body;
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function() {
      const open = mobileNav.classList.toggle('is-open');
      body.classList.toggle('menu-open', open);
      menuButton.textContent = open ? '×' : '☰';
    });
  }

  const scope = document.querySelector('[data-filter-scope]');
  if (!scope) {
    return;
  }

  const cards = Array.from(scope.querySelectorAll('.movie-card'));
  const inputs = Array.from(document.querySelectorAll('[data-search-input]'));
  const selects = Array.from(document.querySelectorAll('[data-filter-select]'));
  const empty = document.querySelector('[data-filter-empty]');
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';

  inputs.forEach(function(input) {
    if (initialQuery && !input.value) {
      input.value = initialQuery;
    }
    input.addEventListener('input', filterCards);
  });

  selects.forEach(function(select) {
    select.addEventListener('change', filterCards);
  });

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  function selected(name) {
    const element = document.querySelector('[data-filter-select="' + name + '"]');
    return element ? element.value : '';
  }

  function queryText() {
    return normalize(inputs.map(function(input) {
      return input.value;
    }).join(' '));
  }

  function filterCards() {
    const query = queryText();
    const region = selected('region');
    const year = selected('year');
    const type = selected('type');
    let visible = 0;

    cards.forEach(function(card) {
      const text = normalize(card.getAttribute('data-filter-text'));
      const matchesQuery = !query || text.includes(query);
      const matchesRegion = !region || card.getAttribute('data-region-group') === region;
      const matchesYear = !year || card.getAttribute('data-year-band') === year;
      const matchesType = !type || card.getAttribute('data-type') === type;
      const show = matchesQuery && matchesRegion && matchesYear && matchesType;
      card.hidden = !show;
      if (show) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  filterCards();
})();
