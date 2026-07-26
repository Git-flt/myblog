import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 拼接站点内部链接，兼容 base 子路径（GitHub Pages）与根路径（独立域名） */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return clean ? `${base}/${clean}` : `${base}/`;
}

/** URL slug：优先 frontmatter 的 slug 覆盖，否则用文件名——保持既有文章链接不变 */
export function postSlug(post: Post): string {
  return post.data.slug ?? post.id;
}

export function postUrl(post: Post): string {
  return url(`articles/${postSlug(post)}.html`);
}

/** 中英混排阅读时长估算：中文 350 字/分，英文 225 词/分 */
export function readingTime(body: string): number {
  const text = body.replace(/<[^>]*>/g, '');
  const chineseChars = (text.match(/[一-龥]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  return Math.ceil(chineseChars / 350 + englishWords / 225) || 1;
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** 已发布文章，按时间倒序 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPostsByTopic(topic: string): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter((p) => p.data.topic === topic);
}

/** 标签 → 文章数，按数量倒序 */
export async function getTagCounts(): Promise<[string, number][]> {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export async function getCategoryCounts(): Promise<[string, number][]> {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    const category = post.data.category ?? '未分类';
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}
