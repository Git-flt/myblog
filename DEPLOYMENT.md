# 网站部署指南

本文档介绍如何将博客部署到公共网站。

---

## 方案对比

| 方案 | 费用 | 流量限制 | 自定义域名 | 难度 | 推荐指数 |
|------|------|----------|-----------|------|----------|
| GitHub Pages | 免费 | 100GB/月 | ✅ | ⭐ | ⭐⭐⭐⭐⭐ |
| Netlify | 免费 | 100GB/月 | ✅ | ⭐⭐ | ⭐⭐⭐⭐ |
| Vercel | 免费 | 100GB/月 | ✅ | ⭐⭐ | ⭐⭐⭐⭐ |
| Cloudflare Pages | 免费 | 无限制 | ✅ | ⭐⭐ | ⭐⭐⭐⭐ |

---

## 🥇 方案1：GitHub Pages（最推荐）

### 优点
- 完全免费，无流量限制（实际上限100GB/月）
- 自动HTTPS
- 与Git无缝集成
- 部署简单，自动化

### 部署步骤

#### 1. 创建GitHub仓库

```bash
# 在本地初始化Git（如果还没有）
git init

# 添加所有文件
git add .

# 创建首次提交
git commit -m "Initial commit: myblog"

# 在GitHub上创建新仓库（通过网页或CLI）
# 然后关联远程仓库
git remote add origin https://github.com/你的用户名/myblog.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

#### 2. 启用GitHub Pages

1. 进入GitHub仓库页面
2. 点击 **Settings** > **Pages**
3. 在 **Source** 下选择：
   - **Source**: GitHub Actions
4. 点击 **Save**

#### 3. 自动部署（已配置）

项目已包含 `.github/workflows/deploy.yml` 配置文件，每次推送代码到main分支时会自动：
- 安装依赖
- 运行 `npm run publish` 转换文章
- 部署到GitHub Pages

#### 4. 访问你的网站

部署完成后，网站地址为：
```
https://你的用户名.github.io/myblog/
```

### 自定义域名（可选）

1. 购买域名（推荐：Namesilo、Cloudflare、阿里云等）
2. 在GitHub仓库Settings > Pages中设置Custom domain
3. 在域名DNS中添加CNAME记录指向 `你的用户名.github.io`
4. 等待DNS生效（几分钟到几小时）

---

## 🥈 方案2：Netlify

### 优点
- 免费100GB流量/月
- 自动HTTPS
- 持续部署
- 表单处理、函数等高级功能

### 部署步骤

#### 方法1：通过Git（推荐）

1. 访问 [Netlify](https://www.netlify.com/)
2. 注册/登录账号
3. 点击 **Add new site** > **Import an existing project**
4. 选择 GitHub 并授权
5. 选择你的仓库
6. 配置构建设置：
   - **Build command**: `npm run publish`
   - **Publish directory**: `/`
7. 点击 **Deploy site**

#### 方法2：拖拽部署

1. 访问 [Netlify Drop](https://app.netlify.com/drop)
2. 直接拖拽整个项目文件夹
3. 部署完成

### 访问网站

Netlify会生成一个随机域名：
```
https://随机名称.netlify.app
```

可以在Site settings中自定义子域名或绑定自己的域名。

---

## 🥉 方案3：Vercel

### 优点
- 免费100GB流量/月
- 部署速度快
- 全球CDN
- 优秀的开发体验

### 部署步骤

1. 访问 [Vercel](https://vercel.com/)
2. 使用GitHub账号登录
3. 点击 **Add New** > **Project**
4. 导入GitHub仓库
5. 配置：
   - **Framework Preset**: Other
   - **Build Command**: `npm run publish`
   - **Output Directory**: `.`
6. 点击 **Deploy**

### 访问网站

```
https://你的项目名.vercel.app
```

---

## 🏆 方案4：Cloudflare Pages

### 优点
- 完全免费，无限流量
- 全球CDN，速度快
- 自动HTTPS
- 与Cloudflare其他服务集成

### 部署步骤

1. 访问 [Cloudflare Pages](https://pages.cloudflare.com/)
2. 登录/注册Cloudflare账号
3. 连接GitHub账号
4. 选择仓库
5. 配置构建：
   - **Build command**: `npm run publish`
   - **Build output directory**: `/`
6. 点击 **Save and Deploy**

### 访问网站

```
https://你的项目名.pages.dev
```

---

## 📋 部署前检查清单

在部署前，请确保：

- [ ] 所有文章已转换（运行 `npm run publish`）
- [ ] 本地测试通过（运行 `npm run test`）
- [ ] 更新 `publish.js` 中的 `siteUrl`（第252行）
- [ ] 如果使用Giscus评论，配置好参数
- [ ] 检查 `.gitignore` 是否正确

---

## 🔄 日常更新流程

### 写新文章

```bash
# 1. 在drafts目录创建.md文件
# 2. 转换为HTML
npm run publish

# 3. 本地预览
npm run serve

# 4. 提交到Git
git add .
git commit -m "新增文章: 文章标题"
git push

# GitHub Actions会自动部署
```

---

## 💡 性价比建议

**个人博客推荐顺序：**

1. **GitHub Pages** - 最简单，完全免费，推荐首选
2. **Cloudflare Pages** - 无限流量，速度快
3. **Netlify** - 功能强大，部署简单
4. **Vercel** - 开发体验好

**如果：**
- 只是写博客 → GitHub Pages
- 需要更快的访问速度（中国） → Cloudflare Pages
- 需要表单、函数等功能 → Netlify
- 是Next.js等框架项目 → Vercel

---

## 🌍 域名购买建议

如果要使用自定义域名：

| 域名商 | 价格（.com首年） | 续费价格 | 推荐度 |
|--------|-----------------|----------|--------|
| Namesilo | ~$8.99 | ~$10.99 | ⭐⭐⭐⭐⭐ |
| Cloudflare | $9.77 | $9.77 | ⭐⭐⭐⭐⭐ |
| 阿里云 | ¥55 | ¥69 | ⭐⭐⭐⭐ |
| 腾讯云 | ¥23（首年优惠） | ¥69 | ⭐⭐⭐ |

**推荐：** Cloudflare或Namesilo（价格透明，无隐藏费用）

---

## ❓ 常见问题

### 1. 网站404怎么办？

**GitHub Pages:**
- 检查仓库Settings > Pages是否启用
- 确认部署完成（Actions标签查看）

**Netlify/Vercel:**
- 检查构建日志
- 确认Build command和Output directory正确

### 2. 如何加速访问（中国大陆）？

1. 使用Cloudflare CDN
2. 使用国内CDN（如阿里云、腾讯云）
3. 使用CDN加速服务（需备案）

### 3. 如何添加百度/Google收录？

部署后：
1. 提交sitemap到搜索引擎
2. 添加robots.txt
3. 在网站添加统计代码

---

## 📞 获取帮助

遇到问题？
- 查看 [GitHub Issues](https://github.com/你的用户名/myblog/issues)
- 参考各平台的官方文档
- 搜索相关错误信息

---

**祝你部署顺利！🎉**
