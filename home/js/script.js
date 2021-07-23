'use strict';

const loadingEl = document.querySelector('.loading');
const loadingAnimationEl = loadingEl.querySelector('.loading-animation');

const viewportEl = document.querySelector('.viewport');
const containerEl = viewportEl.querySelector('.container');
const dateEl = containerEl.querySelector('.date');
const contactButton = containerEl.querySelector('.contact');
const worksEl = containerEl.querySelector('.works');
const contactEl = document.querySelector('#contact');
const sayHelloEl = contactEl.querySelector('.say-hello');
const formEl = sayHelloEl.querySelector('form');
const inputEls = formEl.querySelectorAll('input');
const textareaEls = formEl.querySelectorAll('textarea');
const inputNameEl = formEl.querySelector('.input-name');
const inputCompanyEl = formEl.querySelector('.input-company');
const inputEmailEl = formEl.querySelector('.input-email');
const inputSubjectEl = formEl.querySelector('.input-subject');
const titleMessageEl = formEl.querySelector('.title-message');
const textareaMessageEl = formEl.querySelector('.textarea-message');
const sendButton = formEl.querySelector('.send');
const appreciationEl = contactEl.querySelector('.appreciation');
const footerEl = containerEl.querySelector('footer');
const toTopButton = footerEl.querySelector('.to-top');

const isTouchDevice = 'ontouchstart' in document.documentElement;
const isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

let bodyWidth = 0;
let screenScale = 0;
let time = new Date();
let isValidated = false;

// https://raw.githubusercontent.com/rayc2045/raychang-space/master/public/assets/audio/type.mp3
const pagingSound = new Audio('/public/assets/audio/page.mp3');
const typingSound = new Audio('/public/assets/audio/type.mp3');

//////////////////////////////////////////////////////////////////
/////////////////////////  Events  ///////////////////////////////
//////////////////////////////////////////////////////////////////

document.onselectstart = () => false;
document.ondragstart = () => false;
document.oncontextmenu = () => false;
disableScroll();
updateDate();
setTimeoutToCheckDateEveryMinute();

window.onload = async() => {
  initBodyParams();
  await updateWorks();
  const workEls = worksEl.querySelectorAll('.work');
  scrollToggleClass(workEls, 'color');

  if (!isTouchDevice) {
    activateHoverInteraction([worksEl, footerEl]);
    worksEl.querySelectorAll('.work').forEach(workEl => {
      workEl.onmouseenter = () => workEls.forEach(el => toggleGrayscale(el));
      workEl.onmouseout = () => workEls.forEach(el => el.classList.remove('grayscale'));
    });
    parallax();
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

window.onscroll = () => {
  if (!sayHelloEl.classList.contains('hide')) return;
  if (!isVisible(appreciationEl)) putPackForm();
};

window.onresize = () => {
  if (!isTouchDevice) resetParallax();
  initBodyParams();
  const workEls = worksEl.querySelectorAll('.work');
  scrollToggleClass(workEls, 'color');
};

document.onfullscreenchange = () => initBodyParams();

document.onmouseup = e => {
  if (e.target.hasAttribute('href')) {
    playAudio(pagingSound);
    if (e.which === 3) window.open(e.target.href, '_blank');
  }
};

containerEl.onmousedown = e => {
  appendCircle(e, containerEl);
};

contactButton.onmouseup = () => {
  playAudio(pagingSound);
  window.scrollTo(0, contactEl.getBoundingClientRect().top);
};

toTopButton.onmouseup = () => {
  playAudio(pagingSound);
  window.scrollTo(0, 0);
};

formEl.onkeydown = e => {
  // console.log(e.target.value);
  setTimeout(() => (e.target.value = getCleanText(e.target.value)));
  if (e.target.classList.contains('input-email'))
    setTimeout(() => (e.target.value = getTextWithoutWhiteSpace(e.target.value)));
  playAudio(typingSound, 0.65);
};

textareaEls.forEach(el => {
  el.oninput = e => {autoExpand(e.target); resizeBodyHeight();};
  el.onkeyup = e => {autoExpand(e.target); resizeBodyHeight();};
  el.oncut = e => {autoExpand(e.target); resizeBodyHeight();};
  el.onpaste = e => {autoExpand(e.target); resizeBodyHeight();};
  el.onchange = e => {autoExpand(e.target); resizeBodyHeight();};
});

sendButton.onclick = e => {
  submitForm(e);
  resizeBodyHeight();
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

function updateDate() {
  dateEl.textContent = getFormatDate(time);
}

function getFormatDate(time) {
  // January 1, 2021
  return `${convertToMonth(time.getMonth() + 1)} ${time.getDate()}, ${time.getFullYear()}`;
}

function convertToMonth(num) {
  return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][num - 1];
}

function setTimeoutToCheckDateEveryMinute() {
  setTimeout(checkDateEveryMinute, (60 - time.getSeconds()) * 1000);
}

function checkDateEveryMinute() {
  const newTime = new Date();

  if (time.getDate() !== newTime.getDate()) {
    time = newTime;
    updateDate();
  }

  setTimeout(checkDateEveryMinute, (60 - newTime.getSeconds()) * 1000);
}

async function updateWorks() {
  const works = await loadData('/public/data/works.json');

  works.forEach((work, idx) => {
    let contentHTML = `
      <li class="work">
        <a href="${work.link}" target="_blank" rel="noreferrer noopener">
          <picture>
            <source srcset="${`/public/assets/img/webp/${work.title.replaceAll(' ', '_')}.webp`}" type="image/webp">
            <source srcset="${`/public/assets/img/original/${work.title.replaceAll(' ', '_')}.png`}" type="image/png"> 
            <img src="${`/public/assets/img/original/${work.title.replaceAll(' ', '_')}.png`}" alt="${work.title}" loading="lazy">
          </picture>
        </a>
        <section>
          <div class="number">${formatNumber(works.length - idx)}</div>
          <div class="title">${work.title}</div>
          <div class="subtitle">${work.subtitle}${work.repo
            ? ` (<a class="info" href="${`/projects/query?repo=${work.repo}${work.align ? '&align=justify' : ''}`}">info</a>)`
            : ''}
          </div>
        </section>
      </li>
    `

    if (window.location.href.includes('localhost:'))
      contentHTML = contentHTML.replaceAll('query?', 'query.html?')

    worksEl.innerHTML += contentHTML;
  });
}

async function loadData(api) {
  const res = await fetch(api);
  return await res.json();
}

function formatNumber(num) {
  // 01, 02, 03 ..., 10
  return num < 10 ? '0' + num : '' + num;
}

function scrollToggleClass(els, className) {
  els.forEach((el, idx) => {
    // gsap.to(el, { autoAlpha: 1 });

    ScrollTrigger.create({
      trigger: el,
      id: idx + 1,
      start: 'top center',
      end: () => `+=${el.clientHeight}`,
      toggleAction: 'play reverse none reverse',
      toggleClass: {
        targets: el,
        className
      },
      // markers: true
    })

    // if (isVisible(el)) return el.classList.add(className);
    // el.classList.remove(className);
  })
}

function toggleGrayscale(el) {
  if (el.classList.contains('color')) return el.classList.add('grayscale');
  el.classList.remove('grayscale');
}

function activateHoverInteraction(els) {
  els.forEach(el => el.classList.add('hover-interaction'));
}

// function antiMouseMove(e, el, max = 20) {
//   const x = e.clientX;
//   const y = e.clientY;
//   // console.log(x);
//   const winWidth = window.innerWidth;
//   const winHeight = window.innerHeight;
//   const halfWidth = winWidth / 2;
//   const halfHeight = winHeight / 2;
//   const rx = x - halfWidth;
//   const ry = y - halfHeight;

//   const dx = el.getBoundingClientRect().width / max * (rx / -halfWidth);
//   const dy = el.getBoundingClientRect().height / max * (ry / -halfHeight);

//   el.style['transform'] = el.style['-webkit-transform'] = `translate(${dx}px, ${dy}px)`;
// }

function parallax() {
  // Based on 16:10 fullscreen (MacBook)
  gsapWithScrollTrigger('.circle-yellow', { y: 1200 * screenScale });
  gsapWithScrollTrigger('.circle-red', { y: 2400 * screenScale });
  gsapWithScrollTrigger('.article-left', { y: 200 * screenScale });
  gsapWithScrollTrigger('.article-right', { y: 200 * screenScale });
  gsapWithScrollTrigger('.name', { y: -500 * screenScale });
}

function resetParallax() {
  initBodyParams();
  ScrollTrigger.getAll().forEach(el => el.kill()); // Reset parallax
  parallax();
}

function gsapWithScrollTrigger(className, animation, scrub = 1) {
  ScrollTrigger.create({
    animation: gsap.to(className, animation),
    scrub,
  });
}

function smoothScroll() {
  viewportEl.classList.add('SmoothScroll');

  new SmoothScroll({
    target: containerEl,
    scrollEase: 0.08,
    maxOffset: 500,
  });
}

function appendCircle(e, el, duration = 1.5) {
  const circle = document.createElement('div');
  circle.classList.add('circle');

  const circleOffset = 0.25 * document.body.getBoundingClientRect().width;
  let customCursorOffset = -(0.004 * document.body.getBoundingClientRect().width);
  if (isTouchDevice) customCursorOffset = 0;
  circle.style.left = `${e.pageX - circleOffset - customCursorOffset}px`;
  circle.style.top = `${e.pageY - circleOffset - customCursorOffset}px`;
  circle.style.animationDuration = `${duration}s`;

  el.appendChild(circle);
  setTimeout(() => removeElement(circle), duration * 1000);
}

function getCleanText(text) {
  if (text.length === 1) return text.toString().replace(' ', '');
  return text.toString().replace(/  /g, ' ').replace(/%3C/gi, '').replace(/(<([^>]+)>)/gi, ''); // remove tags
}

function getTextWithoutWhiteSpace(text) {
  return text.toString().replace(/ /g, '');
}

// function formatName(str) {
//   return str.replace(/\b\w/g, c => c.toUpperCase());
// 	// return str.split(' ').map(word => this.formatSubject(word)).join(' ');
// }

// function formatEmail(str) {
//   return str.length === 1
//     ? str.replace(/[^a-zA-Z0-9]+/g, '')
//     : str.replace(/[^a-zA-Z0-9@.]+/g, '');
// }

// function formatSubject(str) {
//   return str.charAt(0).toUpperCase() + str.slice(1);
// }

// function formatParagraph(str) {
//   return str.replace(/(?<=(?:^|[.?!])\W*)[a-z]/g, i => i.toUpperCase());
// }

function autoExpand(el) {
  // console.log(el.scrollHeight);
  const offset = el.offsetHeight - el.clientHeight;
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + offset + 'px';
}

function submitForm(e) {
  e.preventDefault();
  isValidated = true;
  checkForm();
  if (!isValidated) return false;
  emptyForm();
  hideForm();

  setTimeout(() => {
    const receiver = 'rayc2045@gmail.com';
    window.open(`mailto:${receiver}?subject=${inputSubjectEl.value}&body=${textareaMessageEl.value}`, '_top');
  }, 800);
}

function checkForm() {
  inputEmailEl.value = inputEmailEl.value.replace(/ /g, '');
  [
    inputNameEl,
    inputCompanyEl,
    inputEmailEl,
    inputSubjectEl,
    textareaMessageEl,
  ].map(el => (el.value = el.value.trim()));

  const emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!inputNameEl.value) {
    isValidated = false;
    alertAnimate(inputNameEl.parentNode);
  }
  if (!inputEmailEl.value.match(emailFormat)) {
    isValidated = false;
    alertAnimate(inputEmailEl.parentNode);
  }
  if (!inputSubjectEl.value) {
    isValidated = false;
    alertAnimate(inputSubjectEl.parentNode);
  }
  if (!textareaMessageEl.value) {
    isValidated = false;
    alertAnimate(titleMessageEl);
    alertAnimate(textareaMessageEl.parentNode);
  }
}

function alertAnimate(el) {
  if (el.classList.contains('alert')) return;
  el.classList.add('alert');
  setTimeout(() => el.classList.remove('alert'), 1000);
}

function emptyForm() {
  inputEls.forEach(el => el.value = '');
  textareaEls.forEach(el => {
    el.value = '';
    el.style.height = 'auto';
  });
}

function hideForm() {
  sayHelloEl.classList.add('hide');
  appreciationEl.classList.remove('hide');
}

function putPackForm() {
  sayHelloEl.classList.remove('hide');
  appreciationEl.classList.add('hide');
}

function isVisible(el) {
  // https://usefulangle.com/post/113/javascript-detecting-element-visible-during-scroll
  const elTop = ~-el.getBoundingClientRect().top;
  const elBottom = ~-el.getBoundingClientRect().bottom;
  return elTop < window.innerHeight && elBottom >= 0;
}

// function isFullyVisible(el) {
// 	const elTop = ~(-el.getBoundingClientRect().top);
// 	const elBottom = ~(-el.getBoundingClientRect().bottom);
// 	return (elTop >= 0 && elBottom <= window.innerHeight);
// }

function removeElement(el) {
  el.parentNode.removeChild(el);
}

function playAudio(audio, volume = 1) {
  audio.currentTime = 0;
  audio.volume = volume;
  audio.play();
}

function initBodyParams() {
  document.body.style.height = viewportEl.scrollHeight + 'px';
  bodyWidth = document.body.getBoundingClientRect().width;
  screenScale = bodyWidth / 1280;
}

function resizeBodyHeight() {
  document.body.style.height = viewportEl.scrollHeight + 'px';
}