import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 主题聚类（topic）
 *
 * 站点按主题组织而非时间流：时间流会让好文章随时间沉底，
 * 主题聚类让它持续被读到、也持续被 AI 引用。
 *
 * 新增主题时同步更新 src/config/site.ts 的 TOPICS 描述。
 */
export const TOPIC_IDS = ['aiops-x-ai', 'architecture', 'trends', 'notes'] as const;

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    // 强制 Date：openclaw 那篇原先缺失 date，schema 会在构建期直接拦下
    date: z.coerce.date(),
    // 强制数组：原先有文件用逗号字符串、有文件用数组，格式不一致
    tags: z.array(z.string()).default([]),
    excerpt: z.string().min(1),
    topic: z.enum(TOPIC_IDS),
    // 可选：覆盖由文件名推导的 URL slug（用于保持既有链接）
    slug: z.string().optional(),
    category: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
