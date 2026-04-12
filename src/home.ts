interface Certificate {
  name: string;
}

interface GitHubUser {
  public_repos: number;
}

export function initApp(): void {
  initLoadingScreen();
  initDynamicText();
  initScrollAnimations();
  initMenu();
  initCertificates();
  initSmoothScroll();
  initAccordion();
  initScrollHandler();
  initFunFacts();
  initSkills();
  initPortfolioFilter();
  initPopup();
}

function initLoadingScreen(): void {
  setTimeout(() => {
    document.querySelector('.loading')?.classList.add('loaded');
  }, 1000);
}

function initDynamicText(): void {
  const experienceTime = Math.trunc(
    (10 * (+new Date() - +new Date('2016-01-01'))) / (86400 * 365 * 1000),
  ) / 10;
  const ageTime = Math.trunc(
    (+new Date() - +new Date('1994-11-10')) / (86400 * 365 * 1000),
  );
  const year = new Date().getFullYear();

  document.querySelectorAll('.exp').forEach((el) => {
    el.textContent = String(experienceTime);
  });
  document.querySelectorAll('.age').forEach((el) => {
    el.textContent = String(ageTime);
  });
  document.querySelectorAll('.year').forEach((el) => {
    el.textContent = String(year);
  });
}

// Replaces WOW.js — triggers animate.css classes on scroll via IntersectionObserver
function initScrollAnimations(): void {
  const wowElements = document.querySelectorAll<HTMLElement>('.wow');

  wowElements.forEach((el) => {
    el.style.visibility = 'hidden';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const duration = el.dataset.wowDuration;
          if (duration) {
            el.style.animationDuration = duration;
          }
          el.style.visibility = 'visible';
          el.classList.add('animated');
          observer.unobserve(el);
        }
      });
    },
    { rootMargin: '0px 0px -200px 0px' },
  );

  wowElements.forEach((el) => observer.observe(el));
}

function initMenu(): void {
  const menu = document.getElementById('menu');
  const sideMenu = document.getElementById('side-menu');

  menu?.addEventListener('click', () => {
    menu.classList.toggle('active-menu');
    sideMenu?.classList.toggle('active-side-menu');
    sideMenu
      ?.querySelectorAll('a')
      .forEach((a) => a.classList.remove('selected-item'));
  });

  sideMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      link.classList.add('selected-item');
      sideMenu.querySelectorAll('a').forEach((a) => {
        if (a !== link) a.classList.remove('selected-item');
      });
      menu?.classList.toggle('active-menu');
      sideMenu.classList.toggle('active-side-menu');
    });
  });
}

// Replaces Owl Carousel with CSS scroll-snap carousel
async function initCertificates(): Promise<void> {
  const githubCertsUrl =
    'https://api.github.com/repos/ftuyama/ftuyama.github.io/contents/public/certificates';
  const localCertsUrl = '/public/cache/certificates.json';
  const certsUrl =
    location.hostname === 'localhost' ? localCertsUrl : githubCertsUrl;

  try {
    const res = await fetch(certsUrl);
    const certificates: Certificate[] = await res.json();
    const container = document.getElementById('certificates');
    if (!container) return;

    const track = document.createElement('div');
    track.className = 'carousel-track';

    for (const cert of certificates) {
      const certificateUrl = `https://ftuyama.github.io/public/certificates/${cert.name}`;
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.innerHTML = `
        <embed src="${certificateUrl}#toolbar=0&navpanes=0&scrollbar=0" width="480" height="360" loading="lazy">
        <div class="certificate-link-wrapper">
          <a target="_blank" class="certificate-link" href="${certificateUrl}">
            ${cert.name.replace('.pdf', '')}
          </a>
        </div>
      `;
      track.appendChild(slide);
    }

    container.appendChild(track);

    let scrollPos = 0;
    setInterval(() => {
      const slideWidth =
        track.querySelector('.carousel-slide')?.clientWidth ?? 500;
      scrollPos += slideWidth + 10;
      if (scrollPos >= track.scrollWidth - track.clientWidth) {
        scrollPos = 0;
        track.scrollTo({ left: 0 });
        return;
      }
      track.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }, 2000);
  } catch {
    /* certificates unavailable */
  }
}

function initSmoothScroll(): void {
  document.getElementById('mouse')?.addEventListener('click', () => {
    document.getElementById('about-me')?.scrollIntoView({ behavior: 'smooth' });
  });

  document
    .querySelectorAll<HTMLAnchorElement>("a[href^='#']")
    .forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
}

function initAccordion(): void {
  const activeContent = document.querySelector(
    '.acc-title.active + .acc-content',
  ) as HTMLElement | null;
  if (activeContent) {
    activeContent.style.maxHeight = activeContent.scrollHeight + 'px';
    activeContent.style.paddingTop = '10px';
    activeContent.style.paddingBottom = '10px';
  }

  document.querySelectorAll('.acc-title').forEach((title) => {
    title.addEventListener('click', () => {
      const content = title.nextElementSibling as HTMLElement;
      const isActive = title.classList.contains('active');

      document.querySelectorAll('.acc-title').forEach((t) => {
        t.classList.remove('active');
        const c = t.nextElementSibling as HTMLElement;
        if (c?.classList.contains('acc-content')) {
          c.style.maxHeight = '0';
          c.style.paddingTop = '';
          c.style.paddingBottom = '';
        }
      });

      if (!isActive) {
        title.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 20 + 'px';
        content.style.paddingTop = '10px';
        content.style.paddingBottom = '10px';
      }
    });
  });
}

function initScrollHandler(): void {
  const backToTop = document.querySelector<HTMLElement>('.back-to-top');
  const nav = document.querySelector<HTMLElement>('nav');
  const menuEl = document.getElementById('menu');
  let lastScrollTop = 0;
  let ticking = false;
  const delta = 5;
  const navbarHeight = nav?.offsetHeight ?? 69;

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;

        if (nav && menuEl) {
          if (scrollTop >= 600) {
            nav.classList.add('shown');
            nav.classList.remove('hiden');
            menuEl.classList.add('shown');
            menuEl.classList.remove('hiden');
          } else {
            nav.classList.add('hiden');
            nav.classList.remove('shown');
            menuEl.classList.add('hiden');
            menuEl.classList.remove('shown');
          }
        }

        if (backToTop) {
          backToTop.classList.toggle('show-button', scrollTop >= 400);
        }

        if (Math.abs(lastScrollTop - scrollTop) > delta && nav) {
          if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
            nav.style.top = '-69px';
          } else if (
            scrollTop + window.innerHeight <
            document.body.scrollHeight
          ) {
            nav.style.top = '0px';
          }
          lastScrollTop = scrollTop;
        }

        ticking = false;
      });
    },
    { passive: true },
  );
}

// Replaces jquery.appear + jquery.animateNumber
function initFunFacts(): void {
  const factsSection = document.getElementById('facts');
  if (!factsSection) return;

  let animated = false;
  const githubApiUrl = 'https://api.github.com/users/ftuyama';
  const localApiUrl = '/public/cache/ftuyama.json';
  const apiUrl =
    location.hostname === 'localhost' ? localApiUrl : githubApiUrl;

  const runAnimation = (repoCount: number) => {
    observeElement(
      factsSection,
      () => {
        if (animated) return;
        animated = true;
        animateNumber(document.getElementById('number_1')!, 68530, 2200);
        animateNumber(document.getElementById('number_2')!, repoCount, 2200);
        animateNumber(
          document.getElementById('number_3')!,
          Math.round(+new Date() / 100000000),
          2200,
        );
        animateNumber(document.getElementById('number_4')!, 10000, 2200);
      },
      -150,
    );
  };

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data: GitHubUser) => runAnimation(data.public_repos))
    .catch(() => runAnimation(30));
}

// Replaces jquery.appear + jquery.easyPieChart + jquery.animateNumber
function initSkills(): void {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  let animated = false;

  observeElement(
    skillsSection,
    () => {
      if (animated) return;
      animated = true;

      document
        .querySelectorAll<HTMLElement>('.chart')
        .forEach((el) => createPieChart(el));

      animateNumber(document.getElementById('chart_num_1')!, 88, 1500);
      animateNumber(document.getElementById('chart_num_2')!, 63, 1500);
      animateNumber(document.getElementById('chart_num_3')!, 73, 1500);
      animateNumber(document.getElementById('chart_num_4')!, 45, 1500);
    },
    -150,
  );
}

// Replaces MixItUp
function initPortfolioFilter(): void {
  const container = document.getElementById('Container');
  if (!container) return;

  const items = container.querySelectorAll<HTMLElement>('.mix');
  const buttons = document.querySelectorAll<HTMLElement>('.controls .filter');

  items.forEach((item) => {
    item.style.display = 'inline-block';
  });

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter ?? 'all';

      buttons.forEach((b) => b.classList.remove('active'));
      button.classList.add('active');

      items.forEach((item) => {
        if (
          filter === 'all' ||
          item.classList.contains(filter.replace('.', ''))
        ) {
          item.style.display = 'inline-block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Replaces Magnific Popup with native <dialog>
function initPopup(): void {
  const dialog = document.createElement('dialog');
  dialog.className = 'popup-dialog';

  const inner = document.createElement('div');
  inner.className = 'popup-dialog-inner';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'popup-close';
  closeBtn.textContent = '\u00d7';
  closeBtn.type = 'button';
  closeBtn.addEventListener('click', () => dialog.close());

  const content = document.createElement('div');
  content.className = 'white-popup';

  inner.appendChild(closeBtn);
  inner.appendChild(content);
  dialog.appendChild(inner);

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  document.body.appendChild(dialog);

  document.querySelectorAll<HTMLAnchorElement>('.open-popup-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetId = link.getAttribute('href')?.slice(1);
      if (!targetId) return;
      const source = document.getElementById(targetId);
      if (!source) return;

      content.innerHTML = source.innerHTML;
      dialog.showModal();
    });
  });
}

// --- Utilities ---

function animateNumber(el: HTMLElement, target: number, duration: number): void {
  const startTime = performance.now();

  function update(now: number) {
    const progress = Math.min((now - startTime) / duration, 1);
    el.textContent = String(Math.round(progress * target));
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function createPieChart(el: HTMLElement): void {
  const percent = parseInt(el.dataset.percent ?? '0', 10);
  const size = 150;
  const lineWidth = 10;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '50%';
  canvas.style.transform = 'translateX(-50%)';
  el.insertBefore(canvas, el.firstChild);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const center = size / 2;
  const radius = (size - lineWidth) / 2;
  const startAngle = -Math.PI / 2;
  const targetAngle = startAngle + (percent / 100) * 2 * Math.PI;
  const duration = 1500;
  const startTime = performance.now();

  function draw(now: number) {
    const progress = Math.min((now - startTime) / duration, 1);
    const currentAngle = startAngle + progress * (targetAngle - startAngle);

    ctx!.clearRect(0, 0, size, size);
    ctx!.beginPath();
    ctx!.arc(center, center, radius, startAngle, currentAngle);
    ctx!.strokeStyle = '#5ae';
    ctx!.lineWidth = lineWidth;
    ctx!.lineCap = 'round';
    ctx!.stroke();

    if (progress < 1) requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

function observeElement(
  el: Element,
  callback: () => void,
  offsetY: number = 0,
): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(el);
        }
      });
    },
    { rootMargin: `0px 0px ${offsetY}px 0px` },
  );

  observer.observe(el);
}
