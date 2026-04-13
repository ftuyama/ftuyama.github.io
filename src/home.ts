interface Certificate {
  name: string;
  path?: string;
}

interface GitHubUser {
  public_repos: number;
}

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  size: number;
}

interface FunFactStats {
  loc: number;
  repos: number;
  watchers: number;
  stars: number;
}

const FUN_FACT_ANIM_MS = 2200;
const FUN_FACT_FALLBACK: FunFactStats = {
  loc: 69000,
  repos: 66,
  watchers: 2100,
  stars: 87,
};
/** Maps each stat to its `#number_*` element id. */
const FUN_FACT_SLOTS: { id: string; key: keyof FunFactStats }[] = [
  { id: 'number_1', key: 'loc' },
  { id: 'number_2', key: 'repos' },
  { id: 'number_3', key: 'watchers' },
  { id: 'number_4', key: 'stars' },
];

function buildFunFactStats(user: GitHubUser, repos: GitHubRepo[]): FunFactStats {
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
  const totalSizeKB = repos.reduce((s, r) => s + r.size, 0);
  const estimatedLOC = Math.round((totalSizeKB * 1024) / 50);
  return {
    loc: estimatedLOC,
    repos: user.public_repos,
    watchers: totalForks * 100,
    stars: totalStars,
  };
}

export function initCriticalApp(): void {
  initLoadingScreen();
  initDynamicText();
  initMenu();
  initSmoothScroll();
  initAccordion();
  initScrollHandler();
}

export function initDeferredApp(): void {
  initScrollAnimations();
  initFunFacts();
  initSkills();
  initPortfolioEnhancements();
}

function initPortfolioEnhancements(): void {
  const portfolioSection = document.getElementById('portfolio');
  if (!portfolioSection) return;

  let started = false;
  observeElement(
    portfolioSection,
    () => {
      if (started) return;
      started = true;
      initCertificates();
      initPortfolioFilter();
      initPopup();
    },
    0,
  );
}

function initLoadingScreen(): void {
  setTimeout(() => {
    document.querySelector('.loading')?.classList.add('loaded');
  }, 600);
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
  try {
    const isLocalhost = location.hostname === 'localhost';
    // Prefer static cache for reliability; fallback to GitHub API if unavailable.
    const certsCandidates = [
      '/public/cache/certificates.json',
      'https://api.github.com/repos/ftuyama/ftuyama.github.io/contents/static/public/certificates',
    ];

    let certificates: Certificate[] | null = null;
    for (const url of certsCandidates) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        certificates = (await res.json()) as Certificate[];
        break;
      } catch {
        // Ignore and try next source.
      }
    }
    if (!certificates?.length) return;

    const container = document.getElementById('certificates');
    if (!container) return;

    const track = document.createElement('div');
    track.className = 'carousel-track';

    for (const cert of certificates) {
      const certificateUrl = getCertificateUrl(cert);
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

function getCertificateUrl(cert: Certificate): string {
  const rawPath = cert.path?.trim();
  if (rawPath) {
    const normalized = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath;
    const encodedPath = normalized
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');
    return `/${encodedPath}`;
  }

  const fileName = encodeURIComponent(cert.name);
  return `/public/certificates/${fileName}`;
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
  const isLocal = location.hostname === 'localhost';
  const userApiUrl = isLocal
    ? '/public/cache/ftuyama.json'
    : 'https://api.github.com/users/ftuyama';
  const reposApiUrl = isLocal
    ? '/public/cache/repos.json'
    : 'https://api.github.com/users/ftuyama/repos?per_page=100';

  const runAnimation = (stats: FunFactStats) => {
    observeElement(
      factsSection,
      () => {
        if (animated) return;
        animated = true;
        for (const { id, key } of FUN_FACT_SLOTS) {
          const el = document.getElementById(id);
          if (el) animateNumber(el, stats[key], FUN_FACT_ANIM_MS);
        }
      },
      -150,
    );
  };

  Promise.all([
    fetch(userApiUrl).then((r) => r.json()) as Promise<GitHubUser>,
    fetch(reposApiUrl).then((r) => r.json()) as Promise<GitHubRepo[]>,
  ])
    .then(([user, repos]) => runAnimation(buildFunFactStats(user, repos)))
    .catch(() => runAnimation(FUN_FACT_FALLBACK));
}

function initSkills(): void {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  let animated = false;

  observeElement(
    skillsSection,
    () => {
      if (animated) return;
      animated = true;

      skillsSection.querySelectorAll<HTMLElement>('.skill-card').forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 120);
      });

      skillsSection.querySelectorAll<HTMLElement>('.lang-row').forEach((row, i) => {
        const level = parseInt(row.dataset.level ?? '0', 10);
        setTimeout(() => {
          row.classList.add('visible');
          row.querySelectorAll('.dot').forEach((dot, di) => {
            if (di < level) {
              setTimeout(() => dot.classList.add('filled'), di * 80);
            }
          });
        }, 400 + i * 100);
      });
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

const formatCount = (n: number): string =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(n);

function animateNumber(el: HTMLElement, target: number, duration: number): void {
  const startTime = performance.now();

  function update(now: number) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.round(progress * target);
    el.textContent = formatCount(value);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
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
