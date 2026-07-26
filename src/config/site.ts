import type { TOPIC_IDS } from '../content.config';

export const SITE = {
  title: 'King of Fish',
  logo: 'King of Fish 🐠',
  author: 'King of Fish',
  /** 定位一句话：决定读者 5 秒内对这个站的判断 */
  tagline: '从运维视角看 AI 系统',
  description: '记录 AI 系统在生产环境里的架构、可观测性、成本与故障处理。',
  lang: 'zh-CN',
  /** 更新节奏：只在「关于」页低调提及，不放首页 */
  cadence: '每月至少 2 篇',
  giscus: {
    repo: 'Git-flt/myblog',
    repoId: 'R_kgDORDJ7tw',
    category: 'Announcements',
    categoryId: 'DIC_kwDORDJ7t84C1pO1',
  },
} as const;

type TopicId = (typeof TOPIC_IDS)[number];

export const TOPICS: Record<
  TopicId,
  { name: string; icon: string; summary: string; primary: boolean }
> = {
  'aiops-x-ai': {
    name: '运维视角看 AI 系统',
    icon: '🛠️',
    summary: 'Agent 与 LLM 系统的可观测性、故障模式、成本治理与容量规划。',
    primary: true,
  },
  architecture: {
    name: '架构分析与验证',
    icon: '🧭',
    summary: '技术选型的推演，以及自己动手把方案跑通、证伪、补全的记录。',
    primary: true,
  },
  trends: {
    name: '趋势观察',
    icon: '📡',
    summary: 'AI 行业动向的解读。',
    primary: false,
  },
  notes: {
    name: '学习笔记',
    icon: '📓',
    summary: '早期笔记与随笔。',
    primary: false,
  },
};

export const TOPIC_ORDER: TopicId[] = ['aiops-x-ai', 'architecture', 'trends', 'notes'];
