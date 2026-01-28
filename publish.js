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
function getHtmlTemplate(title, date, tags, content, slug, readingTime) {
    const tagsHtml = tags.map(t => `<span class="tag">${t}</span>`).join('');

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body data-pagefind-body>
    <button class="theme-toggle" onclick="toggleTheme()" aria-label="切换主题">🌓</button>

    <header class="header">
        <div class="container">
            <h1 class="logo"><a href="../index.html">My Blog</a></h1>
            <nav class="nav">
                <a href="../index.html">首页</a>
                <a href="../index.html#articles">文章</a>
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

                <div class="article-body">
${content}
                </div>

                <div class="article-footer">
                    <div class="like-section">
                        <button class="like-button" onclick="toggleLike('${slug}')" aria-label="点赞">
                            <span class="like-icon">👍</span>
                            <span class="like-count" id="like-count">0</span>
                        </button>
                    </div>
                    <a href="../index.html" class="back-link">← 返回首页</a>
                </div>

                <div class="comments-section">
                    <h3>💬 评论</h3>
                    <div id="giscus-container"></div>

                    <!-- Giscus 评论系统
                    注意：首次使用需要配置 giscus-config.js
                    配置完成后，取消下方注释并替换配置参数

                    <script src="https://giscus.app/client.js"
                        data-repo=""
                        data-repo-id=""
                        data-category=""
                        data-category-id=""
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
                    -->
                </div>
            </div>
        </article>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} My Blog. All rights reserved.</p>
        </div>
    </footer>

    <script>
        // 主题切换功能
        function toggleTheme() {
            const body = document.body;
            const isDark = body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }

        // 页面加载时应用保存的主题
        (function() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
            }
        })();

        // 点赞功能
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

        // 在主题切换时同步 Giscus 主题（通过事件监听而非覆盖函数）
        const themeToggleBtn = document.querySelector('.theme-toggle');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', function() {
                setTimeout(updateGiscusTheme, 100);
            });
        }
        
        // 代码块复制功能
        document.addEventListener('DOMContentLoaded', function() {
            const codeBlocks = document.querySelectorAll('pre');
            
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
    const siteUrl = 'https://yourdomain.com'; // 请修改为你的域名
    const siteTitle = 'My Blog';
    const siteDescription = '个人技术博客';
    
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
    const tags = data.tags || ['未分类'];
    const excerpt = data.excerpt || '';
    const slug = data.slug || baseName;

    // 转换为 HTML
    const htmlContent = marked.parse(markdown);
    
    // 计算阅读时长
    const readingTime = estimateReadingTime(htmlContent);

    // 生成完整 HTML
    const fullHtml = getHtmlTemplate(title, date, tags, htmlContent, slug, readingTime);

    // 保存 HTML 文件
    const htmlPath = path.join(ARTICLES_DIR, `${slug}.html`);
    fs.writeFileSync(htmlPath, fullHtml);

        console.log(`✅ ${filename} → ${slug}.html`);

        return {
            filename: `${slug}.html`,
            title,
            date,
            tags,
            excerpt
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
    }

    console.log('');
    console.log('════════════════════════════════════════');
    console.log('  发布完成!')
    console.log(`  转换文章: ${articles.length} 篇`)
    console.log('════════════════════════════════════════');
    console.log('');
    console.log('💡 提示:');
    console.log('   - 查看生成的 HTML: articles/');
    console.log('   - 测试运行: npm run serve');
    console.log('   - 部署到服务器: ./deploy.sh');
    console.log('');
}

main();
