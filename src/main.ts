import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.compat.css';
import './style.css';

import { initApp } from './home';
import { initAnimatedHeader } from './animated-header';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  initAnimatedHeader();
});
