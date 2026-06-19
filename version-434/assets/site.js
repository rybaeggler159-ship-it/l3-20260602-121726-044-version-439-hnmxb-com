(function(){
  var btn=document.querySelector('[data-menu-btn]');
  var nav=document.querySelector('[data-mobile-nav]');
  if(btn&&nav){btn.addEventListener('click',function(){nav.classList.toggle('open')})}
  var slides=[].slice.call(document.querySelectorAll('.hero-slide'));
  var dots=[].slice.call(document.querySelectorAll('[data-hero-dot]'));
  if(slides.length){
    var current=0;
    var show=function(i){slides[current].classList.remove('active');if(dots[current])dots[current].classList.remove('active');current=i;slides[current].classList.add('active');if(dots[current])dots[current].classList.add('active')};
    dots.forEach(function(d,i){d.addEventListener('click',function(){show(i)})});
    setInterval(function(){show((current+1)%slides.length)},5000)
  }
  var input=document.querySelector('[data-filter-input]');
  var select=document.querySelector('[data-sort-select]');
  var grid=document.querySelector('[data-card-grid]');
  var cards=grid?[].slice.call(grid.querySelectorAll('.movie-card')):[];
  var empty=document.querySelector('[data-empty]');
  var filter=function(){
    var q=input?input.value.trim().toLowerCase():'';
    var shown=0;
    cards.forEach(function(card){var ok=!q||card.getAttribute('data-search').toLowerCase().indexOf(q)>-1;card.classList.toggle('hidden-card',!ok);if(ok)shown++});
    if(empty)empty.classList.toggle('show',shown===0)
  };
  var sort=function(){
    if(!grid||!select)return;
    var v=select.value;
    if(v==='default'){cards.sort(function(a,b){return cards.indexOf(a)-cards.indexOf(b)})}
    else{cards.sort(function(a,b){return Number(b.getAttribute('data-'+v))-Number(a.getAttribute('data-'+v))})}
    cards.forEach(function(c){grid.appendChild(c)});
    filter();
  };
  if(input)input.addEventListener('input',filter);
  if(select)select.addEventListener('change',sort);
})();