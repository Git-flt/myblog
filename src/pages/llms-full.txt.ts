import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { getPublishedPosts, postSlug, formatDate } from '../lib/posts';

/** /llms-full.txt —— 全部文章正文拼接，供 AI 一次抓取全站内容 */
export const GET: APIRoute = async ({ site }) => {
  const posts = await getPublishedPosts();
  const origin = site ? new URL(import.meta.env.BASE_URL, site).href.replace(/\/$/, '') : '';

  const parts: string[] = [
    `# ${SITE.title} —— 全文合集`,
    '',
    `> ${SITE.tagline}。${SITE.description}`,
    '',
    `作者：${SITE.author}｜文章数：${posts.length}｜生成时间：${new Date().toISOString()}`,
    '',
    '---',
    '',
  ];

  for (const post of posts) {
    const slug = postSlug(post);
    parts.push(
      `# ${post.data.title}`,
      '',
      `来源：${origin}/articles/${slug}.html`,
      `发布：${formatDate(post.data.date)}｜标签：${post.data.tags.join('、')}`,
      '',
      post.body ?? '',
      '',
      '---',
      ''
    );
  }

  return new Response(parts.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
