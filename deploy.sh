#!/bin/bash

# 博客部署脚本
# 用法: ./deploy.sh <服务器IP> <用户名> [域名]

SERVER_IP=$1
USER=$2
DOMAIN=$3

if [ -z "$SERVER_IP" ] || [ -z "$USER" ]; then
    echo "用法: ./deploy.sh <服务器IP> <用户名> [域名]"
    echo "示例: ./deploy.sh 123.45.67.89 root myblog.example.com"
    exit 1
fi

echo "========================================"
echo "  博客部署脚本"
echo "========================================"

# 1. 上传文件
echo ""
echo "📤 正在上传文件到服务器..."
scp -r $(dirname "$0")/* $USER@$SERVER_IP:/var/www/blog/

if [ $? -ne 0 ]; then
    echo "❌ 文件上传失败"
    exit 1
fi

# 2. 设置权限
echo "🔧 设置文件权限..."
ssh $USER@$SERVER_IP "chmod -R 755 /var/www/blog"

# 3. 配置域名 (如果提供)
if [ -n "$DOMAIN" ]; then
    echo "🌐 配置域名: $DOMAIN"
    ssh $USER@$SERVER_IP "cat > /etc/caddy/Caddyfile << 'EOF'
$DOMAIN {
    root * /var/www/blog
    file_server
    encode gzip
    tls {
        protocols tls1.2 tls1.3
    }
    header {
        X-Frame-Options \"SAMEORIGIN\"
        X-Content-Type-Options \"nosniff\"
    }
}
EOF"

    # 重启Caddy
    ssh $USER@$SERVER_IP "systemctl restart caddy"
    echo "✅ 域名配置完成，HTTPS已自动启用"
fi

echo ""
echo "========================================"
echo "  部署完成!"
echo "========================================"
echo ""
echo "访问地址: http://$SERVER_IP:80"
if [ -n "$DOMAIN" ]; then
    echo "或: https://$DOMAIN"
fi
