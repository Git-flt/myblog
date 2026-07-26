// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 站点地址与子路径由环境变量决定，同一份代码可部署到不同平台：
//
//   Vercel（目标平台）  零配置——自动读取 VERCEL_PROJECT_PRODUCTION_URL，base 为根路径
//   GitHub Pages        由 deploy.yml 显式传入 SITE_URL / BASE_PATH=/myblog
//   自定义域名          设置 SITE_URL=https://example.com 即可
const SITE_URL =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');
// 默认根路径：Vercel / 自定义域名的常态。GitHub Pages 的子路径由 workflow 显式覆盖
const BASE_PATH = process.env.BASE_PATH || '/';
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
