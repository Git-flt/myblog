/**
 * Markdown 转 HTML 发布脚本
 * 用法: node publish.js
 * 或: npm run publish
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// 配置
const DRAFTS_DIR = path.join(__dirname, 'drafts');
const ARTICLES_DIR = path.join(__dirname, 'articles');

// 确保目录存在
if (!fs.existsSync(ARTICLES_DIR)) fs.mkdirSync(ARTICLES_DIR, { recursive: true });

// 配置 marked
marked.setOptions({
  gfm: true,
  breaks: true
});

/**
 * 估算阅读时长
 */
function estimateReadingTime(content) {
  // 移除HTML标签
  const text = content.replace(/<[^>]*>/g, '');
    
  // 中文字符数（粗略估计）
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    
  // 英文单词数
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    
  // 中文阅读速度约 300-400 字/分钟，取 350
  // 英文阅读速度约 200-250 词/分钟，取 225
  const minutes = Math.ceil((chineseChars / 350) + (englishWords / 225));
    
  return minutes || 1; // 至少1分钟
}

/**
 * HTML 模板
 */
function getHtmlTemplate(title, date, tags, content, slug, readingTime, excerpt = '', coverImage = '') {
  const tagsHtml = tags.map(t => `<span class="tag">${t}</span>`).join('');
  const siteUrl = 'https://git-flt.github.io/myblog'; // GitHub Pages 域名
  const articleUrl = `${siteUrl}/articles/${slug}.html`;
  const description = excerpt || `${title} - King of Fish 科技博客`;
  const keywords = tags.join(', ');
  const author = 'King of Fish'; // 博客作者名
    
  // 提取第一张图片作为Open Graph图片（如果有）
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  const ogImage = coverImage || (imgMatch ? imgMatch[1] : `${siteUrl}/images/default-og.png`);

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - My Blog</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="keywords" content="${escapeHtml(keywords)}">
    <meta name="author" content="${author}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${articleUrl}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${articleUrl}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:site_name" content="My Blog">
    <meta property="article:published_time" content="${new Date(date).toISOString()}">
    <meta property="article:author" content="${author}">
    ${tags.map(tag => `<meta property="article:tag" content="${escapeHtml(tag)}">`).join('\n    ')}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${articleUrl}">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${ogImage}">
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${escapeJson(title)}",
      "image": "${ogImage}",
      "datePublished": "${new Date(date).toISOString()}",
      "dateModified": "${new Date(date).toISOString()}",
      "author": {
        "@type": "Person",
        "name": "${author}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "My Blog",
        "logo": {
          "@type": "ImageObject",
          "url": "${siteUrl}/images/logo.png"
        }
      },
      "description": "${escapeJson(description)}",
      "keywords": "${escapeJson(keywords)}",
      "articleBody": "${escapeJson(content.replace(/<[^>]*>/g, '').substring(0, 500))}",
      "url": "${articleUrl}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${articleUrl}"
      }
    }
    </script>
    
    <link rel="stylesheet" href="../css/style.css">
</head>
<body data-pagefind-body>
    <div class="reading-progress" id="readingProgress" aria-hidden="true"></div>
    <button class="back-to-top" id="backToTop" aria-label="回到顶部">↑</button>
    <button class="theme-toggle" onclick="toggleTheme()" aria-label="切换主题">🌓</button>

    <header class="header">
        <div class="container">
            <h1 class="logo"><a href="../index.html">King of Fish 🐠</a></h1>
            <nav class="nav">
                <a href="../index.html">首页</a>
                <a href="../index.html#articles">文章</a>
                <a href="../categories.html">分类</a>
                <a href="../tags.html">标签</a>
                <a href="../index.html#about">关于</a>
            </nav>
        </div>
    </header>

    <main class="main">
        <article class="article-content">
            <div class="container">
                <header class="article-header">
                    <h1>${title}</h1>
                    <p class="article-meta">
                        <span class="date">📅 ${date}</span>
                        <span class="reading-time">⏱️ 约 ${readingTime} 分钟阅读</span>
                        ${tagsHtml}
                    </p>
                </header>

                <aside class="article-toc" id="articleToc" aria-label="文章目录" hidden>
                    <h3>目录</h3>
                    <nav id="tocList"></nav>
                </aside>

                <div class="article-body">
${content}
                </div>

                <div class="article-footer">
                    <div class="article-stats">
                        <span class="views-count">👁️ 阅读 <span id="busuanzi_value_page_pv">-</span></span>
                        <button class="like-button" onclick="toggleLike('${slug}')" aria-label="点赞">
                            <span class="like-icon">👍</span>
                            <span class="like-count" id="like-count">0</span>
                        </button>
                    </div>
                    <div class="share-section">
                        <span class="share-label">分享：</span>
                        <a class="share-btn" href="https://x.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener noreferrer">X</a>
                        <a class="share-btn" href="https://www.reddit.com/submit?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(title)}" target="_blank" rel="noopener noreferrer">Reddit</a>
                        <a class="share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a class="share-btn" href="https://service.weibo.com/share/share.php?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(title)}" target="_blank" rel="noopener noreferrer">微博</a>
                        <a class="share-btn" href="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(articleUrl)}" target="_blank" rel="noopener noreferrer">微信</a>
                        <a class="share-btn" href="https://www.toutiao.com/" target="_blank" rel="noopener noreferrer" title="打开头条发布入口后粘贴链接">头条</a>
                        <a class="share-btn" href="../feed.xml" target="_blank" rel="noopener">RSS</a>
                        <button type="button" class="share-btn share-btn-copy" onclick="copyArticleLink()">复制链接</button>
                    </div>
                    <div class="audio-read-section">
                        <button type="button" class="audio-read-btn" onclick="toggleReadAloud()">🔊 朗读本文</button>
                        <span class="audio-read-hint">支持浏览器语音朗读（中文优先）</span>
                    </div>
                    <a href="../index.html" class="back-link">← 返回首页</a>
                </div>

                <div class="comments-section">
                    <h3>💬 评论</h3>
                    <div id="giscus-container"></div>

                    <!-- Giscus 评论系统 -->
                    <script src="https://giscus.app/client.js"
                        data-repo="Git-flt/myblog"
                        data-repo-id="R_kgDORDJ7tw"
                        data-category="Announcements"
                        data-category-id="DIC_kwDORDJ7t84C1pO1"
                        data-mapping="pathname"
                        data-strict="0"
                        data-reactions-enabled="1"
                        data-emit-metadata="0"
                        data-input-position="top"
                        data-theme="light"
                        data-lang="zh-CN"
                        data-loading="lazy"
                        crossorigin="anonymous"
                        async>
                    </script>
                </div>
            </div>
        </article>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} My Blog. All rights reserved.</p>
            <p class="footer-stats">
                <span id="busuanzi_container_site_pv">总访问 <span id="busuanzi_value_site_pv">-</span></span>
                <span id="busuanzi_container_site_uv">访问人数 <span id="busuanzi_value_site_uv">-</span></span>
            </p>
        </div>
    </footer>

    <!-- 不蒜子统计 -->
    <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>

    <script>
        // 主题切换功能
        function toggleTheme() {
            const body = document.body;
            const isDark = body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }

        // 页面加载时同步 Giscus 主题
        (function() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
            }
            // 延迟同步 Giscus 主题
            setTimeout(updateGiscusTheme, 500);
        })();

        // 主题切换时同步 Giscus 主题
        const themeToggleBtn = document.querySelector('.theme-toggle');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', function() {
                setTimeout(updateGiscusTheme, 100);
            });
        }
        function toggleLike(articleSlug) {
            const likes = JSON.parse(localStorage.getItem('blog_likes') || '{}');
            const isLiked = likes[articleSlug];
            likes[articleSlug] = !isLiked;
            localStorage.setItem('blog_likes', JSON.stringify(likes));
            updateLikeCount(articleSlug);
        }

        function updateLikeCount(articleSlug) {
            const likes = JSON.parse(localStorage.getItem('blog_likes') || '{}');
            const count = likes[articleSlug] ? 1 : 0;
            const countElement = document.getElementById('like-count');
            if (countElement) {
                countElement.textContent = count;
            }

            // 更新按钮样式
            const button = document.querySelector('.like-button');
            if (button) {
                if (likes[articleSlug]) {
                    button.classList.add('liked');
                } else {
                    button.classList.remove('liked');
                }
            }
        }

        // 页面加载时更新点赞数
        (function() {
            updateLikeCount('${slug}');
        })();

        // Giscus 主题同步（如果启用了 Giscus）
        function updateGiscusTheme() {
            const iframe = document.querySelector('iframe.giscus-frame');
            if (iframe) {
                const isDark = document.body.classList.contains('dark-mode');
                iframe.contentWindow.postMessage({
                    giscus: {
                        setConfig: {
                            theme: isDark ? 'dark' : 'light'
                        }
                    }
                }, 'https://giscus.app');
            }
        }

        let currentUtterance = null;

        function copyArticleLink() {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                alert('链接已复制，可以直接贴到微信/头条/社交平台。');
            }).catch(() => {
                window.prompt('复制失败，请手动复制链接：', url);
            });
        }

        function toggleReadAloud() {
            if (!('speechSynthesis' in window)) {
                alert('当前浏览器不支持语音朗读。');
                return;
            }

            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                currentUtterance = null;
                return;
            }

            const articleBody = document.querySelector('.article-body');
            if (!articleBody) return;

            const text = articleBody.innerText.replace(/\\s+/g, ' ').trim();
            if (!text) return;

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = 1;
            utterance.pitch = 1;
            currentUtterance = utterance;
            utterance.onend = () => {
                currentUtterance = null;
            };
            speechSynthesis.speak(utterance);
        }

        // 代码块复制功能 + 目录/阅读体验增强
        document.addEventListener('DOMContentLoaded', function() {
            const codeBlocks = document.querySelectorAll('pre');

            // 自动目录（h2/h3）+ 标题锚点 + 当前章节高亮
            const tocBox = document.getElementById('articleToc');
            const tocList = document.getElementById('tocList');
            const headings = Array.from(document.querySelectorAll('.article-body h2, .article-body h3'));
            let tocLinks = [];

            if (tocBox && tocList && headings.length > 0) {
                const links = headings.map((h, i) => {
                    const slug = (h.textContent || ('section-' + i))
                      .toLowerCase()
                      .trim()
                      .replace(/[^一-龥A-Za-z0-9_ -]/g, '')
                      .replace(/ +/g, '-');
                    const id = h.id || ('sec-' + i + '-' + slug);
                    h.id = id;
                    h.classList.add('heading-anchor-target');
                    return '<a class="toc-link toc-' + h.tagName.toLowerCase() + '" data-target="' + id + '" href="#' + id + '">' + h.textContent + '</a>';
                }).join('');
                tocList.innerHTML = links;
                tocBox.hidden = false;
                tocLinks = Array.from(tocList.querySelectorAll('.toc-link'));
            }

            // 阅读进度 + 回到顶部 + TOC高亮
            const progress = document.getElementById('readingProgress');
            const backBtn = document.getElementById('backToTop');
            const onScroll = function() {
                const h = document.documentElement;
                const total = h.scrollHeight - h.clientHeight;
                const ratio = total > 0 ? (h.scrollTop / total) : 0;
                if (progress) progress.style.width = String(Math.min(100, Math.max(0, ratio * 100))) + '%';
                if (backBtn) backBtn.style.display = h.scrollTop > 320 ? 'inline-flex' : 'none';

                if (tocLinks.length > 0 && headings.length > 0) {
                    const offset = 110;
                    let currentId = headings[0].id;
                    headings.forEach(hd => {
                        const top = hd.getBoundingClientRect().top;
                        if (top <= offset) currentId = hd.id;
                    });
                    tocLinks.forEach(link => {
                        if (link.dataset.target === currentId) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
            if (backBtn) {
              backBtn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              });
            }
            
            codeBlocks.forEach(function(block) {
                const wrapper = document.createElement('div');
                wrapper.className = 'code-block-wrapper';
                
                const button = document.createElement('button');
                button.className = 'copy-code-btn';
                button.innerHTML = '📋 复制';
                button.setAttribute('aria-label', '复制代码');
                
                button.addEventListener('click', function() {
                    const code = block.querySelector('code') || block;
                    const text = code.textContent;
                    
                    navigator.clipboard.writeText(text).then(function() {
                        button.innerHTML = '✅ 已复制!';
                        button.classList.add('copied');
                        
                        setTimeout(function() {
                            button.innerHTML = '📋 复制';
                            button.classList.remove('copied');
                        }, 2000);
                    }).catch(function(err) {
                        console.error('复制失败:', err);
                        button.innerHTML = '❌ 复制失败';
                    });
                });
                
                block.parentNode.insertBefore(wrapper, block);
                wrapper.appendChild(button);
                wrapper.appendChild(block);
            });
        });
    </script>
</body>
</html>`;
}

/**
 * 生成 RSS Feed
 */
function generateRSS(articles) {
  const siteUrl = 'https://git-flt.github.io/myblog'; // GitHub Pages 域名
  const siteTitle = 'King of Fish';
  const siteDescription = 'AI前沿技术、生物科技、科技数码、健康养生等多元化内容分享';
    
  const rssItems = articles.map(article => {
    const slug = path.basename(article.filename, '.html');
    const link = `${siteUrl}/articles/${slug}.html`;
    const pubDate = new Date(article.date).toUTCString();
        
    return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(article.excerpt || article.title)}</description>
      ${article.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`;
  }).join('\n\n');
    
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />

${rssItems}
  </channel>
</rss>`;
    
  const rssPath = path.join(__dirname, 'feed.xml');
  fs.writeFileSync(rssPath, rss);
  console.log('✅ RSS feed 已生成: feed.xml');
}


/**
 * 生成分类/标签索引页
 */
function generateTaxonomyPages(articles) {
  const categories = new Map();
  const tagsMap = new Map();

  articles.forEach(article => {
    const category = article.category || '未分类';
    if (!categories.has(category)) categories.set(category, []);
    categories.get(category).push(article);

    (article.tags || []).forEach(tag => {
      if (!tagsMap.has(tag)) tagsMap.set(tag, []);
      tagsMap.get(tag).push(article);
    });
  });

  const categoryCards = Array.from(categories.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([name, list]) => {
      const links = list.slice(0, 8).map(a => {
        const slug = path.basename(a.filename, '.html');
        return `<li><a href="articles/${slug}.html">${escapeHtml(a.title)}</a></li>`;
      }).join('');
      return `<article class="article-card"><h3>${escapeHtml(name)} <small>(${list.length})</small></h3><ul>${links}</ul></article>`;
    }).join('');

  const tagCards = Array.from(tagsMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([name, list]) => {
      const links = list.slice(0, 6).map(a => {
        const slug = path.basename(a.filename, '.html');
        return `<li><a href="articles/${slug}.html">${escapeHtml(a.title)}</a></li>`;
      }).join('');
      return `<article class="article-card"><h3># ${escapeHtml(name)} <small>(${list.length})</small></h3><ul>${links}</ul></article>`;
    }).join('');

  const baseHead = '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="css/style.css">';

  const categoriesHtml = `<!DOCTYPE html><html lang="zh-CN"><head>${baseHead}<title>分类索引 - King of Fish</title></head><body><header class="header"><div class="container"><h1 class="logo"><a href="index.html">King of Fish 🐠</a></h1><nav class="nav"><a href="index.html">首页</a><a href="categories.html" class="active">分类</a><a href="tags.html">标签</a></nav></div></header><main class="main"><section class="articles"><div class="container"><h2 class="section-title">分类索引</h2><div class="article-list view-grid">${categoryCards}</div></div></section></main></body></html>`;

  const tagsHtml = `<!DOCTYPE html><html lang="zh-CN"><head>${baseHead}<title>标签索引 - King of Fish</title></head><body><header class="header"><div class="container"><h1 class="logo"><a href="index.html">King of Fish 🐠</a></h1><nav class="nav"><a href="index.html">首页</a><a href="categories.html">分类</a><a href="tags.html" class="active">标签</a></nav></div></header><main class="main"><section class="articles"><div class="container"><h2 class="section-title">标签索引</h2><div class="article-list view-grid">${tagCards}</div></div></section></main></body></html>`;

  fs.writeFileSync(path.join(__dirname, 'categories.html'), categoriesHtml);
  fs.writeFileSync(path.join(__dirname, 'tags.html'), tagsHtml);
  console.log('✅ 分类与标签索引页已生成: categories.html / tags.html');
}

/**
 * 生成 Sitemap.xml
 */
function generateSitemap(articles) {
  const siteUrl = 'https://git-flt.github.io/myblog'; // GitHub Pages 域名
    
  // 首页
  const homepageUrl = `  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
    
  // 文章页面
  const articleUrls = articles.map(article => {
    const slug = path.basename(article.filename, '.html');
    const link = `${siteUrl}/articles/${slug}.html`;
    const lastmod = new Date(article.date).toISOString().split('T')[0];
        
    return `  <url>
    <loc>${link}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');
    
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${homepageUrl}
  <url>
    <loc>${siteUrl}/categories.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${siteUrl}/tags.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
${articleUrls}
</urlset>`;
    
  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log('✅ Sitemap 已生成: sitemap.xml');
}

/**
 * XML 转义函数
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * HTML 转义函数
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * JSON 转义函数
 */
function escapeJson(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * 更新 index.html 文章列表
 */
function updateIndexHtml(articles) {
  const indexPath = path.join(__dirname, 'index.html');
  let indexContent = fs.readFileSync(indexPath, 'utf8');

  // 使用标记替换
  const startMarker = '<!-- AUTO-ARTICLE-LIST:START -->';
  const endMarker = '<!-- AUTO-ARTICLE-LIST:END -->';

  if (!indexContent.includes(startMarker) || !indexContent.includes(endMarker)) {
    console.log('⚠️  未找到文章列表标记，跳过更新');
    return;
  }

  // 生成新的文章列表
  const newArticleList = articles.map(article => {
    const slug = path.basename(article.filename, '.html');
    return `                    <article class="article-card">
                        <a href="articles/${slug}.html" class="article-cover-link" aria-label="${article.title}">
                            <img class="article-cover" src="${article.coverImage || 'images/default-og.png'}" alt="${article.title} 缩略图" loading="lazy" decoding="async">
                        </a>
                        <h3><a href="articles/${slug}.html">${article.title}</a></h3>
                        <p class="article-meta">
                            <span class="date">${article.date}</span>
                            ${article.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                        </p>
                        <p class="article-excerpt">${article.excerpt}</p>
                        <a href="articles/${slug}.html" class="read-more">阅读全文 →</a>
                    </article>`;
  }).join('\n\n');

  // 替换标记之间的内容
  const newIndexContent = indexContent.replace(
    new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`),
    `${startMarker}\n${newArticleList}\n                    ${endMarker}`
  );

  fs.writeFileSync(indexPath, newIndexContent);
  console.log('✅ index.html 已更新');
}

/**
 * 转换单个 markdown 文件
 */
function convertFile(mdPath) {
  const filename = path.basename(mdPath);
  const baseName = path.basename(mdPath, '.md');

  // 跳过模板文件
  if (baseName.includes('模板') || baseName.startsWith('.')) {
    return null;
  }

  try {
    // 读取并解析 markdown
    const content = fs.readFileSync(mdPath, 'utf8');
    const { data, content: markdown } = matter(content);

    const title = data.title || baseName;
    const dateStr = data.date || new Date().toISOString().split('T')[0];
    const date = new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
    // 处理 tags：支持数组或逗号分隔的字符串
    let tags = ['未分类'];
    if (data.tags) {
      if (Array.isArray(data.tags)) {
        tags = data.tags;
      } else if (typeof data.tags === 'string') {
        tags = data.tags.split(',').map(t => t.trim()).filter(t => t);
      }
    }
    const excerpt = data.excerpt || '';
    const slug = data.slug || baseName;
    const category = (typeof data.category === 'string' && data.category.trim())
      ? data.category.trim()
      : (tags[0] || '未分类');

    // 转换为 HTML
    const htmlContent = marked.parse(markdown);

    // 缩略图：优先 frontmatter.cover，其次正文第一张图片，最后默认图
    const markdownImgMatch = markdown.match(/!\[[^\]]*\]\(([^)]+)\)/);
    const htmlImgMatch = htmlContent.match(/<img[^>]+src="([^">]+)"/);
    const coverImage = data.cover || (markdownImgMatch ? markdownImgMatch[1] : '') || (htmlImgMatch ? htmlImgMatch[1] : '') || 'images/default-og.png';
    
    // 计算阅读时长
    const readingTime = estimateReadingTime(htmlContent);

    // 生成完整 HTML
    const fullHtml = getHtmlTemplate(title, date, tags, htmlContent, slug, readingTime, excerpt, coverImage);

    // 保存 HTML 文件
    const htmlPath = path.join(ARTICLES_DIR, `${slug}.html`);
    fs.writeFileSync(htmlPath, fullHtml);

    console.log(`✅ ${filename} → ${slug}.html`);

    return {
      filename: `${slug}.html`,
      title,
      date,
      tags,
      excerpt,
      coverImage,
      category
    };
  } catch (error) {
    console.error(`❌ 转换失败: ${filename} - ${error.message}`);
    return null;
  }
}

/**
 * 主函数
 */
function main() {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║      博客发布工具 - Markdown 转 HTML    ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');

  // 获取所有 markdown 文件
  const files = fs.readdirSync(DRAFTS_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('.'));

  if (files.length === 0) {
    console.log('📝 drafts 文件夹中没有 Markdown 文件');
    console.log('');
    return;
  }

  console.log(`📄 找到 ${files.length} 个待转换的文件`);
  console.log('');

  // 转换所有文件
  const articles = [];
  files.forEach(file => {
    const mdPath = path.join(DRAFTS_DIR, file);
    const result = convertFile(mdPath);
    if (result) articles.push(result);
  });

  console.log('');

  // 按日期排序
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 更新 index.html
  if (articles.length > 0) {
    updateIndexHtml(articles);
    generateRSS(articles);
    generateTaxonomyPages(articles);
    generateSitemap(articles);
  }

  console.log('');
  console.log('════════════════════════════════════════');
  console.log('  发布完成!');
  console.log(`  转换文章: ${articles.length} 篇`);
  console.log('════════════════════════════════════════');
  console.log('');
  console.log('💡 提示:');
  console.log('   - 查看生成的 HTML: articles/');
  console.log('   - 测试运行: npm run serve');
  console.log('   - 部署到服务器: ./deploy.sh');
  console.log('');
}

main();
