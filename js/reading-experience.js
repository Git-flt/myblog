(function () {
  const progress = document.getElementById('readingProgress');
  if (!progress) return;

  const backBtn = document.createElement('button');
  backBtn.className = 'back-to-top';
  backBtn.setAttribute('aria-label', '返回顶部');
  backBtn.textContent = '↑';
  document.body.appendChild(backBtn);

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, ratio))}%`;
    backBtn.style.display = window.scrollY > 360 ? 'inline-flex' : 'none';
  };

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
