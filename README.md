# MyBlog - 多平台内容创作与发布系统

一个现代化的个人博客系统，支持Markdown写作、深色模式、评论点赞系统，并可扩展多平台发布。

## ✨ 2026年标准功能

### 🌓 深色模式
- 完美支持深色/浅色主题切换
- 自动保存用户偏好到本地存储
- 页面加载时自动应用上次选择的主题
- 平滑的过渡动画

### 👍 点赞系统
- 基于LocalStorage的轻量级点赞功能
- 点赞状态持久化保存
- 实时更新点赞计数
- 精美的点赞按钮动画效果

### 💬 评论系统（Giscus）
- 基于GitHub Discussions的评论系统
- 完全免费，无广告
- 支持Markdown语法
- 支持表情反应
- 自动适配深色模式

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 写作

在 `drafts/` 目录中创建Markdown文件，或使用模板：

```bash
# 复制模板
cp drafts/文章模板.md drafts/我的新文章.md

# 编辑文章
nano drafts/我的新文章.md
```

### 3. 发布

```bash
# 生成HTML并更新首页
npm run publish

# 本地预览
npm run serve

# 在浏览器打开 http://localhost:8080
```

## 📖 文章格式

每篇文章使用YAML frontmatter配置元数据：

```markdown
---
title: 文章标题
date: 2026-01-08
tags: [标签1, 标签2]
excerpt: 文章摘要，会显示在首页
slug: my-article-slug  # 可选，文件名会自动生成
---

## 一级标题

这里是正文内容，支持 **Markdown** 语法。

### 二级标题

- 支持列表
- 支持有序列表

\`\`\`javascript
// 代码块
function hello() {
    console.log('Hello World!');
}
\`\`\`
```

## 🎨 功能使用指南

### 深色模式

#### 自动切换
- 点击页面右下角的 🌓 按钮即可切换主题
- 主题偏好会自动保存到浏览器
- 下次访问时自动应用

#### 手动调用
```javascript
// 切换主题
toggleTheme();

// 应用深色模式
document.body.classList.add('dark-mode');

// 移除深色模式
document.body.classList.remove('dark-mode');
```

### 点赞系统

#### 使用方式
1. 阅读文章时，点击底部的 👍 点赞按钮
2. 点赞状态会保存到本地浏览器
3. 刷新页面后点赞状态保持

#### 数据存储
点赞数据存储在LocalStorage中，键名为 `blog_likes`：

```javascript
// 查看所有点赞
const likes = JSON.parse(localStorage.getItem('blog_likes') || '{}');

// 检查某篇文章是否被点赞
const isLiked = !!likes['article-slug.html'];

// 获取点赞数
const count = likes['article-slug.html'] ? 1 : 0;
```

### 评论系统（Giscus）

#### 配置步骤

1. **准备GitHub仓库**
   - 确保你的博客仓库是公开的
   - 在仓库设置中启用Discussions功能

2. **安装Giscus应用**
   - 访问 https://github.com/apps/giscus
   - 点击"Install"安装到你的仓库
   - 选择你的博客仓库

3. **配置Giscus**
   - 在Giscus配置页面选择语言（建议选择"简体中文"）
   - 选择Discussions分类（推荐"General"）
   - 复制生成的配置参数

4. **更新配置文件**
   编辑 `giscus-config.js`，填入配置参数：

   ```javascript
   module.exports = {
     repo: '你的GitHub用户名/myblog',  // 例如: 'john/myblog'
     repoId: 'R_kgDOXXXXXXXXX',          // 从配置页面复制
     category: 'General',                // 分类名称
     categoryId: 'DIC_kwDOXXXXXXXXX',    // 分类ID
     // ... 其他配置保持默认
   };
   ```

5. **启用评论**
   编辑 `publish.js`，找到评论部分的注释：
   ```javascript
   <!-- Giscus 评论系统
   注意：首次使用需要配置 giscus-config.js
   配置完成后，取消下方注释并替换配置参数
   -->
   ```

   将注释取消，并添加配置参数：

   ```javascript
   <script src="https://giscus.app/client.js"
       data-repo=""
       data-repo-id=""
       data-category=""
       data-category-id=""
       data-mapping="pathname"
       data-strict="0"
       data-reactions-enabled="1"
       data-emit-metadata="0"
       data-input-position="top"
       data-theme="light"
       data-lang="zh-CN"
       data-loading="lazy"
       crossorigin="anonymous"
       async>
   </script>
   ```

6. **重新发布**
   ```bash
   npm run publish
   ```

#### 注意事项
- 每篇文章首次访问时，Giscus会自动创建对应的Discussion
- 评论数据存储在你的GitHub仓库的Discussions中
- 支持Markdown语法、代码高亮、表情等
- 评论需要GitHub账号登录才能发表

## 📁 项目结构

```
myblog/
├── articles/              # 发布的HTML文章
├── css/
│   └── style.css         # 主样式文件（含深色模式）
├── drafts/               # Markdown源文件
│   ├── 文章模板.md
│   └── 我的第一篇博客.md
├── giscus-config.js      # Giscus评论系统配置
├── index.html            # 首页
├── publish.js            # 发布脚本
├── server.js             # 开发服务器
├── package.json           # 项目配置
└── README.md             # 本文件
```

## 🛠️ 开发命令

```bash
# 发布文章
npm run publish

# 本地预览
npm run serve

# 运行测试
npm run test
```

## 🎯 2026年标准功能清单

- ✅ 深色模式支持
- ✅ 响应式设计
- ✅ 点赞系统
- ✅ 评论系统（Giscus）
- ✅ Markdown写作
- ✅ 自动发布
- ✅ SEO友好
- ✅ 本地预览
- ⏳ 多平台发布（规划中）
- ⏳ 图片优化（规划中）
- ⏳ 搜索功能（规划中）

## 🔧 自定义配置

### 修改主题颜色

编辑 `css/style.css` 的CSS变量：

```css
:root {
    --primary-color: #2c3e50;      /* 主色调 */
    --secondary-color: #3498db;    /* 强调色 */
    --text-color: #333;             /* 文本颜色 */
    --bg-color: #f8f9fa;           /* 背景颜色 */
    /* ... 更多变量 */
}
```

### 修改深色模式颜色

```css
:root.dark-mode {
    --primary-color: #ecf0f1;
    --text-color: #ecf0f1;
    --bg-color: #2c3e50;
    /* ... 更多变量 */
}
```

## 📱 部署

### 使用deploy.sh脚本

```bash
# 部署到远程服务器
./deploy.sh <服务器IP> <用户名> [域名]

# 示例
./deploy.sh 123.456.789.0 root myblog.example.com
```

### 手动部署

1. 运行 `npm run publish` 生成HTML
2. 将 `articles/`, `css/`, `index.html` 上传到服务器
3. 配置Nginx或Caddy

## 🐛 常见问题

### Q: 深色模式不生效？
A: 检查浏览器是否支持CSS变量，清空缓存后重试。

### Q: 点赞数不显示？
A: 确保LocalStorage可用，检查浏览器控制台是否有错误。

### Q: 评论不显示？
A:
1. 确认 `giscus-config.js` 配置正确
2. 确认GitHub仓库是公开的
3. 确认仓库中已启用Discussions功能
4. 检查浏览器控制台是否有错误

### Q: 评论主题不跟随深色模式？
A: 确认 `publish.js` 中的 `updateGiscusTheme()` 函数已正确配置。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📮 联系方式

如有问题，请通过GitHub Issues联系。

---

**享受写作的乐趣！** ✍️🎉
