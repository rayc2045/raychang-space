'use strict'

const isTouchDevice = 'ontouchstart' in document.documentElement;
const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
const loadingEl = document.querySelector('.loading');
const menuEl = document.querySelector('.menu');
const pageAudio = new Audio('https://raw.githubusercontent.com/rayc2045/raychang-space/master/audio/page.mp3')

document.onselectstart = () => false;
document.ondragstart = () => false;
document.oncontextmenu = () => false;
disableScroll();
window.onscroll = () => hideEl(menuEl);

window.onresize = () => {
  hideEl(menuEl);
  initWindowSize();
};

window.onload = () => {
  if (!isTouchDevice && !isFirefox) smoothScroll();
  endLoading(0.5);
  
  document.oncontextmenu = e => {
    if (e.target.hasAttribute('href')) return false;
    showMenu(e);
  };
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

function removeElement(el) {
  el.parentNode.removeChild(el);
}

function disableScroll() {
  document.body.style.overflow = 'hidden';
}

function enableScroll() {
  document.body.style.overflow = '';
}

function smoothScroll() {
  document.querySelector('.viewport').classList.add('SmoothScroll');

  new SmoothScroll({
    target: document.querySelector('.container'),
    scrollEase: 0.08,
    maxOffset: 500,
  });
}

function endLoading(delay = 0) {
  setTimeout(() => {
    loadingEl.classList.add('animated');
  }, delay * 1000);

  setTimeout(() => {
    removeElement(loadingEl);
    enableScroll();
  }, delay * 1000 + 1500);
}

function initWindowSize() {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
}

function showMenu(e) {
  e.preventDefault();
  menuEl.classList.remove('hide');
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

function playAudio(audio, volume = 1) {
  audio.currentTime = 0;
  audio.volume = volume;
  audio.play();
}