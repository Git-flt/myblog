import type { APIRoute } from 'astro';
import { getPublishedPosts, postSlug, formatDate } from '../../lib/posts';

/**
 * 每篇文章的 Markdown 原文端点：/articles/<slug>.md
 *
 * AI 抓取时无需从 HTML 里剥离模板噪音，直接拿到干净正文。
 * 这是被生成式引擎准确引用的前提。
 */
export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    params: { slug: postSlug(post) },
    props: { post },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const post = props.post as Awaited<ReturnType<typeof getPublishedPosts>>[number];
  const { title, date, tags, excerpt, topic } = post.data;

  const body = [
    `# ${title}`,
    '',
    `> ${excerpt}`,
    '',
    `- 发布日期：${formatDate(date)}`,
    `- 主题：${topic}`,
    `- 标签：${tags.join('、')}`,
    '',
    '---',
    '',
    post.body ?? '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
