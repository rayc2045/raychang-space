'use strict';

const worksData = [
  {
    title: 'Horizontal Scrolling Theater',
    subtitle: 'Enjoy the online movie shopping',
    cover: '../img/webp/horizontal_scrolling_theater.webp',
    // video: '../video/webm/horizontal_scrolling_theater.webm',
    info: 'https://github.com/rayc2045/horizontal-scrolling-theater/blob/master/README.md#horizontal-scrolling-theater-with-vuejs',
    link: 'https://vuejs-theater.netlify.app/',
  },
  {
    title: 'Ghibli Crawler',
    subtitle: 'Automatically download 1,178 studio Ghibli\'s work photos',
    cover: '../img/webp/puppeteer_logo_transparent.webp',
    info: 'https://github.com/rayc2045/ghibli-crawler/blob/main/README.md#ghibli-crawler',
    link: 'https://github.com/rayc2045/ghibli-crawler/blob/main/README.md#ghibli-crawler',
  },
  {
    title: 'Ghibli Gallery',
    subtitle: 'Remaster studio Ghibli\'s work album with Vue 3.0',
    cover: '../img/webp/ghibli_gallery_app.webp',
    info: 'https://github.com/rayc2045/ghibli-gallery/blob/main/README.md#ghibli-gallery---%E3%82%B9%E3%82%BF%E3%82%B8%E3%82%AA%E3%82%B8%E3%83%96%E3%83%AA%E4%BD%9C%E5%93%81%E3%81%AE%E5%A0%B4%E9%9D%A2%E5%86%99%E7%9C%9F',
    link: 'https://rayc2045.github.io/ghibli-gallery/',
  },
  {
    title: 'Block Memory Game',
    subtitle: 'How many levels can you accomplish?',
    cover: '../img/webp/block_memory_game.webp',
    // video: '../video/webm/block_memory_game.webm',
    info: 'https://github.com/rayc2045/block-memory-game/blob/main/README.md#block-memory-game',
    link: 'https://rayc2045.github.io/block-memory-game/',
  },
  {
    title: 'Vanilla Calculator',
    subtitle: 'Elegantly shows the result immediately',
    cover: '../img/webp/vanilla_calculator.webp',
    // video: '../video/webm/vanilla_calculator.webm',
    info: 'https://github.com/rayc2045/vanilla-calculator/blob/master/README.md#vanilla-calculator',
    link: 'https://rayc2045.github.io/vanilla-calculator/',
  },
  {
    title: 'Draggable To-do List',
    subtitle: 'Featured by autosave and markdown support',
    cover: '../img/webp/draggable_todo_list.webp',
    // video: '../video/webm/draggable_todo_list.webm',
    info: 'https://github.com/rayc2045/draggable-todoList/blob/master/README.md#draggable-to-do-list',
    link: 'https://rayc2045.github.io/draggable-todoList/',
  },
  // {
  //   title: 'Codewars Challenge',
  //   subtitle: 'Join the journey of achieving code mastery',
  //   cover: '../img/webp/codewars.webp',
  //   info: 'https://github.com/rayc2045/codewars-challenge',
  //   link: 'https://github.com/rayc2045/codewars-challenge',
  // },
  {
    title: 'Dribbble Works',
    subtitle: 'See my design works on Dribbble',
    cover: '../img/webp/road_to_dribbble.webp',
    link: 'https://dribbble.com/raychangdesign',
  },
  {
    title: 'Medium Blog',
    subtitle: 'Read my latest technical article',
    cover: '../img/webp/medium_membership.webp',
    link: 'https://raychangdesign.medium.com/',
  },
];

class Portfolio {
  constructor() {
    this.backgroundMusicEl = document.querySelector('.background-music');
    this.pagingSound = new Audio('https://raw.githubusercontent.com/rayc2045/raychang-space/master/audio/page.mp3');
    this.typingSound = new Audio('https://raw.githubusercontent.com/rayc2045/raychang-space/master/audio/type.mp3');
    this.loadingEl = document.querySelector('.loading');
    this.fullScreenQuestionSection = this.loadingEl.querySelector('.question-section');
    this.fullScreenYesButton = this.fullScreenQuestionSection.querySelector('.button-yes');
    this.fullScreenNoButton = this.fullScreenQuestionSection.querySelector('.button-no');
    this.loadingAnimationEl = this.loadingEl.querySelector('.loading-animation');
    this.viewportEl = document.querySelector('.viewport');
    this.containerEl = document.querySelector('.container');
    this.contactButton = document.querySelector('.contact');
    this.contactEl = document.querySelector('#contact');
    this.toTopButton = document.querySelector('.to-top');
    this.dateEl = document.querySelector('.date');
    this.worksEl = document.querySelector('.works');
    this.formEl = document.querySelector('form');
    this.inputEls = document.querySelectorAll('input');
    this.textareaEls = document.querySelectorAll('textarea');
    this.inputNameEl = document.querySelector('.input-name');
    this.inputCompanyEl = document.querySelector('.input-company');
    this.inputEmailEl = document.querySelector('.input-email');
    this.inputSubjectEl = document.querySelector('.input-subject');
    this.titleMessageEl = document.querySelector('.title-message');
    this.textareaMessageEl = document.querySelector('.textarea-message');
    this.sendButton = document.querySelector('.send');
    this.contactAvatar = document.querySelector('#contact picture');
    this.sayHelloEl = document.querySelector('.say-hello');
    this.appreciationEl = document.querySelector('.appreciation');
    this.footerEl = document.querySelector('footer');
    this.time = new Date();
    this.works = worksData;
    this.isTouchDevice = 'ontouchstart' in document.documentElement;
    this.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    this.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    this.isFullScreenAnswered = false;
    this.bodyWidth = document.body.getBoundingClientRect().width;
    this.screenScale = this.bodyWidth / 1280;
    this.isValidated = false;
    this.events();
  }

  events() {
    this.preventScroll();
    this.updateDate();

    setTimeout(
      () => this.checkDateEveryMinute(),
      (60 - this.time.getSeconds()) * 1000
    );

    this.updateWorks();
    this.scrollToggleClass([...this.worksEl.childNodes], 'color');

    if (!this.isTouchDevice) {
      // document.onmousemove = e => this.antiMouseMove(e, this.nameEl, 80);
      this.activateHoverInteraction([
        this.fullScreenQuestionSection,
        this.worksEl,
        this.footerEl
      ]);

      [...this.worksEl.childNodes].forEach(el => {
        // Combine scroll and hover interactions
        [...el.childNodes][1].onmouseenter = () => [...this.worksEl.childNodes].forEach(el => this.toggleGrayscale(el));
        [...el.childNodes][1].onmouseout = () => [...this.worksEl.childNodes].forEach(el => el.classList.remove('grayscale'));
      });

      this.parallax();
      this.smoothScroll();
    }

    this.containerEl.onmousedown = e => this.appendCircle(e, this.containerEl);

    this.contactButton.onmouseup = () => {
      this.playAudio(this.pagingSound);
      window.scrollTo(0, this.contactEl.getBoundingClientRect().top);
    };

    this.toTopButton.onmouseup = () => {
      this.playAudio(this.pagingSound);
      window.scrollTo(0, 0);
    };

    this.formEl.onkeydown = e => {
      // console.log(e.target.value);
      setTimeout(() => (e.target.value = this.cleanText(e.target.value)));
      if (e.target.classList.contains('input-email'))
      	setTimeout(() => (e.target.value = this.textWithoutWhiteSpace(e.target.value)));
      this.playAudio(this.typingSound, 0.65);
    };

    [...this.textareaEls].forEach(el => {
      el.oninput = e => {this.autoExpand(e); this.resizeBodyHeight();};
      el.onkeyup = e => {this.autoExpand(e); this.resizeBodyHeight();};
      el.oncut = e => {this.autoExpand(e); this.resizeBodyHeight();};
      el.onpaste = e => {this.autoExpand(e); this.resizeBodyHeight();};
      el.onchange = e => {this.autoExpand(e); this.resizeBodyHeight();};
    });

    this.sendButton.onclick = e => {
      this.submitForm(e);
      this.resizeBodyHeight();
    };
  }

  askFullScreen() {
    this.loadingAnimationEl.classList.add('hide');
    this.fullScreenQuestionSection.classList.remove('hide');

    // Answer "Yes"
    this.fullScreenYesButton.onclick = () => {
      this.endFullScreenQuestion();
      this.fullScreen();

      setTimeout(() => {
        this.playAudio(this.backgroundMusicEl, 0.5);
        this.endLoading();
      }, 1000);
    };

    // Answer "No"
    this.fullScreenNoButton.onclick = () => {
      this.endFullScreenQuestion();
      this.playAudio(this.backgroundMusicEl, 0.5);
      this.endLoading();
    };
  }

  endFullScreenQuestion() {
    this.isFullScreenAnswered = true;
    this.fullScreenQuestionSection.classList.add('hide');
    this.loadingAnimationEl.classList.remove('hide');
  }

  fullScreen() {
    document.documentElement.requestFullscreen();
  }

  endLoading(delay = 0) {
    setTimeout(() => {
      this.loadingEl.classList.add('animated');
    }, delay * 1000);

    setTimeout(() => {
      this.removeElement(this.loadingEl);
      // this.loadingEl.classList.add('hide');
      // this.loadingEl.classList.remove('animated');
      this.enableScroll();
    }, delay * 1000 + 1500);
  }

  playAudio(audio, volume = 1) {
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play();
  }

  appendCircle(e, element, duration = 1.5) {
    const circle = document.createElement('div');
    circle.classList.add('circle');

    const circleOffset = 0.25 * document.body.getBoundingClientRect().width;
    let customCursorOffset = -(0.004 * document.body.getBoundingClientRect().width);
    if (this.isTouchDevice) customCursorOffset = 0;
    circle.style.left = `${e.pageX - circleOffset - customCursorOffset}px`;
    circle.style.top = `${e.pageY - circleOffset - customCursorOffset}px`;
    circle.style.animationDuration = `${duration}s`;

    element.appendChild(circle);
    setTimeout(() => this.removeElement(circle), duration * 1000);
  }

  removeElement(el) {
    el.parentNode.removeChild(el);
  }

  preventScroll() {
    document.body.style.overflow = 'hidden';
  }

  enableScroll() {
    document.body.style.overflow = '';
  }

  smoothScroll() {
    document.querySelector('.viewport').style.position = 'fixed';

    new SmoothScroll({
      target: this.containerEl,
      scrollEase: 0.08,
      maxOffset: 500,
    });
  }

  // locomotiveScroll() {
  // 	new LocomotiveScroll({
  // 		el: this.containerEl,
  // 		smooth: true,
  // 	});
  // }

  resetParallax() {
    // Reset parameter
    this.bodyWidth = document.body.getBoundingClientRect().width;
    this.screenScale = this.bodyWidth / 1280;

    // Reset parallax
    ScrollTrigger.getAll().forEach(el => el.kill());
    this.parallax();
  }

  parallax() {
    // Based on 16:10 fullscreen (MacBook)
    this.gsapWithScrollTrigger('.circle-yellow', { y: 1200 * this.screenScale });
    this.gsapWithScrollTrigger('.circle-red', { y: 2400 * this.screenScale });
    this.gsapWithScrollTrigger('.article-left', { y: 200 * this.screenScale });
    this.gsapWithScrollTrigger('.article-right', { y: 200 * this.screenScale });
    this.gsapWithScrollTrigger('.name', { y: -500 * this.screenScale });
  }

  gsapWithScrollTrigger(className, animation, scrub = 1) {
    ScrollTrigger.create({
      animation: gsap.to(className, animation),
      scrub,
    });
  }

  // rellaxJS() {
  // 	this.parallaxElementSet(this.circleYellowEl, '-3');
  // 	this.parallaxElementSet(this.circleOrangeEl, '-6');
  // 	this.parallaxElementSet(this.articleLeftEl, '-1.5');
  // 	this.parallaxElementSet(this.articleRightEl, '-1.5');
  // 	let rellax = new Rellax('.rellax');
  // }

  // rellaxElementSet(el, rellaxSpeed) {
  // 	el.classList.add('rellax');
  // 	el.setAttribute('data-rellax-speed', rellaxSpeed);
  // }

  checkDateEveryMinute() {
    const time = new Date();

    if (this.time.getDate() !== time.getDate()) {
      this.time = time;
      this.updateDate();
    }

    setTimeout(
      () => this.checkDateEveryMinute(),
      (60 - time.getSeconds()) * 1000
    );
  }

  updateDate() {
    this.dateEl.textContent = this.getFormatDate(this.time);
  }

  getFormatDate(time) {
    return `${this.convertNumToMonth(time.getMonth() + 1)} ${time.getDate()}, ${time.getFullYear()}`;
  }

  convertNumToMonth(num) {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][num - 1];
  }

  // antiMouseMove(e, el, max = 20) {
  // 	const x = e.clientX;
  // 	const y = e.clientY;
  // 	// console.log(x);
  // 	const winWidth = window.innerWidth;
  // 	const winHeight = window.innerHeight;
  // 	const halfWidth = winWidth / 2;
  // 	const halfHeight = winHeight / 2;
  // 	const rx = x - halfWidth;
  // 	const ry = y - halfHeight;

  // 	const dx = el.getBoundingClientRect().width / max * (rx / -halfWidth);
  // 	const dy = el.getBoundingClientRect().height / max * (ry / -halfHeight);

  // 	el.style['transform'] = el.style['-webkit-transform'] = `translate(${dx}px, ${dy}px)`;
  // }

  updateWorks() {
    for (const i in this.works) {
      const workEl = document.createElement('li');
      workEl.classList.add('work');
      workEl.innerHTML = this.getWorkElInnerHTML(i);
      this.worksEl.appendChild(workEl);
    }
  }

  getWorkElInnerHTML(idx) {
    return `
      <a href="${this.works[idx].link}" target="_blank" rel="noreferrer noopener">
        ${this.works[idx].video
          ?`<video autoplay loop muted playsinline>
              <source src="${this.works[idx].video}">
              <source src="${this.works[idx].video.replace(/webm/g, 'original').replace('.original', '.mov')}">
            </video>`
          :`<picture>
              <source srcset="${this.works[idx].cover}" type="image/webp">
              <source srcset="${this.works[idx].cover.replace(/webp/g, 'original').replace('.original', '.png')}" type="image/png"> 
              <img src="${this.works[idx].cover.replace(/webp/g, 'original').replace('.original', '.png')}" alt="${this.works[idx].title}" loading="lazy">
            </picture>`}_
      </a>
      <section>
        <div class="number">${this.addZeroToNumberUnderTen(this.works.length - idx)}</div>
        <div class="title">${this.works[idx].title}</div>
        <div class="subtitle">${this.works[idx].subtitle}${this.works[idx].info ? ` (<a class="info" href="${this.works[idx].info}" target="_blank" rel="noreferrer noopener">info</a>)` : ''}</div>
      </section>`;
  }

  addZeroToNumberUnderTen(num) {
    return num < 10 ? '0' + num : '' + num;
  }

  scrollToggleClass(els, className) {
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

      // if (this.isVisible(el)) return el.classList.add(className);
      // el.classList.remove(className);
    })
  }

  toggleGrayscale(el) {
    if (el.classList.contains('color')) return el.classList.add('grayscale');
    el.classList.remove('grayscale');
  }

  activateHoverInteraction(els) {
    els.forEach(el => el.classList.add('hover-interaction'));
  }

  cleanText(text) {
    return text.length === 1
      ? text.toString().replace(/ /g, '')
      : text
        .toString()
        .replace(/  /g, ' ')
        .replace(/%3C/gi, '')
        .replace(/(<([^>]+)>)/gi, ''); // remove tags
  }

  textWithoutWhiteSpace(str) {
    return str.replace(/ /g, '');
  }

  // formatName(str) {
  // 	return str.replace(/\b\w/g, c => c.toUpperCase());
  // 	// return str.split(' ').map(word => this.formatSubject(word)).join(' ');
  // }

  // formatEmail(str) {
  // 	return str.length === 1
  // 		? str.replace(/[^a-zA-Z0-9]+/g, '')
  // 		: str.replace(/[^a-zA-Z0-9@.]+/g, '');
  // }

  // formatSubject(str) {
  // 	return str.charAt(0).toUpperCase() + str.slice(1);
  // }

  // formatParagraph(str) {
  // 	return str.replace(/(?<=(?:^|[.?!])\W*)[a-z]/g, i => i.toUpperCase());
  // }

  autoExpand(e) {
    // console.log(e.target.scrollHeight);
    const offset = e.target.offsetHeight - e.target.clientHeight;
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + offset + 'px';
  }

  resizeBodyHeight() {
    document.body.style.height = this.viewportEl.scrollHeight + 'px';
  }

  submitForm(e) {
    e.preventDefault();
    this.isValidated = true;
    this.checkForm();
    if (!this.isValidated) return false;
    this.emptyForm();
    this.hideForm();

    setTimeout(() => {
      const receiver = 'rayc2045@gmail.com';
      window.open(`mailto:${receiver}?subject=${this.inputSubjectEl.value}&body=${this.textareaMessageEl.value}`, '_top');
    }, 800);
  }

  checkForm() {
    this.inputEmailEl.value = this.inputEmailEl.value.replace(/ /g, '');
    [
      this.inputNameEl,
      this.inputCompanyEl,
      this.inputEmailEl,
      this.inputSubjectEl,
      this.textareaMessageEl,
    ].map(el => (el.value = el.value.trim()));

    const emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!this.inputNameEl.value) {
      this.isValidated = false;
      this.alertAnimate(this.inputNameEl.parentNode);
    }
    if (!this.inputEmailEl.value.match(emailFormat)) {
      this.isValidated = false;
      this.alertAnimate(this.inputEmailEl.parentNode);
    }
    if (!this.inputSubjectEl.value) {
      this.isValidated = false;
      this.alertAnimate(this.inputSubjectEl.parentNode);
    }
    if (!this.textareaMessageEl.value) {
      this.isValidated = false;
      this.alertAnimate(this.titleMessageEl);
      this.alertAnimate(this.textareaMessageEl.parentNode);
    }
  }

  alertAnimate(el) {
    if (el.classList.contains('alert')) return;
    el.classList.add('alert');
    setTimeout(() => el.classList.remove('alert'), 1000);
  }

  emptyForm() {
    [...this.inputEls].forEach(el => el.value = '');
    [...this.textareaEls].forEach(el => {
      el.value = '';
      el.style.height = 'auto';
    });
  }

  hideForm() {
    this.sayHelloEl.classList.add('hide');
    this.appreciationEl.classList.remove('hide');
  }

  putPackForm() {
    if (!this.sayHelloEl.classList.contains('hide')) return;
    if (!this.isVisible(this.appreciationEl)) {
      this.sayHelloEl.classList.remove('hide');
      this.appreciationEl.classList.add('hide');
    }
  }

  isVisible(el) {
    const elTop = ~-el.getBoundingClientRect().top;
    const elBottom = ~-el.getBoundingClientRect().bottom;
    return elTop < window.innerHeight && elBottom >= 0;
    // https://usefulangle.com/post/113/javascript-detecting-element-visible-during-scroll
  }

  // isFullyVisible(el) {
  // 	const elTop = ~(-el.getBoundingClientRect().top);
  // 	const elBottom = ~(-el.getBoundingClientRect().bottom);
  // 	return (elTop >= 0 && elBottom <= window.innerHeight);
  // }
}

const portfolio = new Portfolio();

document.onselectstart = () => false;
document.ondragstart = () => false;
document.oncontextmenu = () => false;
document.onfullscreenchange = () => portfolio.resizeBodyHeight();
document.onmouseup = e => {
  if (e.target.hasAttribute('href')) {
    portfolio.playAudio(portfolio.pagingSound);
    if (e.which === 3) window.open(e.target.href, '_blank');
  }
};

window.onscroll = () => portfolio.putPackForm();
window.onload = () => {
  portfolio.resizeBodyHeight();
  if (!portfolio.isTouchDevice && (portfolio.isChrome || portfolio.isFirefox))
    return portfolio.askFullScreen();
  portfolio.endLoading(0.5);
};
window.onblur = () => {
  if (portfolio.isFullScreenAnswered) portfolio.backgroundMusicEl.pause();
}
window.onfocus = () => {
  if (portfolio.isFullScreenAnswered) portfolio.backgroundMusicEl.play();
}
window.onresize = () => {
  if (!portfolio.isTouchDevice) portfolio.resetParallax();
  portfolio.scrollToggleClass(portfolio.worksEl.childNodes, 'color');
  portfolio.resizeBodyHeight();
};