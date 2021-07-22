'use strict'

const isTouchDevice = 'ontouchstart' in document.documentElement;
const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const loadingEl = document.querySelector('.loading');
const viewportEl = document.querySelector('.viewport');
const containerEl = viewportEl.querySelector('.container');
const menuEl = document.querySelector('.menu');
const pageAudio = new Audio('https://raw.githubusercontent.com/rayc2045/raychang-space/master/public/assets/audio/page.mp3');

document.onselectstart = () => false;
document.ondragstart = () => false;
document.oncontextmenu = () => false;
disableScroll();

window.onload = async() => {
  if (!isTouchDevice) {
    const aEls = document.querySelectorAll('a');
    activateHoverInteraction(aEls);
    smoothScroll();
  }
  await endLoading();
  enableScroll();
  resizeBodyHeight();
};

window.onscroll = () => hideEl(menuEl);

window.onresize = () => {
  hideEl(menuEl);
  resizeBodyHeight();
};

containerEl.onmousedown = e => {
  if (e.which === 1) appendCircle(e, containerEl);
};

document.onmousedown = e => {
  if (!e.target.hasAttribute('href')) hideEl(menuEl);
};

document.onmouseup = e => {
  if (e.target.hasAttribute('href')) {
    playAudio(pageAudio);
    hideEl(menuEl);
    if (e.which === 3) window.open(e.target.href, '_blank');
  }
};

document.oncontextmenu = e => {
  if (e.target.hasAttribute('href')) return false;
  showMenu(e);
};

//////////////////////////////////////////////////////////////////
///////////////////////  Functions  //////////////////////////////
//////////////////////////////////////////////////////////////////

function disableScroll() {
  document.body.style.overflow = 'hidden';
}

function enableScroll() {
  document.body.style.overflow = '';
}

async function endLoading(delay = 0) {
  await new Promise(resolve => {
    setTimeout(() => {
      loadingEl.classList.add('animated');
      resolve();
    }, delay * 1000);
  });
  await new Promise(resolve => {
    setTimeout(() => {
      removeElement(loadingEl);
      resolve();
    }, delay * 1000 + 1500);
  });
}

function activateHoverInteraction(els) {
  els.forEach(el => el.classList.add('hover-interaction'));
}

function smoothScroll() {
  viewportEl.classList.add('SmoothScroll');

  new SmoothScroll({
    target: containerEl,
    scrollEase: 0.08,
    maxOffset: 500,
  });
}

function appendCircle(e, element, duration = 1.5) {
  const circle = document.createElement('div');
  circle.classList.add('circle');

  const circleOffset = 0.25 * document.body.getBoundingClientRect().width;
  let customCursorOffset = -(0.004 * document.body.getBoundingClientRect().width);
  if (isTouchDevice) customCursorOffset = 0;
  circle.style.left = `${e.pageX - circleOffset - customCursorOffset}px`;
  circle.style.top = `${e.pageY - circleOffset - customCursorOffset}px`;
  circle.style.animationDuration = `${duration}s`;

  element.appendChild(circle);
  setTimeout(() => removeElement(circle), duration * 1000);
}

function showMenu(e) {
  e.preventDefault();
  menuEl.classList.remove('hide');

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const menuWidth = menuEl.getBoundingClientRect().width;
  const menuHeight = menuEl.getBoundingClientRect().height;
  const offset = 5;
  let menuPosX = `${e.clientX + offset}px`;
  let menuPosY = `${e.clientY + offset}px`;

  if (e.clientX + offset + menuWidth > windowWidth)
    menuPosX = `${e.clientX - offset - menuWidth}px`;
  
  if (e.clientY + offset + menuHeight > windowHeight)
    menuPosY = `${e.clientY - offset - menuHeight}px`;

  menuEl.style.left = menuPosX;
  menuEl.style.top = menuPosY;
}


function hideEl(el){
  el.classList.add('hide');
}

function removeElement(el) {
  el.parentNode.removeChild(el);
}

function playAudio(audio, volume = 1) {
  audio.currentTime = 0;
  audio.volume = volume;
  audio.play();
}

function resizeBodyHeight() {
  document.body.style.height = viewportEl.scrollHeight + 'px';
}