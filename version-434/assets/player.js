function initPlayer(src){
  var video=document.getElementById('player');
  var cover=document.querySelector('[data-play-cover]');
  var loaded=false;
  if(!video)return;
  function attach(){
    if(loaded)return;
    loaded=true;
    if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=src;video.play().catch(function(){})}
    else if(window.Hls&&window.Hls.isSupported()){var hls=new Hls({lowLatencyMode:true});hls.loadSource(src);hls.attachMedia(video);hls.on(Hls.Events.MANIFEST_PARSED,function(){video.play().catch(function(){})})}
    else{video.src=src;video.play().catch(function(){})}
  }
  function start(){if(cover)cover.classList.add('is-hidden');attach();video.play().catch(function(){})}
  if(cover)cover.addEventListener('click',start);
  video.addEventListener('click',function(){if(video.paused)start();else video.pause()});
}