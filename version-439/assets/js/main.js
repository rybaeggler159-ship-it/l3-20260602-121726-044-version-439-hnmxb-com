
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector(".mobile-menu-button");
    var mobilePanel = document.querySelector(".mobile-panel");
    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        mobilePanel.classList.toggle("is-open");
      });
    }

    var backtop = document.querySelector(".backtop");
    if (backtop) {
      window.addEventListener("scroll", function () {
        if (window.scrollY > 360) {
          backtop.classList.add("is-visible");
        } else {
          backtop.classList.remove("is-visible");
        }
      });
      backtop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    document.querySelectorAll(".site-search-form").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector('input[name="q"]');
        var value = input ? input.value.trim() : "";
        if (value) {
          event.preventDefault();
          window.location.href = "./search.html?q=" + encodeURIComponent(value);
        }
      });
    });

    var heroSlides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var heroDots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var heroIndex = 0;
    function showHero(index) {
      if (!heroSlides.length) return;
      heroIndex = (index + heroSlides.length) % heroSlides.length;
      heroSlides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === heroIndex);
      });
      heroDots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === heroIndex);
      });
    }
    var heroPrev = document.querySelector(".hero-prev");
    var heroNext = document.querySelector(".hero-next");
    if (heroPrev) heroPrev.addEventListener("click", function () { showHero(heroIndex - 1); });
    if (heroNext) heroNext.addEventListener("click", function () { showHero(heroIndex + 1); });
    heroDots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showHero(Number(dot.getAttribute("data-slide")) || 0);
      });
    });
    if (heroSlides.length > 1) {
      setInterval(function () {
        showHero(heroIndex + 1);
      }, 5200);
    }

    var hotTrack = document.querySelector(".hot-track");
    var hotSlides = hotTrack ? Array.prototype.slice.call(hotTrack.children) : [];
    var hotIndex = 0;
    function showHot(index) {
      if (!hotTrack || !hotSlides.length) return;
      hotIndex = (index + hotSlides.length) % hotSlides.length;
      hotTrack.style.transform = "translateX(-" + hotIndex * 100 + "%)";
    }
    var hotPrev = document.querySelector(".hot-prev");
    var hotNext = document.querySelector(".hot-next");
    if (hotPrev) hotPrev.addEventListener("click", function () { showHot(hotIndex - 1); });
    if (hotNext) hotNext.addEventListener("click", function () { showHot(hotIndex + 1); });

    var filterInput = document.querySelector(".movie-filter-input");
    var chips = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));
    var items = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .rank-card"));
    var activeFilter = "all";

    function setInitialQuery() {
      if (!filterInput) return;
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      if (q) filterInput.value = q;
    }

    function matches(item, query, filter) {
      var text = (item.getAttribute("data-search") || item.textContent || "").toLowerCase();
      var type = (item.getAttribute("data-type") || "").toLowerCase();
      var region = (item.getAttribute("data-region") || "").toLowerCase();
      var year = (item.getAttribute("data-year") || "").toLowerCase();
      var q = query.toLowerCase();
      var f = filter.toLowerCase();
      var queryOk = !q || text.indexOf(q) !== -1;
      var filterOk = f === "all" || text.indexOf(f) !== -1 || type === f || region === f || year === f;
      return queryOk && filterOk;
    }

    function applyFilter() {
      if (!items.length) return;
      var query = filterInput ? filterInput.value.trim() : "";
      items.forEach(function (item) {
        item.classList.toggle("is-hidden-by-filter", !matches(item, query, activeFilter));
      });
    }

    setInitialQuery();
    if (filterInput) {
      filterInput.addEventListener("input", applyFilter);
    }
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (other) {
          other.classList.remove("active");
        });
        chip.classList.add("active");
        activeFilter = chip.getAttribute("data-filter") || "all";
        applyFilter();
      });
    });
    applyFilter();
  });
})();
