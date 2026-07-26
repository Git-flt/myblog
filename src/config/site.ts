import type { TOPIC_IDS } from '../content.config';

export const SITE = {
  title: 'King of Fish',
  logo: 'King of Fish 🐠',
  author: 'King of Fish',
  /** 定位一句话：决定读者 5 秒内对这个站的判断 */
  tagline: '从运维视角看 AI 系统',
  description:
    '20 年 AIOps / 大数据一线经验，写 AI 系统的架构、可观测性、成本与故障模式——那些只有真正运维过生产系统的人才写得出来的部分。',
  lang: 'zh-CN',
  /** 每月更新承诺，写在页面上是对自己的约束 */
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
    summary:
      'Agent 与 LLM 系统的可观测性、故障模式、成本治理、SLO 与容量规划。写 AI 的人大多没运维过生产系统，这里补上那一半。',
    primary: true,
  },
  architecture: {
    name: '架构分析与验证',
    icon: '🧭',
    summary:
      '技术选型的推演与落地验证——包括让 AI 出方案之后，我自己动手把它跑通、证伪、补全的过程。',
    primary: true,
  },
  trends: {
    name: '趋势观察',
    icon: '📡',
    summary: 'AI 行业动向的解读。辅助栏目，只写有独立判断的部分。',
    primary: false,
  },
  notes: {
    name: '学习笔记',
    icon: '📓',
    summary: '早期笔记与随笔，保留归档。',
    primary: false,
  },
};

export const TOPIC_ORDER: TopicId[] = ['aiops-x-ai', 'architecture', 'trends', 'notes'];
