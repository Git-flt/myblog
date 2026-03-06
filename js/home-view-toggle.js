/**
 * 首页文章视图切换（列表/网格）
 */

(() => {
  const STORAGE_KEY = 'homeArticleView';

  const readStoredView = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (_) {
      return null;
    }
  };

  const saveView = view => {
    try {
      localStorage.setItem(STORAGE_KEY, view);
    } catch (_) {
      // Ignore write failures (private mode, blocked storage, etc.)
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const list = document.querySelector('.article-list');
    const buttons = Array.from(document.querySelectorAll('.view-toggle-btn'));
    if (!list || buttons.length === 0) return;

    const applyView = view => {
      const nextView = view === 'grid' ? 'grid' : 'list';
      list.classList.toggle('view-grid', nextView === 'grid');
      list.classList.toggle('view-list', nextView === 'list');

      buttons.forEach(button => {
        const isActive = button.dataset.view === nextView;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
    };

    const initialView = readStoredView() === 'grid' ? 'grid' : 'list';
    applyView(initialView);

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const view = button.dataset.view;
        applyView(view);
        saveView(view);
      });
    });
  });
})();
