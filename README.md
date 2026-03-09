# MyBlog

个人博客静态站点，支持 Markdown 发布、首页聚合、RSS、站内搜索（Pagefind）与 GitHub Pages 自动部署。

## 当前能力

- Markdown (`drafts/*.md`) → HTML (`articles/*.html`)
- 自动更新首页、RSS（`feed.xml`）、Sitemap（`sitemap.xml`）
- 站内搜索（Pagefind）
- 复古主题 UI（含首页卡片紧凑视图）

## 快速开始

```bash
cd /opt/project/myblog
npm ci
npm run build
npm run serve
# http://localhost:8080
```

## 常用命令

```bash
# 发布文章（不含搜索索引）
npm run publish

# 完整构建（发布 + 搜索索引）
npm run build

# 本地预览
npm run serve

# 代码校验
npm run lint
npm run test
npm run verify
```

## 写作流程

1. 在 `drafts/` 新建 Markdown（含 frontmatter）
2. 运行 `npm run build`
3. 检查 `index.html`、`articles/`、`feed.xml`、`sitemap.xml`
4. 提交并推送到 `main`（GitHub Actions 自动部署）

## 部署

- GitHub Pages：由 `.github/workflows/deploy.yml` 自动部署
- 生产地址：`https://git-flt.github.io/myblog`

## 目录结构

- `drafts/`：Markdown 草稿
- `articles/`：生成后的文章页面
- `publish.js`：发布主脚本
- `css/`、`js/`：前端资源
- `_pagefind/`：搜索索引产物
