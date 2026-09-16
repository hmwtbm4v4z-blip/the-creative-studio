/* Stable-target pointer depth and scroll-aware process emphasis. */
(function(){
  function startDetailAccents(){
    const home=document.querySelector(".tcs-home");
    if(!home)return;
    const fine=window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
    const canMove=()=>fine.matches&&!reduce.matches&&document.documentElement.dataset.tcsMotion==="on";
    const feature=home.querySelector(".tcs-showcase");
    if(feature){
      let frame=0,rx=0,ry=0;
      function reset(){
        if(frame)cancelAnimationFrame(frame);
        frame=0;feature.classList.remove("tcs-tilting");
        feature.style.removeProperty("--tcs-tilt-x");
        feature.style.removeProperty("--tcs-tilt-y");
      }
      feature.addEventListener("pointermove",event=>{
        if(!canMove()||event.pointerType==="touch"){reset();return;}
        const box=feature.getBoundingClientRect();
        rx=Math.max(-3,Math.min(3,((event.clientY-box.top)/Math.max(box.height,1)-.5)*-6));
        ry=Math.max(-3,Math.min(3,((event.clientX-box.left)/Math.max(box.width,1)-.5)*6));
        if(!frame)frame=requestAnimationFrame(()=>{
          frame=0;if(!canMove()){reset();return;}
          feature.classList.add("tcs-tilting");
          feature.style.setProperty("--tcs-tilt-x",rx+"deg");
          feature.style.setProperty("--tcs-tilt-y",ry+"deg");
        });
      },{passive:true});
      feature.addEventListener("pointerleave",reset);
      feature.addEventListener("focusin",reset);
      document.addEventListener("visibilitychange",reset);
      if(reduce.addEventListener)reduce.addEventListener("change",reset);
      else if(reduce.addListener)reduce.addListener(reset);
    }
    if("IntersectionObserver" in window){
      const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>entry.target.classList.toggle("tcs-step-highlight",entry.isIntersecting));
      },{threshold:.6});
      home.querySelectorAll(".process-step").forEach(step=>observer.observe(step));
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startDetailAccents);
  else startDetailAccents();
})();
