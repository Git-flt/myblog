#!/usr/bin/env node
/**
 * 构建产物校验
 *
 * 重点是 URL 稳定性：文章地址一旦变化，外链、收藏与已有收录全部失效。
 * 这里把旧站已发布的路径写死成基线，构建后逐一比对。
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

// 旧站（publish.js 时代）已对外发布的文章路径，迁移后必须逐一保留
const LEGACY_ARTICLE_PATHS = [
  'articles/2026-01-ai-frontier.html',
  'articles/learning-notes.html',
  'articles/openclaw-king-of-fish.html',
  'articles/web-dev-notes.html',
  'articles/我的第一篇博客.html',
];

const REQUIRED_FILES = [
  'index.html',
  'writing.html',
  'about.html',
  'categories.html',
  'tags.html',
  '404.html',
  'feed.xml',
  'robots.txt',
  'llms.txt',
  'llms-full.txt',
  'sitemap-index.xml',
  ...LEGACY_ARTICLE_PATHS,
  // 每篇文章的 Markdown 原文端点
  ...LEGACY_ARTICLE_PATHS.map((p) => p.replace(/\.html$/, '.md')),
];

const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
};

check(existsSync(DIST), `构建产物目录 ${DIST} 不存在，请先运行 npm run build`);
if (!existsSync(DIST)) {
  console.error('✗ ' + failures.join('\n✗ '));
  process.exit(1);
}

for (const file of REQUIRED_FILES) {
  check(existsSync(join(DIST, file)), `缺少产物：${file}`);
}

// 主题聚类页
for (const topic of ['aiops-x-ai', 'architecture', 'trends', 'notes']) {
  check(existsSync(join(DIST, 'topics', `${topic}.html`)), `缺少主题页：topics/${topic}.html`);
}

// 搜索索引（由 pagefind 在 astro build 之后生成）
check(
  existsSync(join(DIST, '_pagefind')) && readdirSync(join(DIST, '_pagefind')).length > 0,
  '缺少 Pagefind 搜索索引（npm run build:search）'
);

// AI 可读层内容检查
if (existsSync(join(DIST, 'llms.txt'))) {
  const llms = readFileSync(join(DIST, 'llms.txt'), 'utf8');
  check(llms.includes('llms-full.txt'), 'llms.txt 未指向全文合集');
  for (const path of LEGACY_ARTICLE_PATHS) {
    const slug = path.replace('articles/', '').replace('.html', '');
    check(llms.includes(`${slug}.md`), `llms.txt 未包含 ${slug} 的 Markdown 原文地址`);
  }
}

if (existsSync(join(DIST, 'robots.txt'))) {
  const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
  for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) {
    check(robots.includes(bot), `robots.txt 未显式放行 ${bot}`);
  }
  check(robots.includes('Sitemap:'), 'robots.txt 缺少 Sitemap 声明');
}

// 文章页应带 canonical 与 JSON-LD，否则 GEO/SEO 收益打折
for (const path of LEGACY_ARTICLE_PATHS) {
  const full = join(DIST, path);
  if (!existsSync(full)) continue;
  const html = readFileSync(full, 'utf8');
  check(html.includes('rel="canonical"'), `${path} 缺少 canonical`);
  check(html.includes('application/ld+json'), `${path} 缺少 JSON-LD`);
  check(html.includes('data-pagefind-body'), `${path} 未标记为可索引正文`);
}

if (failures.length > 0) {
  console.error(`\n✗ 构建校验未通过（${failures.length} 项）：\n`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}

console.log(`✓ 构建校验通过：${REQUIRED_FILES.length} 个产物、URL 基线一致、AI 可读层完整`);
