/**
 * 首页文章工具栏：排序
 */

document.addEventListener('DOMContentLoaded', () => {
  const sortSelect = document.getElementById('article-sort');
  const list = document.getElementById('article-list');
  if (!sortSelect || !list) return;

  sortSelect.addEventListener('change', () => {
    const cards = Array.from(list.querySelectorAll('.article-card'));
    const mode = sortSelect.value;

    const getDate = card => {
      const dateText = card.querySelector('.article-meta .date')?.textContent?.trim() || '';
      return new Date(dateText).getTime() || 0;
    };

    const getTitle = card => card.querySelector('h3 a')?.textContent?.trim() || '';

    cards.sort((a, b) => {
      if (mode === 'date-asc') return getDate(a) - getDate(b);
      if (mode === 'title-asc') return getTitle(a).localeCompare(getTitle(b), 'zh-Hans-CN');
      return getDate(b) - getDate(a); // date-desc
    });

    cards.forEach(card => list.appendChild(card));
  });
});
