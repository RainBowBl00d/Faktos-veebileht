import { getHeader } from './header.js';
import { getFooter } from './footer.js';

export const loadBaseTemplate = () => {
  document.addEventListener('DOMContentLoaded', () => {
    //  header
    const headerContainer = document.querySelector('[data-header-container]');
    if (headerContainer) {
      headerContainer.innerHTML = getHeader();
    }
    // footer
    const footerContainer = document.querySelector('[data-footer-container]');
    if (footerContainer) {
      footerContainer.innerHTML = getFooter();
    }
  });
};
