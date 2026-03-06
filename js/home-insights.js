(function () {
  const countEl = document.getElementById('article-count');
  const list = document.getElementById('article-list');
  if (!countEl || !list) return;

  const update = () => {
    const visible = Array.from(list.querySelectorAll('.article-card')).filter(
      card => getComputedStyle(card).display !== 'none'
    ).length;
    countEl.textContent = `当前展示：${visible} 篇`;
  };

  const obs = new MutationObserver(update);
  obs.observe(list, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

  document.addEventListener('change', e => {
    if (e.target && e.target.id === 'article-sort') setTimeout(update, 0);
  });

  update();
})();
