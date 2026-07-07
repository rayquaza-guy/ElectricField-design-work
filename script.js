// Electricfield — homepage interactions
// Sections get their JS added here as they're built.

// ---------------------------------------------------------
// NAV — soft shadow once scrolled past the top
// ---------------------------------------------------------
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ---------------------------------------------------------
// GLOBAL — scroll-triggered fade-in for each major section
// ---------------------------------------------------------
const revealTargets = document.querySelectorAll(
  '.capability, .clients, .products, .heritage, .awards, .cta'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => revealObserver.observe(el));

// ---------------------------------------------------------
// HERO — no JS needed (static image, no zoom/duotone/grain effects)
// ---------------------------------------------------------

// ---------------------------------------------------------
// CAPABILITY — count-up animation, triggered once when scrolled into view
// ---------------------------------------------------------
const countEls = document.querySelectorAll('.capability__num');
const COUNT_DURATION = 1400; // ms

function animateCount(el){
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const start = performance.now();

  function tick(now){
    const progress = Math.min((now - start) / COUNT_DURATION, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic, feels less mechanical than linear
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (countEls.length) {
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  countEls.forEach(el => countObserver.observe(el));
}


// ---------------------------------------------------------
// PRODUCTS — card expand: hover or click expands in place (overlapping
// its neighbour). Moving the mouse away collapses it quickly; a click
// keeps it open until an outside click, with a short timeout as a
// fallback for touch devices with no mouseleave. Deck rotation pauses
// while a card is expanded.
// ---------------------------------------------------------
// ---------------------------------------------------------
// PRODUCTS — 3 groups of 3, click arrows to browse, auto-advances
// every 4s, resets on manual navigation
// ---------------------------------------------------------
const deckGroups = document.querySelectorAll('.deck__group');
const deckArrowLeft = document.querySelector('.deck__arrow--left');
const deckArrowRight = document.querySelector('.deck__arrow--right');

const DECK_INTERVAL = 8000;
let activeGroup = 0;
let deckTimer = null;

function showGroup(index){
  activeGroup = (index + deckGroups.length) % deckGroups.length;
  deckGroups.forEach((g, i) => g.classList.toggle('is-active', i === activeGroup));
}

function resetDeckTimer(){
  clearInterval(deckTimer);
  deckTimer = setInterval(() => showGroup(activeGroup + 1), DECK_INTERVAL);
}

if (deckGroups.length && deckArrowLeft && deckArrowRight) {
  deckArrowLeft.addEventListener('click', () => { showGroup(activeGroup - 1); resetDeckTimer(); });
  deckArrowRight.addEventListener('click', () => { showGroup(activeGroup + 1); resetDeckTimer(); });
  resetDeckTimer();
}