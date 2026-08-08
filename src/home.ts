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
}

function initLoadingScreen(): void {
  setTimeout(() => {
    document.querySelector('.loading')?.classList.add('loaded');
  }, 180);
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

      const toolsCarousel = skillsSection.querySelector<HTMLElement>('.tools-carousel-shell');
      if (toolsCarousel) {
        setTimeout(() => toolsCarousel.classList.add('visible'), 260);
      }

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
