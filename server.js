const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;
const SERVER_STARTED_AT = Date.now();

const metrics = {
  requestsTotal: 0,
  responses2xx: 0,
  responses4xx: 0,
  responses5xx: 0
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function recordStatus(statusCode) {
  if (statusCode >= 200 && statusCode < 300) {
    metrics.responses2xx += 1;
  } else if (statusCode >= 400 && statusCode < 500) {
    metrics.responses4xx += 1;
  } else if (statusCode >= 500) {
    metrics.responses5xx += 1;
  }
}

const server = http.createServer((req, res) => {
  try {
    metrics.requestsTotal += 1;
    const rawUrl = req.url || '/';
    const pathname = decodeURIComponent(rawUrl.split('?')[0]);

    if (pathname === '/health') {
      const body = JSON.stringify({
        status: 'ok',
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
      });
      recordStatus(200);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(body);
      return;
    }

    if (pathname === '/metrics-lite') {
      const mem = process.memoryUsage();
      const uptimeSeconds = Math.floor((Date.now() - SERVER_STARTED_AT) / 1000);
      const lines = [
        `uptime_seconds ${uptimeSeconds}`,
        `requests_total ${metrics.requestsTotal}`,
        `responses_2xx ${metrics.responses2xx}`,
        `responses_4xx ${metrics.responses4xx}`,
        `responses_5xx ${metrics.responses5xx}`,
        `memory_rss_bytes ${mem.rss}`,
        `memory_heap_used_bytes ${mem.heapUsed}`
      ];
      recordStatus(200);
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`${lines.join('\n')}\n`);
      return;
    }

    // 解码URL（处理中文路径）
    let filePath = path.join(ROOT, pathname === '/' ? 'index.html' : pathname);

    // 安全检查：防止路径遍历攻击
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(ROOT)) {
      console.warn(`[安全警告] 拒绝访问: ${rawUrl}`);
      recordStatus(403);
      res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>403 - 禁止访问</h1>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        console.error(`[404] ${rawUrl} - ${err.message}`);
        recordStatus(404);
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - 页面未找到</h1>');
      } else {
        console.log(`[200] ${rawUrl}`);
        recordStatus(200);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  } catch (error) {
    console.error(`[错误] ${req.url} - ${error.message}`);
    recordStatus(500);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>500 - 服务器错误</h1>');
  }
});

server.listen(PORT, () => {
  console.log('\n========================================');
  console.log('  博客测试服务器已启动');
  console.log(`  本地访问: http://localhost:${PORT}`);
  console.log('========================================\n');
});
