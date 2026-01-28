/**
 * 标签筛选功能
 */

// 动画时长常量
const ANIMATION_DURATION = 300; // 动画时长（毫秒）
const ANIMATION_DELAY = 10;     // 动画延迟（毫秒）

// 初始化标签筛选
document.addEventListener('DOMContentLoaded', () => {
  initTagFilter();
});

function initTagFilter() {
  const articleCards = document.querySelectorAll('.article-card');
  
  // 收集所有标签
  const allTags = new Set();
  articleCards.forEach(card => {
    const tags = card.querySelectorAll('.tag');
    tags.forEach(tag => {
      allTags.add(tag.textContent.trim());
    });
  });
  
  // 创建标签筛选器
  if (allTags.size > 0) {
    createTagFilter(Array.from(allTags), articleCards);
  }
}

function createTagFilter(tags, articleCards) {
  const container = document.querySelector('.articles .container');
  const sectionTitle = container.querySelector('.section-title');
  
  // 创建标签筛选容器
  const tagFilterHtml = `
    <div class="tag-filter">
      <button class="tag-filter-btn active" data-tag="all">全部</button>
      ${tags.map(tag => `<button class="tag-filter-btn" data-tag="${tag}">${tag}</button>`).join('')}
    </div>
  `;
  
  sectionTitle.insertAdjacentHTML('afterend', tagFilterHtml);
  
  // 添加点击事件
  const filterBtns = container.querySelectorAll('.tag-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedTag = btn.dataset.tag;
      
      // 更新按钮状态
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // 筛选文章
      filterArticles(selectedTag, articleCards);
    });
  });
}

function filterArticles(tag, articleCards) {
  articleCards.forEach(card => {
    if (tag === 'all') {
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, ANIMATION_DELAY);
    } else {
      const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.trim());

      if (tags.includes(tag)) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, ANIMATION_DELAY);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, ANIMATION_DURATION);
      }
    }
  });

  // 更新结果计数
  setTimeout(() => {
    const visibleCount = Array.from(articleCards).filter(card => card.style.display !== 'none').length;
    updateResultCount(visibleCount, tag);
  }, ANIMATION_DURATION + 50);
}

function updateResultCount(count, tag) {
  let countElement = document.querySelector('.filter-result-count');
  
  if (!countElement) {
    const tagFilter = document.querySelector('.tag-filter');
    countElement = document.createElement('div');
    countElement.className = 'filter-result-count';
    tagFilter.insertAdjacentElement('afterend', countElement);
  }
  
  if (tag === 'all') {
    countElement.textContent = `共 ${count} 篇文章`;
  } else {
    countElement.textContent = `"${tag}" 标签下有 ${count} 篇文章`;
  }
}
