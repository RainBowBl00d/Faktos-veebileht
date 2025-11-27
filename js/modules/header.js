export const getHeader = () => {
  return `
    <header class="site-header">
      <div class="header-content">
        <nav class="main-nav">
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="keyboardLearner.html">Keyboard Learner</a></li>
            <li><a href="typeracer.html">Typing Race</a></li>
          </ul>
        </nav>
        <button class="dark-mode-toggle" id="dark-mode-toggle" aria-label="Toggle dark mode">
          <span class="icon-sun">☀️</span>
          <span class="icon-moon">🌙</span>
        </button>
      </div>
    </header>
  `;
};

// Initialize dark mode from localStorage
export const initDarkMode = () => {
  const toggle = document.getElementById('dark-mode-toggle');
  if (!toggle) return;
  
  // Check for saved preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
};
