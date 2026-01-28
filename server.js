const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;

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

const server = http.createServer((req, res) => {
    try {
        // 解码URL（处理中文路径）
        const decodedUrl = decodeURIComponent(req.url);
        let filePath = path.join(ROOT, decodedUrl === '/' ? 'index.html' : decodedUrl);

        // 安全检查：防止路径遍历攻击
        const normalizedPath = path.normalize(filePath);
        if (!normalizedPath.startsWith(ROOT)) {
            console.warn(`[安全警告] 拒绝访问: ${req.url}`);
            res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>403 - 禁止访问</h1>');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                console.error(`[404] ${req.url} - ${err.message}`);
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>404 - 页面未找到</h1>');
            } else {
                console.log(`[200] ${req.url}`);
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    } catch (error) {
        console.error(`[错误] ${req.url} - ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>500 - 服务器错误</h1>');
    }
});

server.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`  博客测试服务器已启动`);
    console.log(`  本地访问: http://localhost:${PORT}`);
    console.log(`========================================\n`);
});
