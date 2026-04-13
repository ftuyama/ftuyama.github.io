import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import { initCriticalApp, initDeferredApp } from './home';
import { initAnimatedHeader } from './animated-header';

document.addEventListener('DOMContentLoaded', () => {
  initCriticalApp();

  const startNonCriticalWork = () => {
    import('animate.css/animate.compat.css');
    initDeferredApp();
    initAnimatedHeader();
  };

  const idleWindow = window as Window & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  };

  if (typeof idleWindow.requestIdleCallback === 'function') {
    idleWindow.requestIdleCallback(startNonCriticalWork, { timeout: 1200 });
    return;
  }

  window.setTimeout(startNonCriticalWork, 300);
});
