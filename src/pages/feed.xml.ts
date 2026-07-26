import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config/site';
import { getPublishedPosts, postUrl } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return rss({
    title: `${SITE.title} · ${SITE.tagline}`,
    description: SITE.description,
    site: context.site!,
    customData: `<language>${SITE.lang}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: postUrl(post),
      categories: post.data.tags,
    })),
  });
}
