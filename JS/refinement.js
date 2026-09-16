document.addEventListener("DOMContentLoaded",function(){
"use strict";
const button=document.querySelector(".tcs-menu"),nav=document.querySelector(".tcs-links");
const header=document.querySelector(".tcs-header");
const desktop=window.matchMedia("(min-width:1001px)");
const disclosures=[];
function shutSubmenus(){disclosures.forEach(({trigger,list})=>{trigger.setAttribute("aria-expanded","false");list.hidden=true;});}
function close(){if(!nav||!button)return;nav.classList.remove("tcs-open");button.setAttribute("aria-expanded","false");button.textContent="Menu";shutSubmenus();}
if(button&&nav){
document.documentElement.classList.add("tcs-nav-enhanced");
nav.querySelectorAll(".tcs-submenu").forEach((list,i)=>{
const item=list.parentElement,link=item.querySelector("a"),trigger=document.createElement("button");
trigger.type="button";trigger.className="tcs-submenu-toggle";
item.classList.add("tcs-services-item");
trigger.textContent="";trigger.setAttribute("aria-label","Show "+link.textContent.trim()+" submenu");
list.id="tcs-submenu-"+i;list.hidden=true;trigger.setAttribute("aria-controls",list.id);trigger.setAttribute("aria-expanded","false");
link.after(trigger);disclosures.push({trigger,list});
trigger.addEventListener("click",()=>{const open=trigger.getAttribute("aria-expanded")!=="true";shutSubmenus();trigger.setAttribute("aria-expanded",String(open));list.hidden=!open;});
item.addEventListener("keydown",e=>{if(e.key==="Escape"&&!list.hidden){e.stopPropagation();list.hidden=true;trigger.setAttribute("aria-expanded","false");trigger.focus();}});
});
button.addEventListener("click",()=>{const open=!nav.classList.contains("tcs-open");nav.classList.toggle("tcs-open",open);button.setAttribute("aria-expanded",String(open));button.textContent=open?"Close":"Menu";if(!open)shutSubmenus();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("tcs-open")){close();button.focus();}});
document.addEventListener("click",e=>{if(!e.target.closest(".tcs-header"))close();});
header.addEventListener("focusout",()=>setTimeout(()=>{if(!header.contains(document.activeElement))close();},0));
if(desktop.addEventListener)desktop.addEventListener("change",close);else if(desktop.addListener)desktop.addListener(close);
}
const main=document.querySelector("main");if(main){if(!main.id)main.id="main-content";main.setAttribute("tabindex","-1");const skip=document.createElement("a");skip.className="tcs-skip";skip.href="#"+main.id;skip.textContent="Skip to content";document.body.prepend(skip);}

// Give wide data tables a focusable scrolling region instead of widening the page.
document.querySelectorAll("main table").forEach((table,i)=>{
let wrapper=table.parentElement;
if(!wrapper.matches(".pricing-table-scroll, .tcs-table-scroll, .table-responsive, .table-scroll")){
wrapper=document.createElement("div");wrapper.className="tcs-table-scroll";table.before(wrapper);wrapper.append(table);
}
wrapper.classList.add("tcs-table-scroll");wrapper.tabIndex=0;wrapper.setAttribute("role","region");
const caption=table.querySelector("caption");wrapper.setAttribute("aria-label",caption?caption.textContent.trim():"Scrollable table "+(i+1));
});

// Mobile keyboard and autofill hints; submission and validation remain owned by each form.
document.querySelectorAll('input[type="email"]').forEach(input=>{input.inputMode="email";input.setAttribute("autocapitalize","none");input.spellcheck=false;if(!input.autocomplete)input.autocomplete="email";});
document.querySelectorAll('input[type="tel"]').forEach(input=>{input.inputMode="tel";if(!input.autocomplete)input.autocomplete="tel";});
document.querySelectorAll('input[type="url"]').forEach(input=>{input.inputMode="url";input.setAttribute("autocapitalize","none");input.spellcheck=false;});

// Keep keyboard focus within the existing open portfolio dialog.
const modal=document.getElementById("portfolioModal");
if(modal){
modal.addEventListener("keydown",e=>{
if(e.key!=="Tab"||modal.getAttribute("aria-hidden")!=="false")return;
const nodes=Array.from(modal.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(n=>n.getClientRects().length);
if(!nodes.length){e.preventDefault();modal.focus();return;}
const first=nodes[0],last=nodes[nodes.length-1];
if(e.shiftKey&&(document.activeElement===first||document.activeElement===modal)){e.preventDefault();last.focus();}
else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===modal)){e.preventDefault();first.focus();}
});
}
});
/* Progressive motion layer: no network dependencies, no hidden content fallback. */
(function () {
  "use strict";
  function startStudioEffects() {
    if (document.documentElement.dataset.tcsEffects) return;
    document.documentElement.dataset.tcsEffects = "ready";
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let optedOut = false;
    try { optedOut = localStorage.getItem("tcs-motion") === "off"; } catch (_) {}
    const running = new Set();
    const tracked = new WeakMap();
    const enabled = () => !reduce.matches && !optedOut;
    function play(node, frames, options) {
      if (!node || !enabled() || typeof node.animate !== "function") return;
      const previous = tracked.get(node);
      if (previous) { previous.cancel(); running.delete(previous); }
      const animation = node.animate(frames, {duration: 560, easing: "cubic-bezier(.2,.7,.2,1)", ...options});
      tracked.set(node, animation); running.add(animation);
      animation.onfinish = animation.oncancel = () => running.delete(animation);
      return animation;
    }
    let quickToggle = null;
    const panel = document.createElement("div");
    panel.className = "tcs-motion-panel";
    const label = document.createElement("span");
    label.textContent = "A little movement. Your choice.";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "tcs-motion-toggle";
    toggle.setAttribute("aria-label", "Pause decorative motion");
    panel.append(label, toggle);
    (document.querySelector("#site-footer .container") || document.querySelector("#site-footer"))?.append(panel);
    function syncMotion() {
      root.dataset.tcsMotion = enabled() ? "on" : "off";
      toggle.setAttribute("aria-pressed", String(!enabled()));
      toggle.textContent = reduce.matches ? "Motion reduced by device" : optedOut ? "Motion paused" : "Pause motion";
      toggle.disabled = reduce.matches;
      toggle.setAttribute("aria-label", reduce.matches ? "Motion reduced by device" : optedOut ? "Resume decorative motion" : "Pause decorative motion");
      if (quickToggle) {
        quickToggle.textContent = reduce.matches ? "Motion reduced" : optedOut ? "Play motion" : "Pause motion";
        quickToggle.setAttribute("aria-pressed", String(!enabled()));
        quickToggle.disabled = reduce.matches;
        quickToggle.setAttribute("aria-label", toggle.getAttribute("aria-label"));
      }
      if (!enabled()) {
        running.forEach(a => a.cancel()); running.clear();
        document.querySelectorAll(".tcs-interactive-card").forEach(card => {
          card.style.removeProperty("--tcs-x"); card.style.removeProperty("--tcs-y");
        });
      }
    }
    toggle.addEventListener("click", () => {
      optedOut = !optedOut;
      try { localStorage.setItem("tcs-motion", optedOut ? "off" : "on"); } catch (_) {}
      syncMotion();
    });
    if (reduce.addEventListener) reduce.addEventListener("change", syncMotion);
    else if (reduce.addListener) reduce.addListener(syncMotion);
    syncMotion();

    // A thin reading-progress accent stays outside the document flow.
    const header = document.querySelector(".tcs-header");
    let progress;
    if (header) {
      progress = document.createElement("div");
      progress.className = "tcs-reading-progress";
      progress.setAttribute("aria-hidden", "true");
      header.append(progress);
      let queued = false;
      function updateProgress() {
        queued = false;
        const range = document.documentElement.scrollHeight - window.innerHeight;
        const amount = range > 0 ? Math.max(0, Math.min(1, window.scrollY / range)) : 0;
        progress.style.transform = "scaleX(" + amount + ")";
        header.classList.toggle("tcs-scrolled", window.scrollY > 24);
      }
      function scheduleProgress() {
        if (!queued) { queued = true; requestAnimationFrame(updateProgress); }
      }
      addEventListener("scroll", scheduleProgress, {passive: true});
      addEventListener("resize", scheduleProgress, {passive: true});
      if ("ResizeObserver" in window) new ResizeObserver(scheduleProgress).observe(document.body);
      updateProgress();
    }

    // Reveal only at entry, never set permanent opacity or hide essential content.
    if ("IntersectionObserver" in window) {
      const reveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const node = entry.target;
          reveal.unobserve(node);
          if (node.getBoundingClientRect().top < 0) return;
          play(node, [
            {opacity: .45, translate: "0 22px"},
            {opacity: 1, translate: "0 0"}
          ], {delay: Number(node.dataset.tcsDelay || 0)});
        });
      }, {threshold: .12});
      document.querySelectorAll(".tcs-service-lead, #featured-work .portfolio-card, .section-title, .tcs-section-heading, .about-card").forEach((node, i) => {
        node.dataset.tcsDelay = String((i % 3) * 65);
        reveal.observe(node);
      });
    }

    // Cursor-following light only on non-touch devices. Buttons never move away.
    document.querySelectorAll(".tcs-service-lead, #featured-work .portfolio-card, .portfolio-item").forEach(card => {
      card.classList.add("tcs-interactive-card");
      let frame = 0, x = 50, y = 50;
      card.addEventListener("pointermove", event => {
        if (!enabled() || !fine.matches || event.pointerType === "touch") return;
        const bounds = card.getBoundingClientRect();
        x = (event.clientX - bounds.left) / Math.max(bounds.width, 1) * 100;
        y = (event.clientY - bounds.top) / Math.max(bounds.height, 1) * 100;
        if (!frame) frame = requestAnimationFrame(() => {
          frame = 0;
          card.style.setProperty("--tcs-x", x + "%");
          card.style.setProperty("--tcs-y", y + "%");
        });
      }, {passive: true});
      card.addEventListener("pointerleave", () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        card.style.removeProperty("--tcs-x"); card.style.removeProperty("--tcs-y");
      });
    });

    // A short, finite accent on the hero; no perpetual motion behind the text.
    const hero = document.querySelector("#hero");
    if (hero) {
      const ribbon = document.createElement("div");
      ribbon.className = "tcs-motion-ribbon";
      const windowBox = document.createElement("div");
      windowBox.className = "tcs-ribbon-window";
      const track = document.createElement("div");
      track.className = "tcs-ribbon-track";
      const words = ["WEBSITE DESIGN", "LOGO & BRANDING", "PRINT & SIGNS", "DIGITAL GRAPHICS"];
      for (let copy = 0; copy < 2; copy++) {
        const group = document.createElement("div");
        group.className = "tcs-ribbon-group";
        if (copy) group.setAttribute("aria-hidden", "true");
        words.forEach(word => { const tag = document.createElement("span"); tag.textContent = word; group.append(tag); });
        track.append(group);
      }
      windowBox.append(track);
      quickToggle = document.createElement("button");
      quickToggle.className = "tcs-ribbon-pause";
      quickToggle.type = "button";
      quickToggle.setAttribute("aria-label", "Pause decorative motion");
      quickToggle.addEventListener("click", () => toggle.click());
      ribbon.append(windowBox, quickToggle);
      hero.after(ribbon);
      syncMotion();
      hero.classList.add("tcs-effects-hero");
      const accent = document.createElement("div");
      accent.className = "tcs-hero-accent";
      accent.setAttribute("aria-hidden", "true");
      hero.prepend(accent);
      play(accent, [{opacity: .1, scale: ".92"}, {opacity: 1, scale: "1"}], {duration: 1400});
      const heading = hero.querySelector("h1 span");
      if (heading) {
        heading.classList.add("tcs-heading-accent");
        play(heading, [{backgroundPosition: "100% 50%"}, {backgroundPosition: "0% 50%"}], {duration: 1200});
      }
    }

    // Keep existing filter and dialog logic, animate only the resulting presentation.
    document.querySelectorAll(".filter-btn").forEach(button => {
      button.addEventListener("click", () => requestAnimationFrame(() => {
        document.querySelectorAll(".portfolio-item:not([hidden])").forEach((item, i) => {
          play(item, [{opacity: .3, translate: "0 14px"}, {opacity: 1, translate: "0 0"}],
            {duration: 380, delay: Math.min(i, 5) * 40});
        });
      }));
    });
    const modal = document.getElementById("portfolioModal");
    if (modal && "MutationObserver" in window) {
      new MutationObserver(() => {
        if (modal.getAttribute("aria-hidden") === "false") {
          play(modal.querySelector(".portfolio-modal-copy"), [
            {opacity: .3, translate: "0 10px"}, {opacity: 1, translate: "0 0"}
          ], {duration: 300});
        }
      }).observe(modal, {attributes: true, attributeFilter: ["aria-hidden"]});
    }
    document.querySelectorAll(".tcs-service-directory").forEach(details => {
      details.addEventListener("toggle", () => {
        if (details.open) play(details.querySelector(".services-grid"),
          [{opacity: .5, translate: "0 -8px"}, {opacity: 1, translate: "0 0"}], {duration: 300});
      });
    });
    // Keyboard users always see content without waiting for its entrance.
    document.addEventListener("focusin", e => {
      let node = e.target;
      while (node && node !== document.body) {
        const animation = tracked.get(node);
        if (animation) animation.cancel();
        node = node.parentElement;
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { running.forEach(a => a.cancel()); running.clear(); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startStudioEffects);
  else startStudioEffects();
})();
