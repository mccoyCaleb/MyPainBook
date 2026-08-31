document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    document.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const targetUrl = new URL(link.href, window.location.href);
        const isSamePage = targetUrl.href === window.location.href;
        const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

        if (
          isModifiedClick ||
          link.target === '_blank' ||
          link.hasAttribute('download') ||
          targetUrl.origin !== window.location.origin ||
          targetUrl.pathname === window.location.pathname && targetUrl.hash ||
          isSamePage
        ) return;

        event.preventDefault();
        document.body.classList.add('page-leaving');
        window.setTimeout(() => {
          window.location.href = targetUrl.href;
        }, 150);
      });
    });
  }

  const sidebars = document.querySelectorAll('[data-sidebar]');

  sidebars.forEach((sidebar) => {
    const toggle = sidebar.querySelector('[data-sidebar-toggle]');
    if (!toggle) return;

    const setOpen = (isOpen) => {
      sidebar.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      toggle.textContent = isOpen ? '‹' : '☰';
    };

    toggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('is-open');
      setOpen(!isOpen);
    });

    setOpen(false);
  });

  const settings = document.querySelector('[data-settings]');
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  if (!settings) return;

  const settingsToggle = settings.querySelector('[data-settings-toggle]');
  const themeToggle = settings.querySelector('[data-theme-toggle]');
  const fontSize = settings.querySelector('[data-font-size]');
  const fontSizeValue = settings.querySelector('[data-font-size-value]');
  const adhdToggle = settings.querySelector('[data-adhd-toggle]');

  const savedTheme = localStorage.getItem('site-theme') === 'dark';
  const savedFontSize = localStorage.getItem('site-font-size') || '100';
  const savedAdhdMode = localStorage.getItem('site-adhd-mode') === 'true';

  const setTheme = (isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
    themeToggle.checked = isDark;
    localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
  };

  const setFontSize = (size) => {
    document.documentElement.style.setProperty('--site-font-size', `${size}%`);
    fontSize.value = size;
    fontSizeValue.value = `${size}%`;
    localStorage.setItem('site-font-size', size);
  };

  const setAdhdMode = (isEnabled) => {
    document.body.classList.toggle('adhd-enabled', isEnabled);
    adhdToggle.checked = isEnabled;
    localStorage.setItem('site-adhd-mode', String(isEnabled));
  };

  settingsToggle.addEventListener('click', () => {
    const isOpen = settings.classList.toggle('is-open');
    settingsToggle.setAttribute('aria-expanded', String(isOpen));
    settingsToggle.setAttribute('aria-label', isOpen ? 'Close settings' : 'Open settings');
  });
  themeToggle.addEventListener('change', () => setTheme(themeToggle.checked));
  fontSize.addEventListener('input', () => setFontSize(fontSize.value));
  adhdToggle.addEventListener('change', () => setAdhdMode(adhdToggle.checked));

  setTheme(savedTheme);
  setFontSize(savedFontSize);
  setAdhdMode(savedAdhdMode);
});
