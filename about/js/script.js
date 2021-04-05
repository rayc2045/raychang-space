'use strict'

const isTouchDevice = 'ontouchstart' in document.documentElement;
const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const tipEl = document.querySelector('.tip');
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
const menuEl = document.querySelector('.menu');
const pageAudio = new Audio('https://raw.githubusercontent.com/rayc2045/raychang-space/master/audio/page.mp3')

document.onselectstart = () => false;
document.ondragstart = () => false;
document.oncontextmenu = () => false;
document.body.style.overflow = 'hidden';
window.onscroll = () => hideMenu();

window.onresize = () => {
  hideMenu();
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
};

window.onload = () => {
  if (!isTouchDevice) tipEl.textContent = '※點擊右鍵呼叫選單';

  setTimeout(() => {
    document.body.removeAttribute('style');
    document.oncontextmenu = e => {
      hideTip();
      showMenu(e);
    };
    if (!isTouchDevice) smoothScroll();
  }, 1800);
};

document.onmousedown = e => {
  if (!e.target.hasAttribute('href')) hideMenu();
};

document.onmouseup = e => {
  if (e.target.hasAttribute('href')) {
    playAudio(pageAudio);
    hideMenu();
  }
};

function convertToAnchor(str) {
  return str
    .replace(/(<([^>]+)>)/gi, '')
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>');
}

function smoothScroll() {
  document.querySelector('.viewport').classList.add('SmoothScroll');

  new SmoothScroll({
    target: document.querySelector('.container'),
    scrollEase: 0.08,
    maxOffset: 500,
  });
}

function hideTip() {
  tipEl.classList.add('hide');
}

function showMenu(e) {
  e.preventDefault();
  menuEl.classList.add('show');
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

function hideMenu() {
  menuEl.classList.remove('show');
}

function playAudio(audio, volume = 1) {
  audio.currentTime = 0;
  audio.volume = volume;
  audio.play();
}