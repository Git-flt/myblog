/**
 * Pagefind 搜索初始化脚本
 */

// 等待页面加载完成
window.addEventListener('DOMContentLoaded', () => {
  initSearch();
});

async function initSearch() {
  // 动态加载 Pagefind
  if (typeof window.PagefindUI === 'undefined') {
    // 加载 Pagefind CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/_pagefind/pagefind-ui.css';
    document.head.appendChild(link);

    // 加载 Pagefind JS
    const script = document.createElement('script');
    script.src = '/_pagefind/pagefind-ui.js';
    script.onload = () => {
      mountSearch();
    };
    document.head.appendChild(script);
  } else {
    mountSearch();
  }
}

function mountSearch() {
  const searchContainer = document.getElementById('search');
  if (searchContainer && window.PagefindUI) {
    new window.PagefindUI({
      element: '#search',
      showSubResults: true,
      showImages: false,
      excerptLength: 15,
      translations: {
        placeholder: '搜索文章...',
        clear_search: '清除',
        load_more: '加载更多',
        search_label: '搜索',
        filters_label: '筛选',
        zero_results: '未找到 [SEARCH_TERM] 的相关结果',
        many_results: '找到 [COUNT] 个 [SEARCH_TERM] 的相关结果',
        one_result: '找到 [COUNT] 个 [SEARCH_TERM] 的相关结果',
        alt_search: '未找到 [SEARCH_TERM] 的相关结果。改为显示 [DIFFERENT_TERM] 的结果',
        search_suggestion: '未找到 [SEARCH_TERM] 的相关结果。尝试以下搜索:',
      },
    });
  }
}
