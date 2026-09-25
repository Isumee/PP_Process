let slideIndex = 1;
let navigationEnabled = true;
let hintsVisible = true;
showSlides(slideIndex);

const allSlides = Array.from(document.getElementsByClassName("mySlides"));
const realSlides = allSlides.length > 2 ? allSlides.slice(1, -1) : [];
const totalSteps = realSlides.length;
const interactiveSteps = realSlides.filter(slideHasBox).length;

function getActiveSlide() {
  const slides = document.getElementsByClassName("mySlides");
  if (!slides.length) {
    return null;
  }

  return slides[slideIndex - 1] || null;
}

function slideHasBox(slide) {
  return Boolean(slide && slide.querySelector('.box'));
}

function getToggleHintables() {
  return Array.from(document.querySelectorAll('.hintable')).filter(el => {
    const slide = el.closest('.mySlides');
    if (!slide) {
      return true;
    }

    if (!slideHasBox(slide) && el.classList.contains('text')) {
      return false;
    }

    return true;
  });
}

function ensureTextVisibilityForBoxlessSlide(activeSlide) {
  if (!activeSlide || slideHasBox(activeSlide)) {
    return;
  }

  const textHints = activeSlide.querySelectorAll('.hintable.text');
  textHints.forEach(el => el.classList.add('show-hint'));
}

function nextSlide() {
  showSlides(slideIndex + 1);
}

function prevSlide() {
  showSlides(slideIndex + -1);
}

function currentSlide(n) {
  showSlides(n);
}

function showSlides(n) {
  const slides = document.getElementsByClassName("mySlides");
  if (n > slides.length || n < 1) return;

  slideIndex = n;
  Array.from(slides).forEach((slide, i) => {
    slide.style.display = (i === slideIndex - 1) ? "block" : "none";
  });

  const activeSlide = slides[slideIndex - 1];
  updateLastSectionHeadline(activeSlide);
  updateNavigationState();
  ensureTextVisibilityForBoxlessSlide(activeSlide);
  updateLightbulbError(false);
  syncHintToggleState();
  updateGlobalBlinkDot(activeSlide);
  setNavBarColor(slideIndex);
  renderResultMetrics();
}

function renderResultMetrics() {
  const result = document.getElementById('result');
  const slides = document.getElementsByClassName("mySlides");

  if (!result || !slides.length) {
    return;
  }

  // Only show results on the last slide.
  if (slideIndex !== slides.length) {
    result.innerHTML = '';
    return;
  }

  result.innerHTML = `<p>From the total ${totalSteps} steps you had ${dynamicMetrics.correctSteps} steps correct, that is ${dynamicMetrics.accuracyRate.toFixed(2)}% accuracy.</p>`;
}

function updateGlobalBlinkDot(activeSlide) {
  const globalDot = document.getElementById('global-blink-dot');
  if (!globalDot || !activeSlide) return;

  if (!hintsVisible) {
    globalDot.style.display = 'none';
    return;
  }

  const src = activeSlide.querySelector('.blink-dot-source');
  if (src) {
    const color = src.getAttribute('data-color');
    if (color) globalDot.style.setProperty('--dot-color', color);

    // Source % are relative to .image-center, not .slideshow-container
    const imageCenter = src.closest('.image-center');
    const container = globalDot.parentElement; // .slideshow-container
    if (!imageCenter || !container) {
      globalDot.style.display = 'none';
      return;
    }

    const imgRect = imageCenter.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const topPct  = parseFloat(src.style.top)  / 100;
    const leftPct = parseFloat(src.style.left) / 100;

    // Pixel position relative to .slideshow-container
    const dotTop  = (imgRect.top  - containerRect.top)  + topPct  * imgRect.height;
    const dotLeft = (imgRect.left - containerRect.left) + leftPct * imgRect.width;

    const wasHidden = globalDot.style.display === 'none';
    if (wasHidden) {
      globalDot.style.transition = 'none';
      globalDot.style.top  = dotTop  + 'px';
      globalDot.style.left = dotLeft + 'px';
      globalDot.style.display = 'block';
      requestAnimationFrame(() => { globalDot.style.transition = ''; });
    } else {
      globalDot.style.top  = dotTop  + 'px';
      globalDot.style.left = dotLeft + 'px';
    }
  } else {
    globalDot.style.display = 'none';
  }
}

function updateNavigationState() {
  const slides = document.getElementsByClassName("mySlides");
  const next = document.getElementById("right-arrow");
  const previous = document.getElementById("left-arrow");
  const nextLink = document.querySelector(".next");
  const previousLink = document.querySelector(".prev");

  if (!next || !previous || !slides.length) {
    return;
  }

  const activeColor = "black";
  const disabledColor = "lightgray";

  if (!navigationEnabled) {
    next.style.fill = disabledColor;
    previous.style.fill = disabledColor;
    next.style.cursor = "default";
    previous.style.cursor = "default";
    if (nextLink) {
      nextLink.style.pointerEvents = "none";
      nextLink.style.cursor = "default";
    }
    if (previousLink) {
      previousLink.style.pointerEvents = "none";
      previousLink.style.cursor = "default";
    }
    return;
  }

  const isLastSlide = slideIndex === slides.length;
  const isFirstSlide = slideIndex === 1;

  next.style.fill = isLastSlide ? disabledColor : activeColor;
  next.style.cursor = isLastSlide ? "default" : "pointer";
  previous.style.fill = isFirstSlide ? disabledColor : activeColor;
  previous.style.cursor = isFirstSlide ? "default" : "pointer";

  if (nextLink) {
    nextLink.style.pointerEvents = isLastSlide ? "none" : "auto";
    nextLink.style.cursor = isLastSlide ? "default" : "pointer";
  }

  if (previousLink) {
    previousLink.style.pointerEvents = isFirstSlide ? "none" : "auto";
    previousLink.style.cursor = isFirstSlide ? "default" : "pointer";
  }
}

function updateLastSectionHeadline(activeSlide) {
  const target = document.getElementById("last-section-headline");
  if (!target || !activeSlide) {
    return;
  }

  const headline = activeSlide.getAttribute("data-last-headline");
  target.textContent = headline ? headline.trim() : "";
}

function setNavBarColor(n){
  let navbars = document.getElementsByClassName("nav");

  for(i = 0; i < navbars.length; i++){
	   navbars[i].style.backgroundColor = "LightGray";
	   if(navbars[i].id <= n-1){navbars[i].style.backgroundColor = "rgb(32,48,52)"}
  }
}

function toggleMenu() {
  const menu = document.getElementById('floating-menu');
  menu.classList.toggle('menu-hidden');
}

function goToSlide(slideNumber) {
  showSlides(slideNumber);
  toggleMenu();
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(function () {});
    return;
  }

  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

// 1. Get threshold from URL. Default to 0 if null or not a number.
const urlParams = new URLSearchParams(window.location.search);
const rawHint = urlParams.get('hints');
const hintThreshold = (rawHint === null) ? 0 : parseInt(rawHint);

let currentStepErrorCount = 0;
let totalErrorCount = 0; // Cumulative wrong clicks across the whole project
let incorrectStepCount = 0;
const incorrectStepSet = new Set();
const dynamicMetrics = {
  incorrectSteps: 0,
  correctSteps: totalSteps,
  accuracyRate: totalSteps === 0 ? 0 : 100,
  precisionRatio: 0
};
const clickables = document.querySelectorAll('.hintable');
const container = document.body; // You can change this to your slide container class

function recomputeDynamicMetrics() {
  dynamicMetrics.incorrectSteps = Array.from(incorrectStepSet).filter(
    stepIndex => stepIndex > 1 && stepIndex < allSlides.length
  ).length;
  dynamicMetrics.correctSteps = Math.max(0, totalSteps - dynamicMetrics.incorrectSteps);
  dynamicMetrics.accuracyRate = totalSteps === 0
    ? 0
    : ((totalSteps - dynamicMetrics.incorrectSteps) / totalSteps) * 100;
  dynamicMetrics.precisionRatio = interactiveSteps === 0
    ? 0
    : totalErrorCount / interactiveSteps;

  renderResultMetrics();
}

function registerHintHelpForSlide() {
  const slides = document.getElementsByClassName("mySlides");
  if (!slides.length) {
    return;
  }

  const activeSlide = slides[slideIndex - 1];
  if (!slideHasBox(activeSlide)) {
    return;
  }

  const slideKey = slideIndex;
  if (!incorrectStepSet.has(slideKey)) {
    incorrectStepSet.add(slideKey);
    incorrectStepCount = incorrectStepSet.size;
    recomputeDynamicMetrics();
  }
}

function updateLightbulbError(hasError) {
  const toggle = document.querySelector('.hint-toggle');
  if (!toggle) return;
  toggle.classList.toggle('has-error', hasError);
}

function syncHintToggleState() {
  const toggle = document.querySelector('.hint-toggle');
  if (!toggle) {
    return;
  }

  const toggleHintables = getToggleHintables();
  const hasVisibleHint = toggleHintables.length === 0
    ? true
    : toggleHintables.some(el => el.classList.contains('show-hint'));
  const activeSlide = getActiveSlide();
  const activeHasBox = slideHasBox(activeSlide);
  const canNavigate = activeHasBox ? hasVisibleHint : true;

  navigationEnabled = canNavigate;
  hintsVisible = canNavigate;
  toggle.classList.toggle('is-off', !hasVisibleHint);
  toggle.setAttribute('aria-pressed', hasVisibleHint ? 'true' : 'false');
  updateNavigationState();
  const slides = document.getElementsByClassName("mySlides");
  if (slides.length) {
    updateGlobalBlinkDot(slides[slideIndex - 1]);
  }

  ensureTextVisibilityForBoxlessSlide(activeSlide);
}

function revealHints(countHelp) {
  const toggleHintables = getToggleHintables();
  toggleHintables.forEach(el => el.classList.add('show-hint'));
  syncHintToggleState();
  if (countHelp) {
    registerHintHelpForSlide();
  }
}

// Immediate reveal if default (0)
if (hintThreshold === 0) {
  revealHints(false);
} else {
  syncHintToggleState();
  // Listen for missed clicks
  document.addEventListener('click', function(e) {
    if (e.target.closest('.hint-toggle')) return; // toggling hints is never a wrong click
    if (e.target.closest('.button.start')) return; // clicking start button is never a wrong click
    if (!slideHasBox(e.target.closest('.mySlides'))) return; // clicking next on a text-only slide is never a wrong click
    if (!e.target.closest('.clickable')) {

      currentStepErrorCount++;
      totalErrorCount++;
      recomputeDynamicMetrics();
      updateLightbulbError(true);

      if (currentStepErrorCount >= hintThreshold) {
        revealHints(true);
      }
    }
  });
}

function showCorrectCheckmark() {
  const mark = document.getElementById('correct-checkmark');
  if (!mark) return;
  mark.classList.remove('visible');
  void mark.offsetWidth; // force reflow to restart animation
  mark.classList.add('visible');
  clearTimeout(mark._hideTimer);
  mark._hideTimer = setTimeout(() => mark.classList.remove('visible'), 2000);
}

// Handle correct clicks
clickables.forEach(bubble => {
  bubble.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevents the click from counting as a "wrong" click

    // Don't advance if the user clicked a nav button inside the speech bubble
    if (e.target.closest('.prevbutton') || e.target.closest('.nextbutton')) return;

    showCorrectCheckmark();

    if (typeof nextSlide === "function") {
      const slides = document.getElementsByClassName("mySlides");
      if (slideIndex >= slides.length) {
        showSlides(1);
      } else {
        nextSlide();
      }
      // Optional: Reset for next slide
      currentStepErrorCount = 0;
      if (hintThreshold > 0) {
        const toggleHintables = getToggleHintables();
        toggleHintables.forEach(el => el.classList.remove('show-hint'));
        syncHintToggleState();
      }
    }
  });
});

function toggleHints() {
  const toggleHintables = getToggleHintables();
  const isVisible = toggleHintables[0] && toggleHintables[0].classList.contains('show-hint');
  toggleHintables.forEach(el => {
    if (isVisible) {
      el.classList.remove('show-hint');
    } else {
      el.classList.add('show-hint');
    }
  });

  syncHintToggleState();
  if (!isVisible) {
    registerHintHelpForSlide();
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const menu = document.getElementById('floating-menu');
    if (menu && !menu.classList.contains('menu-hidden')) {
      menu.classList.add('menu-hidden');
    }
  }
  // Check if the user pressed the 'H' key (case insensitive)
  if (e.key.toLowerCase() === 'h') {
    toggleHints();
  }
  // toggle menu with 'M' key
  if (e.key.toLowerCase() === 'm') {
    toggleMenu();
  }
});

// Navigate slides with arrow keys
document.addEventListener('keydown', function(event) {
  if (!navigationEnabled) {
    return;
  }

  if (event.key === 'ArrowRight') {
    nextSlide(); // Go to next slide
  } else if (event.key === 'ArrowLeft') {
    prevSlide(); // Go to previous slide
  }
});

document.addEventListener('click', function(event) {
  const menu = document.getElementById('floating-menu');
  const button = document.querySelector('.menu-toggle');

  if (!menu || !button) {
    return;
  }

  // Check if the menu is currently open (not hidden)
  const isMenuOpen = !menu.classList.contains('menu-hidden');

  // If menu is open AND the click was NOT on the menu AND NOT on the button...
  if (isMenuOpen && !menu.contains(event.target) && !button.contains(event.target)) {
    menu.classList.add('menu-hidden');
  }
});

function refreshBlinkDotPosition() {
  const slides = document.getElementsByClassName("mySlides");
  if (slides.length) {
    updateGlobalBlinkDot(slides[slideIndex - 1]);
  }
}

window.addEventListener('resize', refreshBlinkDotPosition);
document.addEventListener('fullscreenchange', refreshBlinkDotPosition);

window.dynamicMetrics = dynamicMetrics;
renderResultMetrics();
