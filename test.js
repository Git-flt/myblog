/**
 * 博客测试脚本
 * 运行方式: node test.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8080';
const PROJECT_ROOT = path.join(__dirname);

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

let passed = 0;
let failed = 0;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function test(name, condition) {
  if (condition) {
    log(`✓ ${name}`, 'green');
    passed++;
  } else {
    log(`✗ ${name}`, 'red');
    failed++;
  }
}

// 测试1: 检查文件结构
function testFileStructure() {
  log('\n📁 测试文件结构...', 'cyan');

  const requiredFiles = [
    'index.html',
    'css/style.css',
    'articles/hello-world.html',
    'articles/web-dev-notes.html',
    'articles/learning-notes.html',
    'nginx.conf',
    'test.js'
  ];

  requiredFiles.forEach(file => {
    const filePath = path.join(PROJECT_ROOT, file);
    test(`文件存在: ${file}`, fs.existsSync(filePath));
  });
}

// 测试2: 检查HTML内容
function testHtmlContent() {
  log('\n📄 测试HTML内容...', 'cyan');

  const indexHtml = fs.readFileSync(path.join(PROJECT_ROOT, 'index.html'), 'utf8');

  test('index.html 包含标题', indexHtml.includes('<title>King of Fish - 科技前沿与生活探索</title>'));
  test('index.html 包含导航', indexHtml.includes('class="nav"'));
  test('index.html 包含文章列表', indexHtml.includes('class="article-list"'));
  test('index.html 包含关于 section', indexHtml.includes('id="about"'));
  test('index.html 包含页脚', indexHtml.includes('class="footer"'));
  test('index.html 引用了CSS', indexHtml.includes('css/style.css'));
  test('index.html 包含4篇文章链接', (
    indexHtml.includes('hello-world.html') &&
        indexHtml.includes('web-dev-notes.html') &&
        indexHtml.includes('learning-notes.html') &&
        indexHtml.includes('我的第一篇博客.html')
  ));
}

// 测试3: 检查CSS内容
function testCssContent() {
  log('\n🎨 测试CSS内容...', 'cyan');

  const css = fs.readFileSync(path.join(PROJECT_ROOT, 'css/style.css'), 'utf8');

  test('CSS定义了主色调', css.includes('--primary-color'));
  test('CSS定义了辅助色', css.includes('--secondary-color'));
  test('CSS包含响应式设计', css.includes('@media'));
  test('CSS包含动画效果', css.includes('transition'));
  test('CSS包含阴影效果', css.includes('box-shadow'));
  test('CSS定义了字体', css.includes('font-family'));
}

// 测试4: 检查文章页面
function testArticlePages() {
  log('\n📝 测试文章页面...', 'cyan');

  const articles = ['hello-world.html', 'web-dev-notes.html', 'learning-notes.html'];

  articles.forEach(article => {
    const content = fs.readFileSync(path.join(PROJECT_ROOT, 'articles', article), 'utf8');

    test(`文章 ${article} 有正确的DOCTYPE`, content.includes('<!DOCTYPE html>'));
    test(`文章 ${article} 引用了CSS`, content.includes('../css/style.css'));
    test(`文章 ${article} 有导航栏`, content.includes('class="nav"'));
    test(`文章 ${article} 可返回首页`, content.includes('../index.html'));
    test(`文章 ${article} 有页脚`, content.includes('class="footer"'));
  });
}

// 测试5: 检查Nginx配置
function testNginxConfig() {
  log('\n⚙️  测试Nginx配置...', 'cyan');

  const nginxConf = fs.readFileSync(path.join(PROJECT_ROOT, 'nginx.conf'), 'utf8');

  test('Nginx配置了监听端口', nginxConf.includes('listen 80'));
  test('Nginx配置了根目录', nginxConf.includes('root'));
  test('Nginx配置了默认首页', nginxConf.includes('index index.html'));
  test('Nginx配置了缓存', nginxConf.includes('expires'));
  test('Nginx配置了安全头', nginxConf.includes('X-Frame-Options'));
}

// 测试6: 本地HTTP测试 (需要先启动nginx)
function testHttpServer() {
  log('\n🌐 测试HTTP服务器...', 'cyan');

  return new Promise((resolve) => {
    const testUrls = [
      '/',
      '/css/style.css',
      '/articles/hello-world.html'
    ];

    let completed = 0;
    let serverOk = true;

    testUrls.forEach(url => {
      http.get(`${BASE_URL}${url}`, (res) => {
        const statusOk = res.statusCode === 200;
        test(`HTTP ${url} - 状态码: ${res.statusCode}`, statusOk);

        if (!statusOk) serverOk = false;

        completed++;
        if (completed === testUrls.length) {
          if (serverOk) {
            log('✓ HTTP服务器测试全部通过', 'green');
          } else {
            log('✗ HTTP服务器测试部分失败 (请确保Nginx已启动)', 'yellow');
          }
          resolve();
        }
      }).on('error', (err) => {
        log(`✗ HTTP ${url} - 连接失败: ${err.message}`, 'red');
        serverOk = false;
        completed++;
        if (completed === testUrls.length) resolve();
      });
    });
  });
}

// 运行所有测试
async function runTests() {
  log('='.repeat(50), 'cyan');
  log('  博客项目测试套件', 'cyan');
  log('='.repeat(50), 'cyan');

  // 基础测试
  testFileStructure();
  testHtmlContent();
  testCssContent();
  testArticlePages();
  testNginxConfig();

  // HTTP测试
  await testHttpServer();

  // 汇总
  log('\n' + '='.repeat(50), 'cyan');
  log(`  测试结果: ${passed} 通过, ${failed} 失败`, 'cyan');
  log('='.repeat(50), 'cyan');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
