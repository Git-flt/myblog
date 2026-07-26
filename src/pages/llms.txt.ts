import type { APIRoute } from 'astro';
import { SITE, TOPICS, TOPIC_ORDER } from '../config/site';
import { getPublishedPosts, postSlug, formatDate } from '../lib/posts';

/**
 * /llms.txt —— 面向大模型的站点索引
 *
 * 目的：让 AI 抓取时一次拿到「这个站是什么、有哪些内容、正文在哪」，
 * 而不必从 HTML 模板里猜。每篇都给出 .md 原文地址。
 */
export const GET: APIRoute = async ({ site }) => {
  const posts = await getPublishedPosts();
  const origin = site ? new URL(import.meta.env.BASE_URL, site).href.replace(/\/$/, '') : '';

  const lines: string[] = [
    `# ${SITE.title}`,
    '',
    `> ${SITE.tagline}。${SITE.description}`,
    '',
    `- 作者：${SITE.author}`,
    `- 语言：${SITE.lang}`,
    `- 全文合集：${origin}/llms-full.txt`,
    `- RSS：${origin}/feed.xml`,
    '',
    '作者从事 AIOps / 大数据 20 余年，内容聚焦 AI 系统的运维与架构视角。',
    '技术方案经作者验证后发布，纯推演内容在文中标注。',
    '',
  ];

  for (const topicId of TOPIC_ORDER) {
    const topicPosts = posts.filter((post) => post.data.topic === topicId);
    if (topicPosts.length === 0) continue;

    const meta = TOPICS[topicId];
    lines.push(`## ${meta.name}`, '', meta.summary, '');

    for (const post of topicPosts) {
      const slug = postSlug(post);
      lines.push(
        `- [${post.data.title}](${origin}/articles/${slug}.html): ${post.data.excerpt}`,
        `  - 发布：${formatDate(post.data.date)}｜标签：${post.data.tags.join('、')}`,
        `  - Markdown 原文：${origin}/articles/${slug}.md`
      );
    }
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
