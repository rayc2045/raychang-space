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

async function renderPage() {
  let currentUrl = window.location.href;
  const path = window.location.pathname;
  const paramsObj = getParamsByUrl(currentUrl); // about/?md=about&highlight=false

  if (paramsObj.repo) return await renderGithubPage(paramsObj);
  if (paramsObj.md) return await renderMarkdownPage(path, paramsObj);

  const lastCharacterOfCurrentUrl = currentUrl.split('').reverse().join('')[0];
  if (lastCharacterOfCurrentUrl !== '/') currentUrl += '/';

  const splitPathArray = path.split('/');
  const currentFolder = splitPathArray[splitPathArray.length - 2];

  await renderMarkdownPage(path, {
    md: currentFolder,
    highlight: currentFolder === 'about' ? 'false' : 'true'
  });
}

async function renderGithubPage(paramsObj) {
  let { repo, author, branch, path, md, align } = paramsObj;

  author = author || 'rayc2045';
  branch = branch || 'master';
  path = path || '';
  md = md || 'README';
  align = align || 'justify';

  const markdownFile = `https://raw.githubusercontent.com/${author}/${repo}/${branch}${path}/${md}.md`;
  await renderContent(markdownFile, align);
  const title = contentEl.querySelector('h1').textContent;
  updateSiteTitle(title);
  appendGithubLink(title, author, repo);
}

async function renderMarkdownPage(path, paramsObj) {
  let { md, align, highlight } = paramsObj;

  if (md) md = md.replaceAll('/', '');
  align = align || 'justify';
  highlight = highlight || 'true';

  await renderContent(`${path}${md}.md`, align, highlight);
  if (md === 'about') return;
  const title = contentEl.querySelector('h1').textContent;
  updateSiteTitle(title);
}

async function renderContent(markdownFile, align = 'justify', highlight = 'true') {
  const markdownit = window.markdownit();
  const markdownText = await getMarkdownText(markdownFile);

  contentEl.innerHTML = markdownit.render(markdownText)
    .replaceAll('&lt;!-- ', '<div style="display:none;"') // Hide comment
    .replaceAll(' --&gt;', '</div>')
    .replaceAll('[ ]', '<span class="checkbox">☐</span>') // Checkbox
    .replaceAll('[x]', '<span class="checkbox check">☑︎</span>');
  
  // highlight.js
  if (highlight === 'true') hljs.highlightAll();

  contentEl.querySelectorAll('p').forEach(p => p.classList.add(align));
  contentEl.querySelectorAll('a').forEach(a => {
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
  });

  // Optimize image style
  contentEl.querySelectorAll('img').forEach(img => {
    const { s, width, align, c } = getParamsByUrl(img.src);
    const magnification = 1.5;
    if (s) img.src = img.src.replace(`?s=${s}`, `?s=${s * magnification}`);
    if (width) img.style.width = width * magnification + 'px';
    if (align) img.closest('p').className = align; // replace <p> original class
    if (c) img.classList.add(c);
  });
}

// Get query string
function getParamsByUrl(url) {
  const urlSearch = url.split('?')[1];
  const urlSearchParams = new URLSearchParams(urlSearch);
  return Object.fromEntries(urlSearchParams.entries());
}

async function getMarkdownText(markdownFile) {
  const res = await fetch(markdownFile);
  if (res.ok) return await res.text();
  redirectToNotFound();
}

function redirectToNotFound() {
  window.location = '/404';
}

function updateSiteTitle(headerText) {
  if (headerText) document.title = headerText;
}

function appendGithubLink(headerText, author, repo) {
  contentEl.querySelectorAll('a').forEach(a => {
    const aText = a.textContent;
    if (
      aText[0] + aText[1] === '> ' &&
      headerText.includes(aText.replace('> ', ''))
    ) {
      a.parentElement.innerHTML = a.parentElement.innerHTML + ` / <a href="https://github.com/${author}/${repo}" target="_blank" rel="noreferrer noopener">Github Repo</a>`;
    }
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