// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 站点地址与子路径均可由环境变量覆盖：
//   默认沿用当前 GitHub Pages 部署（https://git-flt.github.io/myblog）
//   迁移到独立域名后只需设置 SITE_URL=https://example.com BASE_PATH=/
const SITE_URL = process.env.SITE_URL || 'https://git-flt.github.io';
const BASE_PATH = process.env.BASE_PATH || '/myblog';
/** 首页绝对路径（含 base），供重定向目标使用 */
const HOME_PATH = `${BASE_PATH.replace(/\/$/, '')}/`;

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'ignore',
  // 关键：保持 /articles/<slug>.html 这类既有 URL 不变，避免外链与收录失效
  build: {
    format: 'file',
  },
  // 旧站遗留但已无源文件的页面，重定向而非直接 404
  // 注意：key 不带扩展名（build.format='file' 会自动补 .html）；
  // 目标地址不会自动加 base，需显式拼接
  redirects: {
    '/articles/hello-world': HOME_PATH,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  markdown: {
    gfm: true,
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
