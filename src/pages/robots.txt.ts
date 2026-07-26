import type { APIRoute } from 'astro';

/**
 * 显式放行主流 AI 爬虫。
 *
 * 默认不写通常意味着「漏配」而非「拒绝」，但部分抓取方在缺少明确规则时会保守处理；
 * 对以被引用为目标的内容站，这里应当是显式 Allow。
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
  'cohere-ai',
  'Meta-ExternalAgent',
];

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const lines: string[] = ['User-agent: *', 'Allow: /', ''];

  for (const bot of AI_CRAWLERS) {
    lines.push(`User-agent: ${bot}`, 'Allow: /', '');
  }

  if (site) {
    lines.push(`Sitemap: ${new URL(`${base}/sitemap-index.xml`, site).href}`);
    lines.push(`# 站点索引（面向大模型）: ${new URL(`${base}/llms.txt`, site).href}`);
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
