# MyBlog

个人技术写作站 —— **从运维视角看 AI 系统**。

基于 Astro 5 构建，按主题聚类组织内容，并提供面向大模型的机器可读层。

## 定位

- **文字为主**：内容是 AI 系统的架构、可观测性、成本与故障模式，来自 20 余年 AIOps / 大数据一线经验
- **更新节奏**：每月至少 2 篇
- **内容红线**：AI 只做检索整理、结构建议、润色、摘要与配图；观点、判断、事实核查与方案验证由本人完成，不发布未经亲自验证的技术方案

## 快速开始

```bash
npm ci
npm run dev        # http://localhost:4321
npm run build      # 构建 + 生成搜索索引，输出到 dist/
npm run preview    # 预览构建产物
npm run check      # 内容 schema 与类型校验
npm run verify     # 校验构建产物与 URL 基线
```

## 写作与发布

```bash
# 1. 新建草稿（自动生成合规 frontmatter）
npm run new -- "文章标题"
npm run new -- "文章标题" --topic architecture     # 指定主题
npm run new -- "文章标题" --slug custom-url        # 指定 URL

# 2. 写。期间本地预览
npm run dev

# 3. 发布：把 frontmatter 里的 draft 改成 false
# 4. 推送
git add . && git commit -m "post: 文章标题" && git push
```

推送到 `main` 后自动构建部署，无需手动执行构建命令。

`draft: true` 的文章不会出现在站点、RSS、sitemap 与 llms.txt 中，可以放心提交。

### frontmatter 字段

schema 在构建期校验，缺字段或格式错误会直接构建失败：

```yaml
---
title: 文章标题              # 必填
date: 2026-07-26            # 必填
tags: [标签A, 标签B]         # 必填，必须是数组
excerpt: 一句话摘要          # 必填，出现在首页卡片 / RSS / llms.txt
topic: aiops-x-ai           # 必填，见下方主题列表
category: 可选分类
slug: 可选，覆盖 URL 中的文件名
draft: false                # true 则不发布
---
```

## 主题（topic）

内容按主题聚类而非时间流——时间流会让好文章随时间沉底。

| topic | 名称 | 说明 |
|-------|------|------|
| `aiops-x-ai` | 运维视角看 AI 系统 | 主线。可观测性、故障模式、成本治理、SLO、容量规划 |
| `architecture` | 架构分析与验证 | 主线。选型推演与落地验证 |
| `trends` | 趋势观察 | 辅助。只写有独立判断的部分 |
| `notes` | 学习笔记 | 归档 |

新增主题需同步修改 `src/content.config.ts`（枚举）与 `src/config/site.ts`（名称与描述）。

## AI 可读层

面向生成式引擎的抓取与引用：

- `/llms.txt` —— 站点索引：定位、主题分组、逐篇摘要与原文地址
- `/llms-full.txt` —— 全部文章正文合集，一次抓取拿走全站内容
- `/articles/<slug>.md` —— 每篇文章的 Markdown 原文端点
- `/robots.txt` —— 显式放行 GPTBot / ClaudeBot / PerplexityBot / Google-Extended 等
- 每页 JSON-LD（`BlogPosting` / `Blog`）与 canonical

## 目录结构

```
src/
├── content/posts/     # 文章 Markdown（唯一内容来源）
├── content.config.ts  # 内容 schema（zod 校验）
├── config/site.ts     # 站点信息与主题定义
├── layouts/           # BaseLayout / PostLayout
├── components/        # 页头页脚、TOC、搜索、分享等
├── pages/             # 路由（含 feed.xml / llms.txt / robots.txt 等端点）
├── lib/posts.ts       # 文章查询与 URL 工具
└── styles/style.css   # 复古纸感主题
scripts/verify-build.mjs   # 构建产物与 URL 基线校验
```

## 部署

站点地址与子路径由环境变量决定，同一份代码可部署到不同平台：

| 变量 | 作用 | 默认值 |
|------|------|--------|
| `SITE_URL` | 站点绝对地址，影响 canonical / sitemap / llms.txt | Vercel 上自动取 `VERCEL_PROJECT_PRODUCTION_URL`，本地为 `http://localhost:4321` |
| `BASE_PATH` | 子路径 | `/` |

### 当前：GitHub Pages

`.github/workflows/deploy.yml` 在推送到 `main` 后构建并发布，显式传入子路径：

```yaml
SITE_URL: https://git-flt.github.io
BASE_PATH: /myblog
```

生产地址：`https://git-flt.github.io/myblog`

### 目标：Vercel

`vercel.json` 已就绪（构建命令、输出目录、`llms.txt` 与 `.md` 端点的 Content-Type、静态资源缓存）。
Astro 静态输出在 Vercel 上零配置运行，**不需要设置任何环境变量**——`BASE_PATH` 默认即为根路径。

切换步骤：

```bash
npx vercel link       # 关联项目
npx vercel --prod     # 首次部署
```

之后在 Vercel 面板开启 Git 集成，推送 `main` 即自动部署。绑定自定义域名后，
在项目设置里加环境变量 `SITE_URL=https://你的域名` 即可（不加则用 Vercel 分配的域名）。

**切换时注意**：站点从 `git-flt.github.io/myblog/...` 变为 `你的域名/...`，
所有旧链接会失效。如果在意既有外链，保留 GitHub Pages 的部署作为跳转层，
不要直接停用。

### Cloudflare Pages（备选）

构建命令 `npm run build`、输出目录 `dist`，同样零配置。`vercel.json` 会被忽略，
`Content-Type` 与缓存策略需改用 `_headers` 文件。

## URL 稳定性

文章路径 `/articles/<slug>.html` 是从旧发布管道继承的基线，**不可变更**——变更会使外链、收藏与既有收录全部失效。
`scripts/verify-build.mjs` 在 CI 中逐一比对这些路径，构建产物缺失即失败。

## 旧管道

迁移前的自研管道（`publish.js` / `server.js` / `test.js` 及根目录下的生成产物）暂时保留作为回滚路径，
对应 npm 脚本加了 `legacy:` 前缀。确认新站稳定后可整体删除。
