/**
 * Giscus 评论系统配置
 *
 * 配置说明：
 * 1. 访问 https://github.com/apps/giscus
 * 2. 安装 Giscus 应用到你的 GitHub 仓库
 * 3. 配置完成后，填写下方的配置参数
 *
 * 安装步骤：
 * - 仓库必须是公开的
 * 在仓库的 Discussions 功能中启用
 * - 选择一个分类用于评论
 * - 复制配置参数到下方
 */

/**
 * Giscus 评论系统配置对象
 * 注意：此文件仅作为配置参考，实际配置需在 publish.js 中硬编码或通过环境变量注入
 */
const giscusConfig = {
  // GitHub 仓库信息
  repo: '', // 格式: '你的GitHub用户名/仓库名'，例如: 'username/myblog'

  // 仓库 ID（在 Giscus 配置页面获取）
  repoId: '', // 格式: 'R_kgDOXXXXXXXXX'

  // 分类信息
  category: 'General', // Discussions 分类名称
  categoryId: '', // 分类 ID（在 Giscus 配置页面获取），格式: 'DIC_kwDOXXXXXXXXX'

  // 文章映射方式
  mapping: 'pathname', // 'pathname' 使用 URL 路径作为唯一标识，'title' 使用文章标题

  // 严格模式（如果为 '1'，则在找不到对应讨论时不显示评论）
  strict: '0',

  // 是否启用表情反应（点赞、大笑等）
  reactionsEnabled: '1',

  // 是否发送元数据
  emitMetadata: '0',

  // 输入框位置
  inputPosition: 'top', // 'top' 或 'bottom'

  // 主题（可选）
  theme: 'light', // 'light', 'dark', 'dark_dimmed', 'dark_high_contrast', 'transparent_dark', 'preferred_color_scheme'

  // 语言
  lang: 'zh-CN',

  // 加载方式
  loading: 'lazy' // 'lazy' 或 'eager'
};

// 如果在 Node.js 环境中运行（用于服务端配置）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = giscusConfig;
}

/**
 * 使用示例：
 *
 * 1. 配置完成 Giscus 后，取消下方注释：
 *
 * const giscus = require('./giscus-config');
 *
 * 2. 在 HTML 模板中添加：
 *
 * <script src="https://giscus.app/client.js"
 *     data-repo="${giscus.repo}"
 *     data-repo-id="${giscus.repoId}"
 *     data-category="${giscus.category}"
 *     data-category-id="${giscus.categoryId}"
 *     data-mapping="${giscus.mapping}"
 *     data-strict="${giscus.strict}"
 *     data-reactions-enabled="${giscus.reactionsEnabled}"
 *     data-emit-metadata="${giscus.emitMetadata}"
 *     data-input-position="${giscus.inputPosition}"
 *     data-theme="${giscus.theme}"
 *     data-lang="${giscus.lang}"
 *     data-loading="${giscus.loading}"
 *     crossorigin="anonymous"
 *     async>
 * </script>
 *
 * 3. 注意：首次使用时，每篇文章需要至少访问一次，Giscus 会自动创建对应的 Discussion
 *
 * 常见问题：
 * - 评论不显示：检查配置参数是否正确，仓库是否公开
 * - 主题不跟随系统：在主题切换函数中添加 Giscus 主题更新逻辑
 * - 想要深色模式评论：在 toggleTheme 函数中更新 data-theme 属性
 */
