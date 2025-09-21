# Hệ thống Quản lý Affiliate Dashboard

## Tổng quan

Đã tích hợp hoàn chỉnh hệ thống quản lý affiliate vào dashboard admin với các tính năng:

- ✅ Quản lý danh sách affiliate
- ✅ Xem chi tiết affiliate
- ✅ Thay đổi trạng thái affiliate
- ✅ Thống kê tổng quan
- ✅ Lịch sử hoa hồng
- ✅ Quản lý affiliate links
- ✅ Kết nối với API backend thật

## Cấu trúc Files

### 1. Service Layer
```
src/services/affiliateService.ts
```
- Service để giao tiếp với API backend
- Hỗ trợ cả Admin APIs và User APIs
- Xử lý authentication và error handling
- Fallback về mock data nếu API không khả dụng

### 2. Dashboard Pages
```
src/app/dashboard/affiliates/
├── page.tsx                    # Trang danh sách affiliate
└── [id]/
    └── page.tsx               # Trang chi tiết affiliate
```

### 3. Navigation
```
src/app/components/Sidebar/Sidebar.tsx
```
- Đã thêm menu "Affiliate" vào sidebar
- Icon và styling phù hợp với theme

### 4. Dashboard Integration
```
src/app/dashboard/page.tsx
```
- Thêm thẻ thống kê "Tổng Affiliate"
- Thêm thao tác nhanh "Quản lý Affiliate"

## API Endpoints Sử dụng

### Admin APIs (Backend)
- `GET /admin/affiliates` - Lấy danh sách affiliate
- `GET /admin/affiliates/:id` - Lấy chi tiết affiliate
- `PUT /admin/affiliates/:id/status` - Cập nhật trạng thái
- `GET /admin/affiliates/stats` - Lấy thống kê tổng quan
- `GET /admin/affiliates/:id/commissions` - Lấy lịch sử hoa hồng
- `GET /admin/affiliates/:id/links` - Lấy affiliate links

### User APIs (Backend)
- `GET /affiliates/profile` - Profile affiliate
- `GET /affiliates/dashboard` - Dashboard affiliate
- `GET /affiliates/stats` - Thống kê affiliate
- `GET /affiliates/transactions` - Lịch sử giao dịch
- `GET /affiliates/referrals` - Danh sách referrals
- `POST /affiliate-links` - Tạo affiliate link
- `GET /affiliate-links` - Lấy danh sách links
- `POST /affiliates/payout` - Yêu cầu rút tiền

## Tính năng chính

### 1. Trang Danh sách Affiliate (`/dashboard/affiliates`)

**Thống kê tổng quan:**
- Tổng số affiliate
- Số affiliate đang hoạt động
- Số affiliate chờ duyệt
- Tổng hoa hồng đã trả

**Bộ lọc và tìm kiếm:**
- Tìm kiếm theo tên hoặc email
- Lọc theo trạng thái (PENDING, ACTIVE, REJECTED, SUSPENDED)

**Bảng danh sách:**
- Thông tin affiliate (tên, email, avatar)
- Trạng thái với badge màu sắc
- Tỷ lệ hoa hồng
- Tổng thu nhập
- Số referrals và đã duyệt
- Ngày tạo
- Thao tác (Duyệt/Từ chối/Khóa/Mở khóa/Chi tiết)

### 2. Trang Chi tiết Affiliate (`/dashboard/affiliates/[id]`)

**Thông tin cá nhân:**
- Avatar, tên, email, phone
- Trạng thái affiliate
- Tỷ lệ hoa hồng

**Thống kê chi tiết:**
- Tổng thu nhập
- Tổng referrals
- Đã duyệt
- Tỷ lệ duyệt

**3 Tab chính:**

#### Tab Tổng quan:
- Thông tin ngân hàng (nếu có)
- Thông tin đăng ký (ngày tạo, cập nhật)

#### Tab Hoa hồng:
- Lịch sử hoa hồng với bảng chi tiết
- Thông tin đơn hàng, số tiền, tỷ lệ, trạng thái

#### Tab Links:
- Danh sách affiliate links
- Thống kê clicks, conversions, earnings

**Thao tác:**
- Duyệt/Từ chối affiliate (nếu PENDING)
- Khóa/Mở khóa affiliate (nếu ACTIVE/SUSPENDED)

## Cấu hình Environment

Đảm bảo có biến môi trường:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Authentication

- Sử dụng JWT token từ localStorage (`nhattin_token`)
- Kiểm tra role ADMIN để truy cập dashboard
- Tự động redirect về login nếu chưa đăng nhập

## Error Handling

- Fallback về mock data nếu API không khả dụng
- Hiển thị thông báo lỗi cho user
- Console log chi tiết lỗi cho developer

## Responsive Design

- Hoạt động tốt trên desktop, tablet, mobile
- Dark mode support
- Smooth transitions và animations

## Cách sử dụng

1. **Truy cập dashboard:** `/dashboard`
2. **Xem thống kê:** Click vào thẻ "Tổng Affiliate"
3. **Quản lý affiliate:** Click vào "Quản lý Affiliate" trong thao tác nhanh
4. **Xem chi tiết:** Click "Chi tiết" trong bảng affiliate
5. **Thay đổi trạng thái:** Sử dụng các button trong header hoặc bảng

## Lưu ý

- Dữ liệu sẽ được load từ API backend thật
- Nếu API không khả dụng, sẽ hiển thị mock data
- Tất cả thao tác đều được ghi log để debug
- UI đã được tối ưu cho trải nghiệm người dùng tốt nhất

## Tương lai

Có thể mở rộng thêm:
- Export báo cáo Excel/PDF
- Bulk actions (duyệt nhiều affiliate cùng lúc)
- Advanced filters (theo ngày, thu nhập, etc.)
- Real-time notifications
- Analytics charts
