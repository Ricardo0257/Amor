// Helper to base64 encode Unicode (supports emojis)
function b64(str){
  // encodeURIComponent -> percent-escaped UTF-8 -> convert to binary string -> btoa
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p) => String.fromCharCode(parseInt(p, 16))));
}

// Cute inline SVG images as data URIs (self-contained)
const initialImage = "data:image/svg+xml;base64," + b64(`\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'>\
  <defs>\
    <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>\
      <stop offset='0%' stop-color='#ff9ac7'/>\
      <stop offset='100%' stop-color='#ff5ca9'/>\
    </linearGradient>\
  </defs>\
  <rect width='100%' height='100%' fill='#fff4fb'/>\
  <g transform='translate(150,150)'>\
    <path d='M0 90 C-80 30 -130 -30 -95 -75 C-60 -115 -10 -90 0 -55 C10 -90 60 -115 95 -75 C130 -30 80 30 0 90Z' fill='url(#g)' stroke='#e24694' stroke-width='4'/>\
    <circle cx='-28' cy='-10' r='10' fill='#4a2b3b'/>\
    <circle cx='28' cy='-10' r='10' fill='#4a2b3b'/>\
    <path d='M-25 20 Q0 38 25 20' fill='none' stroke='#4a2b3b' stroke-width='6' stroke-linecap='round'/>\
    <text x='0' y='-90' text-anchor='middle' font-size='18' fill='#e24694' font-family='Segoe UI, Arial'></text>\
  </g>\
</svg>`);

const happyImage = "data:image/svg+xml;base64," + b64(`\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'>\
  <defs>\
    <linearGradient id='g2' x1='0' x2='1' y1='0' y2='1'>\
      <stop offset='0%' stop-color='#ffc6e1'/>\
      <stop offset='100%' stop-color='#ff90c6'/>\
    </linearGradient>\
  </defs>\
  <rect width='100%' height='100%' fill='#fff4fb'/>\
  <g transform='translate(150,150)'>\
    <path d='M0 95 C-85 35 -140 -30 -100 -80 C-60 -125 -10 -95 0 -60 C10 -95 60 -125 100 -80 C140 -30 85 35 0 95Z' fill='url(#g2)' stroke='#ff5ca9' stroke-width='4'/>\
    <circle cx='-30' cy='-5' r='10' fill='#4a2b3b'/>\
    <circle cx='30' cy='-5' r='10' fill='#4a2b3b'/>\
    <path d='M-30 20 Q0 55 30 20' fill='none' stroke='#4a2b3b' stroke-width='6' stroke-linecap='round'/>\
    <g>\
      <text x='0' y='-90' text-anchor='middle' font-size='18' fill='#ff5ca9' font-family='Segoe UI, Arial'></text>\
    </g>\
  </g>\
</svg>`);

const imgEl = document.getElementById('mainImage');
const questionEl = document.getElementById('question');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const buttons = document.getElementById('buttons');

// Set initial image
imgEl.src = initialImage;

// Utility: clamp value between min/max
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Smoothly move the No button away using CSS transforms (no layout shift)
const state = {
  base: null, // base rect without transform
  tx: 0,
  ty: 0,
};

function measureBase(){
  const prev = noBtn.style.transform;
  noBtn.style.transform = 'none';
  state.base = noBtn.getBoundingClientRect();
  noBtn.style.transform = prev;
}

measureBase();
window.addEventListener('resize', measureBase);
window.addEventListener('scroll', measureBase, { passive: true });

const REPEL_RADIUS = 140;    // px distance to start pushing
const MAX_PUSH = 260;         // max translate in px
const PADDING = 8;            // viewport padding

function clampTranslate(tx, ty){
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = state.base.width;
  const h = state.base.height;
  const baseLeft = state.base.left;
  const baseTop = state.base.top;

  // Clamp so the transformed rect stays inside viewport with padding
  const minTx = PADDING - baseLeft;
  const maxTx = vw - PADDING - w - baseLeft;
  const minTy = PADDING - baseTop;
  const maxTy = vh - PADDING - h - baseTop;
  return [clamp(tx, minTx, maxTx), clamp(ty, minTy, maxTy)];
}

function repelFromPoint(px, py){
  const rect = noBtn.getBoundingClientRect(); // includes current transform
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  const dx = cx - px;
  const dy = cy - py;
  const dist = Math.hypot(dx, dy);
  if(dist >= REPEL_RADIUS){
    // If far, relax back toward origin smoothly
    state.tx *= 0.85;
    state.ty *= 0.85;
  }else{
    const nx = dx / (dist || 1);
    const ny = dy / (dist || 1);
    const strength = (REPEL_RADIUS - dist) / REPEL_RADIUS; // 0..1
    const push = 30 + strength * MAX_PUSH; // ensure minimal push
    let targetTx = nx * push;
    let targetTy = ny * push;
    // Light jitter so it feels playful
    targetTx += (Math.random() - 0.5) * 8;
    targetTy += (Math.random() - 0.5) * 8;
    // Clamp to viewport relative to base
    ;[targetTx, targetTy] = clampTranslate(targetTx, targetTy);
    // Smoothly approach target (lerp)
    state.tx = state.tx + (targetTx - state.tx) * 0.6;
    state.ty = state.ty + (targetTy - state.ty) * 0.6;
  }
  noBtn.style.transform = `translate(${state.tx.toFixed(1)}px, ${state.ty.toFixed(1)}px)`;
}

function onPointerMove(e){
  repelFromPoint(e.clientX, e.clientY);
}

if (window.PointerEvent) {
  document.addEventListener('pointermove', onPointerMove, { passive: true });
} else {
  // Fallbacks for older browsers (no Pointer Events)
  document.addEventListener('mousemove', function(e){
    repelFromPoint(e.clientX, e.clientY);
  }, { passive: true });
  document.addEventListener('touchmove', function(e){
    if (e && e.touches && e.touches.length > 0) {
      var t = e.touches[0];
      repelFromPoint(t.clientX, t.clientY);
    }
  }, { passive: true });
}

// Nudge on focus/touch/press attempts as well
['pointerdown','touchstart','mouseenter','focus'].forEach(function(ev){
  noBtn.addEventListener(ev, function(e){
    var x, y;
    if (typeof e.clientX === 'number' && typeof e.clientY === 'number') {
      x = e.clientX; y = e.clientY;
    } else if (e && e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX; y = e.touches[0].clientY;
    } else if (state.base) {
      x = state.base.left + state.base.width/2;
      y = state.base.top + state.base.height/2;
    } else {
      x = window.innerWidth/2; y = window.innerHeight/2;
    }
    repelFromPoint(x, y);
    // No preventDefault in passive listeners; not required here
  }, { passive: true });
});

// Audio: play the user's sound every click (allow overlap for spamming)
const SOUND_SRC = 'yippee-meme-sound-effect.mp3';
function playYippee(){
  try{
    const a = new Audio(SOUND_SRC);
    a.volume = 1.0;
    a.play().catch(()=>{/* ignore playback errors */});
  }catch(_){/* ignore */}
}

let accepted = false;
// Yes button action
yesBtn.addEventListener('click', ()=>{
  // First time: change image and question; subsequent clicks just celebrate again
  if(!accepted){
    imgEl.src = happyImage;
    questionEl.textContent = 'Yhupiiiii! me too :3';
    // Optional: hide the No button after acceptance
    noBtn.style.display = 'none';
    accepted = true;
  }

  // Celebrate 🎉 on every click
  launchConfetti();
  playYippee();
});

// Confetti implementation (vanilla CSS + DOM)
function launchConfetti(){
  const colors = ['#ff5ca9','#ff9ac7','#ffd1e8','#7a8cff','#8deaff','#7ef9a7','#fff176'];
  const pieces = 180;
  for(let i=0;i<pieces;i++){
    const el = document.createElement('div');
    el.className = 'confetti';
    const size = (Math.random()*8 + 6)|0; // 6-14
    const startX = (Math.random()*100)|0; // vw
    const endX = startX + (Math.random()*40 - 20); // drift
    const rot = (Math.random()*360)|0;
    const dur = (Math.random()*2.2 + 2.8).toFixed(2) + 's';

    el.style.setProperty('--size', size + 'px');
    el.style.setProperty('--color', colors[i % colors.length]);
    el.style.setProperty('--startX', startX + 'vw');
    el.style.setProperty('--endX', endX + 'vw');
    el.style.setProperty('--rot', rot + 'deg');
    el.style.setProperty('--dur', dur);

    document.body.appendChild(el);

    const removeAfter = parseFloat(dur) * 1000 + 1000;
    setTimeout(()=> el.remove(), removeAfter);
  }
}

// Cleaned: no layout repositioning handler needed anymore
