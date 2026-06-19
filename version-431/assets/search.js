document.addEventListener("DOMContentLoaded", function () {
  var params = new URLSearchParams(window.location.search);
  var query = (params.get("q") || "").trim();
  var input = document.querySelector("[data-search-input]");
  var status = document.querySelector("[data-search-status]");
  var results = document.querySelector("[data-search-results]");

  if (input) {
    input.value = query;
  }

  if (!status || !results) {
    return;
  }

  if (!query) {
    status.textContent = "请输入关键词开始搜索";
    return;
  }

  var normalized = query.toLowerCase();
  var matched = (window.MOVIE_SEARCH_INDEX || []).filter(function (item) {
    return item.searchText.indexOf(normalized) !== -1;
  }).slice(0, 96);

  if (matched.length === 0) {
    status.textContent = "未找到相关影片";
    return;
  }

  status.textContent = "搜索关键词：" + query;
  results.innerHTML = matched.map(renderCard).join("");
});

function renderCard(item) {
  var tags = item.tags.slice(0, 3).map(function (tag) {
    return "<span>" + escapeHtml(tag) + "</span>";
  }).join("");

  return `
<a class="movie-card" href="./video-${item.id}.html">
  <span class="poster-frame">
    <img src="${item.cover}" alt="${escapeHtml(item.title)}" class="poster-image" loading="lazy" onerror="this.style.display='none';">
    <span class="movie-badge">${escapeHtml(item.category)}</span>
    <span class="movie-play">▶</span>
  </span>
  <span class="movie-card-body">
    <strong class="movie-title">${escapeHtml(item.title)}</strong>
    <span class="movie-line">${escapeHtml(item.oneLine)}</span>
    <span class="movie-meta">${escapeHtml(item.year)} · ${escapeHtml(item.type)} · ${escapeHtml(item.duration)}</span>
    <span class="tag-row">${tags}</span>
  </span>
</a>`.trim();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>\"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    }[character];
  });
}
