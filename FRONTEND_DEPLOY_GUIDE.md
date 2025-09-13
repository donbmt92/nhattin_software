# Hướng dẫn Deploy Next.js Frontend lên VPS

## Thông tin VPS
- **IP**: 69.62.83.168
- **Domain**: nhattinsoftware.com
- **SSH**: root@69.62.83.168
- **API Domain**: api.nhattinsoftware.com

## Bước 1: Chuẩn bị VPS (nếu chưa có)

### 1.1 Cài đặt Node.js (nếu chưa có)
```bash
# SSH vào VPS
ssh root@69.62.83.168

# Cài đặt Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Kiểm tra phiên bản
node --version
npm --version
```

### 1.2 Cài đặt PM2 (nếu chưa có)
```bash
npm install -g pm2
```

### 1.3 Cài đặt Nginx (nếu chưa có)
```bash
apt install nginx -y
systemctl enable nginx
systemctl start nginx
```

## Bước 2: Upload Code Frontend

### 2.1 Upload code từ máy local
```bash
# Từ máy local, upload code frontend
scp -r ./nhattin_software/* root@69.62.83.168:/var/www/nhattin-frontend/
```

### 2.2 Hoặc clone từ Git
```bash
# Trên VPS
mkdir -p /var/www/nhattin-frontend
cd /var/www/nhattin-frontend
git clone <your-frontend-repository-url> .
```

## Bước 3: Cấu hình ứng dụng

### 3.1 Cài đặt dependencies
```bash
cd /var/www/nhattin-frontend
npm install
```

### 3.2 Tạo file .env.production
```bash
nano .env.production
```

**Nội dung file .env.production:**
```env
NEXT_PUBLIC_API_URL=https://api.nhattinsoftware.com
NODE_ENV=production
```

### 3.3 Cập nhật Next.js config
```bash
nano next.config.js
```

**Nội dung next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'api.nhattinsoftware.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.nhattinsoftware.com',
  },
  output: 'standalone',
}

module.exports = nextConfig
```

### 3.4 Build ứng dụng
```bash
npm run build
```

## Bước 4: Cấu hình PM2

### 4.1 Tạo file ecosystem.config.js
```bash
nano ecosystem.config.js
```

**Nội dung ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'nhattin-frontend',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### 4.2 Tạo thư mục logs
```bash
mkdir -p logs
```

### 4.3 Khởi động ứng dụng
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Bước 5: Cấu hình Nginx

### 5.1 Tạo file cấu hình Nginx
```bash
nano /etc/nginx/sites-available/nhattinsoftware.com
```

**Nội dung file cấu hình:**
```nginx
server {
    listen 80;
    server_name nhattinsoftware.com www.nhattinsoftware.com;

    # Redirect all HTTP requests to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name nhattinsoftware.com www.nhattinsoftware.com;

    # SSL Configuration (will be managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/nhattinsoftware.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nhattinsoftware.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=frontend:10m rate=10r/s;
    limit_req zone=frontend burst=20 nodelay;

    # Main application proxy
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files optimization
    location /_next/static/ {
        proxy_pass http://localhost:3001;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Block access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ \.(env|log)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

### 5.2 Kích hoạt site
```bash
ln -s /etc/nginx/sites-available/nhattinsoftware.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## Bước 6: Cài đặt SSL

### 6.1 Cài đặt Certbot (nếu chưa có)
```bash
apt install certbot python3-certbot-nginx -y
```

### 6.2 Cài đặt SSL certificate
```bash
certbot --nginx -d nhattinsoftware.com -d www.nhattinsoftware.com
```

## Bước 7: Cấu hình Firewall

### 7.1 Cài đặt UFW (nếu chưa có)
```bash
ufw enable
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 3001
```

## Bước 8: Script Deploy tự động

### 8.1 Tạo script deploy
```bash
nano deploy-frontend.sh
```

**Nội dung script:**
```bash
#!/bin/bash

echo "🚀 Starting frontend deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Navigate to application directory
cd /var/www/nhattin-frontend

print_status "Pulling latest code from repository..."
git pull origin main

if [ $? -ne 0 ]; then
    print_error "Failed to pull latest code"
    exit 1
fi

print_status "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_status "Building application..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Failed to build application"
    exit 1
fi

print_status "Restarting PM2 process..."
pm2 restart nhattin-frontend

if [ $? -ne 0 ]; then
    print_error "Failed to restart PM2 process"
    exit 1
fi

print_status "Checking application status..."
pm2 status nhattin-frontend

print_status "✅ Frontend deployment completed successfully!"
print_status "🌐 Application is running at: https://nhattinsoftware.com"

# Show recent logs
print_status "Recent application logs:"
pm2 logs nhattin-frontend --lines 10
```

### 8.2 Cấp quyền thực thi
```bash
chmod +x deploy-frontend.sh
```

## Bước 9: Kiểm tra và Testing

### 9.1 Kiểm tra trạng thái ứng dụng
```bash
pm2 status
pm2 logs nhattin-frontend
```

### 9.2 Kiểm tra Nginx
```bash
systemctl status nginx
nginx -t
```

### 9.3 Test từ browser
- **HTTPS**: https://nhattinsoftware.com
- **API Connection**: Kiểm tra xem frontend có kết nối được với API không

## Troubleshooting

### Kiểm tra logs
```bash
# PM2 logs
pm2 logs nhattin-frontend

# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# System logs
journalctl -u nginx -f
```

### Kiểm tra port
```bash
netstat -tlnp | grep :3001
```

### Restart services
```bash
pm2 restart nhattin-frontend
systemctl restart nginx
```

## Kết quả

Sau khi hoàn thành, ứng dụng sẽ chạy tại:
- **HTTPS**: https://nhattinsoftware.com
- **API**: https://api.nhattinsoftware.com
- **Frontend**: Chạy trên port 3001 và được proxy qua Nginx với SSL certificate
