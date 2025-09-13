# Hướng dẫn Deploy Frontend Nhanh

## Thông tin VPS
- **IP**: 69.62.83.168
- **Domain**: nhattinsoftware.com
- **SSH**: root@69.62.83.168
- **API**: https://api.nhattinsoftware.com

## Bước 1: Upload Code Frontend

```bash
# Từ máy local, upload code frontend
scp -r ./nhattin_software/* root@69.62.83.168:/var/www/nhattin-frontend/
```

## Bước 2: Cấu hình trên VPS

```bash
# SSH vào VPS
ssh root@69.62.83.168

# Tạo thư mục và di chuyển vào đó
mkdir -p /var/www/nhattin-frontend
cd /var/www/nhattin-frontend

# Cài đặt dependencies
npm install

# Tạo file .env.production
cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://api.nhattinsoftware.com
NODE_ENV=production
EOF

# Build ứng dụng
npm run build
```

## Bước 3: Cấu hình PM2

```bash
# Tạo thư mục logs
mkdir -p logs

# Khởi động ứng dụng với PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Bước 4: Cấu hình Nginx

```bash
# Copy file cấu hình Nginx
cp nginx-frontend.conf /etc/nginx/sites-available/nhattinsoftware.com

# Kích hoạt site
ln -s /etc/nginx/sites-available/nhattinsoftware.com /etc/nginx/sites-enabled/

# Kiểm tra cấu hình
nginx -t

# Reload Nginx
systemctl reload nginx
```

## Bước 5: Cài đặt SSL

```bash
# Cài đặt SSL certificate
certbot --nginx -d nhattinsoftware.com -d www.nhattinsoftware.com
```

## Bước 6: Cấu hình Firewall

```bash
# Cài đặt UFW
ufw enable
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 3001
```

## Kiểm tra kết quả

```bash
# Kiểm tra trạng thái ứng dụng
pm2 status

# Kiểm tra logs
pm2 logs nhattin-frontend

# Kiểm tra Nginx
systemctl status nginx

# Kiểm tra port
netstat -tlnp | grep :3001
```

## Truy cập ứng dụng

- **HTTPS**: https://nhattinsoftware.com
- **API**: https://api.nhattinsoftware.com

## Deploy tự động (sau này)

```bash
# Chạy script deploy tự động
./deploy-frontend.sh
```

## Troubleshooting

```bash
# Xem logs ứng dụng
pm2 logs nhattin-frontend

# Xem logs Nginx
tail -f /var/log/nginx/error.log

# Restart services
pm2 restart nhattin-frontend
systemctl restart nginx

# Kiểm tra SSL
certbot certificates
```

## Lưu ý quan trọng

1. **Đảm bảo domain `nhattinsoftware.com` đã trỏ về IP `69.62.83.168`**
2. **API đã hoạt động tại `https://api.nhattinsoftware.com`**
3. **Frontend sẽ chạy trên port 3001**
4. **SSL sẽ được cài đặt tự động qua Certbot**
5. **PM2 sẽ tự động restart ứng dụng khi có lỗi**

## Cấu trúc thư mục trên VPS

```
/var/www/
├── nhattin-api/          # Backend API
│   ├── dist/
│   ├── src/
│   ├── .env
│   └── ecosystem.config.js
└── nhattin-frontend/     # Frontend Next.js (port 3001)
    ├── .next/
    ├── src/
    ├── .env.production
    └── ecosystem.config.js
```
