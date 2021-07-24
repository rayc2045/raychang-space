'use strict'

const loadingEl = document.querySelector('.loading');
const viewportEl = document.querySelector('.viewport');
const containerEl = viewportEl.querySelector('.container');
const contentEl = containerEl.querySelector('.markdown-html');
const menuEl = document.querySelector('.menu');
const isTouchDevice = 'ontouchstart' in document.documentElement;
const pageAudio = new Audio('/public/assets/audio/page.mp3');

document.onselectstart = () => false;
document.ondragstart = () => false;
document.oncontextmenu = () => false;
disableScroll();

window.onload = async() => {
  const markdownFile = '/about/rayc_resume.md';
  const markdownText = await getMarkdownText(markdownFile);
  await renderContent(markdownText);

  if (!isTouchDevice) {
    activateHoverInteraction([contentEl]);
    smoothScroll();
    // Test async/await
    // await new Promise(resolve => setTimeout(resolve, 10000));
    await endLoading(0.25);
  } else {
    await endLoading();
  }

  enableScroll();
  resizeBodyHeight();
};

window.onscroll = () => hideEl(menuEl);

window.onresize = () => {
  hideEl(menuEl);
  resizeBodyHeight();
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

containerEl.onmousedown = e => {
  if (e.which === 1) appendCircle(e, containerEl);
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

async function renderContent(markdownText) {
  const markdownit = window.markdownit();

  // Hide comment
  contentEl.innerHTML = markdownit.render(markdownText)
    .replaceAll(`&lt;!-- `, '<div style="display:none;"')
    .replaceAll(` --&gt;`, '</div>');

  // Set paragraph text align to justify
  contentEl.querySelectorAll('p').forEach(p => p.style = 'text-align: justify');

  // Set anchor open in blank
  contentEl.querySelectorAll('a').forEach(a => {
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
  });

  // Init img size and class
  contentEl.querySelectorAll('img').forEach(img => {
    const { s, c } = getParamsByUrl(img.src);
    const magnifyScale = 1.5;
    if (s) img.src = img.src.replace(`?s=${s}`, `?s=${s * magnifyScale}`);
    if (c) img.classList.add(c);
  });
}

// Get query string
function getParamsByUrl(url) {
  const urlSearch = url.split('?')[1];
  const urlSearchParams = new URLSearchParams(urlSearch);
  return Object.fromEntries(urlSearchParams.entries());
}

async function getMarkdownText(url) {
  const res = await fetch(url);
  return await res.text();
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