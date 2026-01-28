# Giscus 评论系统配置指南

Giscus 是一个基于 GitHub Discussions 的评论系统，允许访客使用 GitHub 账号在你的博客上留言。

## 📋 配置步骤

### 1. 准备 GitHub 仓库

1. 创建一个**公开的** GitHub 仓库（例如：`yourusername/myblog-comments`）
2. 进入仓库的 Settings → General → Features
3. 勾选 **Discussions** 启用讨论功能

### 2. 安装 Giscus App

访问 https://github.com/apps/giscus 并点击 **Install**，授权给你的评论仓库。

### 3. 获取配置参数

1. 访问 https://giscus.app/zh-CN
2. 填写配置信息：
   - **仓库**：输入 `yourusername/myblog-comments`
   - **页面 ↔️ discussion 映射关系**：选择 `pathname`
   - **Discussion 分类**：推荐选择 `Announcements` 或 `General`
   - **主题**：选择 `light` 或 `preferred_color_scheme`

3. 页面会自动生成配置参数，记下以下内容：
   - `data-repo`
   - `data-repo-id`
   - `data-category`
   - `data-category-id`

### 4. 更新 giscus-config.js

编辑 `giscus-config.js` 文件，填入你的配置：

```javascript
module.exports = {
  repo: 'yourusername/myblog-comments',  // 替换为你的仓库
  repoId: 'R_kgDOxxxxxxx',               // 替换为你的 repoId
  category: 'General',                    // 保持不变或修改
  categoryId: 'DIC_kwDOxxxxxxx',         // 替换为你的 categoryId
  mapping: 'pathname',
  lang: 'zh-CN'
}
```

### 5. 启用评论功能

在 `publish.js` 的 HTML 模板中，找到评论部分（大约第 78-102 行），取消注释并填入配置：

```html
<script src="https://giscus.app/client.js"
    data-repo="yourusername/myblog-comments"
    data-repo-id="R_kgDOxxxxxxx"
    data-category="General"
    data-category-id="DIC_kwDOxxxxxxx"
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

### 6. 重新发布文章

```bash
npm run publish
```

## ✅ 验证配置

1. 启动本地服务器：`npm run serve`
2. 打开文章页面
3. 滚动到评论区域
4. 如果配置正确，你会看到 GitHub 登录按钮
5. 登录后可以测试发表评论

## 🎨 主题同步

博客已经内置了主题同步功能。当你切换深色/浅色模式时，Giscus 评论区会自动跟随。

如果你想修改 Giscus 的主题，可以编辑 `publish.js` 中的主题切换代码（第 164-184 行）。

## ❓ 常见问题

### Q: 评论区显示 "Discussion not found"

A: 这是正常的。第一次有人评论时，Giscus 会自动创建对应的 Discussion。

### Q: 评论区显示 "Giscus is not installed"

A: 检查以下几点：
- 仓库是否为公开
- 是否已安装 Giscus App
- repoId 和 categoryId 是否正确

### Q: 如何管理评论？

A: 所有评论都保存在 GitHub Discussions 中，你可以在仓库的 Discussions 标签页管理它们。

### Q: 评论支持 Markdown 吗？

A: 是的！Giscus 完全支持 GitHub Flavored Markdown 和 Emoji。

## 🔗 参考资源

- Giscus 官网：https://giscus.app/zh-CN
- GitHub Discussions 文档：https://docs.github.com/zh/discussions
- 问题反馈：https://github.com/giscus/giscus/discussions

---

配置完成后，你的博客就拥有了一个免费、美观、功能强大的评论系统！
