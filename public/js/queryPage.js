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
  await renderPage();

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

function redirectToNotFound() {
  window.location = '/404';
}

async function renderPage() {
  // /projects/query?repo=raychang-space&align=justify
  // /projects/query.html?repo=raychang-space&align=justify
  // /projects/query/?repo=raychang-space&align=justify
  const currentUrl = window.location.href;
  let { repo, author, branch, path, md, align } = getParamsByUrl(currentUrl);
  if (!repo) return redirectToNotFound();

  // Init query params
  author = author || 'rayc2045';
  branch = branch || 'master';
  path = path || '';
  md = md || 'README';
  align = align || 'left';
  // console.log({ repo, author, branch, path, md, align });

  const markdownLink = `https://raw.githubusercontent.com/${author}/${repo}/${branch}${path}/${md}.md`;
  const markdownText = await getMarkdownText(markdownLink);
  const splitMdTextArray = markdownText.split('/');

  if (
    markdownText === '404: Not Found' ||
    splitMdTextArray[splitMdTextArray.length - 1] === `${md}.md`
  )
    return redirectToNotFound();

  renderContent(markdownText, align);
  document.title = document.querySelector('h1').textContent;
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

function renderContent(markdownText, align) {
  const markdownit = window.markdownit();

  contentEl.innerHTML = markdownit.render(markdownText)
    .replaceAll(`&lt;!-- `, '<div style="display:none;"')
    .replaceAll(` --&gt;`, '</div>');

  contentEl.querySelectorAll('a').forEach(a => {
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
  });

  contentEl.querySelectorAll('img').forEach(img => {
    const size = getParamsByUrl(img.src).s;
    if (size) {
      // img.src = img.src.replace(`?s=${size}`, `?s=${size * 1.45}`);
      img.style = `width: ${size * 1.45}px;`;
    }
  });

  // highlight.js
  hljs.highlightAll();

  if (align === 'justify')
    contentEl.querySelectorAll('p').forEach(p => p.style = 'text-align: justify');
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