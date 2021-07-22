'use strict'

const isTouchDevice = 'ontouchstart' in document.documentElement;
const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const loadingEl = document.querySelector('.loading');
const viewportEl = document.querySelector('.viewport');
const containerEl = viewportEl.querySelector('.container');
const contentEl = containerEl.querySelector('.markdown-html');
const menuEl = document.querySelector('.menu');
const pageAudio = new Audio('/public/assets/audio/page.mp3');

document.onselectstart = () => false;
document.ondragstart = () => false;
document.oncontextmenu = () => false;
disableScroll();

window.onscroll = () => hideEl(menuEl);

window.onload = async() => {
  const markdownUrl = getMarkdownUrl();
  await renderContent(markdownUrl);

  if (!isTouchDevice) {
    const aEls = document.querySelectorAll('a');
    activateHoverInteraction(aEls);
    smoothScroll();
  }

  // Test loading finish when page onload
  // await new Promise(resolve => {
  //   setTimeout(resolve, 10000)
  // });
  await endLoading();
  enableScroll();
  resizeBodyHeight();
};

window.onresize = () => {
  hideEl(menuEl);
  resizeBodyHeight();
};

containerEl.onmousedown = e => {
  if (e.which === 1) appendCircle(e, containerEl);
};

document.oncontextmenu = e => {
  if (e.target.hasAttribute('href')) return false;
  showMenu(e);
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

//////////////////////////////////////////////////////////////////
///////////////////////  Functions  //////////////////////////////
//////////////////////////////////////////////////////////////////

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
  viewportEl.classList.add('SmoothScroll');

  new SmoothScroll({
    target: containerEl,
    scrollEase: 0.08,
    maxOffset: 500,
  });
}

function activateHoverInteraction(els) {
  contentEl.classList.add('hover-interaction');
}

function getMarkdownUrl() {
  const title = document.title;
  if (title === 'Ray Chang Space') return 'https://raw.githubusercontent.com/rayc2045/raychang-space/master/README.md';
  if (title === 'Draggable To-do List') return 'https://raw.githubusercontent.com/rayc2045/draggable-todoList/master/README.md';
  return `https://raw.githubusercontent.com/rayc2045/${title.toLocaleLowerCase().replaceAll(' ', '-')}/master/README.md`;
}

async function renderContent(url) {
  const res = await fetch(url);
  const text = await res.text();
  const md = window.markdownit();

  contentEl.innerHTML = md.render(text)
    .replaceAll(`&lt;!-- `, '<div style="display:none;"')
    .replaceAll(` --&gt;`, '</div>');

  document.querySelectorAll('.markdown-html a').forEach(a => {
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
  });
}

function resizeBodyHeight() {
  document.body.style.height = viewportEl.scrollHeight + 'px';
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

function playAudio(audio, volume = 1) {
  audio.currentTime = 0;
  audio.volume = volume;
  audio.play();
}