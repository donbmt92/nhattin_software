# 🚀 Hướng Dẫn Sử Dụng Hệ Thống Affiliate

## 📋 Tổng Quan

Hệ thống affiliate đã được implement hoàn chỉnh với đầy đủ tính năng:
- ✅ Tracking click từ affiliate link
- ✅ Tracking conversion khi mua hàng
- ✅ Tính toán commission tự động
- ✅ Quản lý payout
- ✅ Dashboard thống kê

## 🔧 Backend APIs

### **1. Affiliate Management**
```http
POST /api/affiliates/register          # Đăng ký affiliate
GET  /api/affiliates/profile           # Lấy thông tin affiliate
PUT  /api/affiliates/profile           # Cập nhật thông tin affiliate
GET  /api/affiliates/dashboard         # Dashboard affiliate
GET  /api/affiliates/stats             # Thống kê affiliate
GET  /api/affiliates/transactions      # Lịch sử giao dịch
GET  /api/affiliates/referrals         # Danh sách referrals
POST /api/affiliates/payout            # Yêu cầu rút tiền
```

### **2. Affiliate Links**
```http
POST /api/affiliate-links              # Tạo affiliate link
GET  /api/affiliate-links              # Lấy danh sách links
GET  /api/affiliate-links/stats        # Thống kê links
PUT  /api/affiliate-links/:code/disable # Vô hiệu hóa link
```

### **3. Affiliate Redirect**
```http
GET /api/affiliate/redirect/:linkCode  # Redirect affiliate link
```

## 🎨 Frontend Components

### **1. Affiliate Redirect Page**
- **Path**: `/affiliate/redirect/[linkCode]`
- **Chức năng**: Xử lý redirect từ affiliate link
- **Features**:
  - Track click khi user truy cập
  - Set affiliate code vào localStorage
  - Redirect đến trang sản phẩm
  - Loading states và error handling

### **2. Product Page Integration**
- **File**: `ProductDetailComponent.tsx`
- **Features**:
  - Hiển thị banner affiliate code
  - Tự động detect affiliate code từ URL
  - Gửi affiliate code khi mua hàng
  - Clear affiliate code option

### **3. Affiliate Dashboard**
- **Path**: `/profile/affiliate-dashboard`
- **Features**:
  - Thống kê earnings
  - Quản lý affiliate links
  - Request payout
  - Transaction history

## 🔄 Flow Hoạt Động

### **1. Tạo Affiliate Link**
```typescript
// 1. User đăng ký affiliate
const affiliate = await AffiliateService.registerAffiliate({
  commissionRate: 8,
  paymentInfo: { bankName: "VCB", accountNumber: "1234567890", accountHolder: "Nguyễn Văn A" }
});

// 2. Tạo affiliate link
const link = await AffiliateLinkService.createAffiliateLink({
  productId: "product123",
  expiresAt: "2024-12-31",
  campaignName: "Campaign 2024"
});
```

### **2. User Click Affiliate Link**
```
1. User click: https://yoursite.com/affiliate/redirect/ABC123XYZ
2. Frontend gọi: GET /api/affiliate/redirect/ABC123XYZ
3. Backend track click và redirect đến product page
4. Frontend set affiliate code vào localStorage
5. User được redirect đến: https://yoursite.com/product/some-product?affiliate=ABC123XYZ
```

### **3. User Mua Hàng**
```typescript
// 1. Frontend detect affiliate code
const affiliateCode = getAffiliateCodeFromUrl(); // "ABC123XYZ"

// 2. Gửi order với affiliate code
const order = await buyNow({
  id_product: "product123",
  quantity: 1,
  affiliateCode: affiliateCode
});

// 3. Backend xử lý commission
const commission = await CommissionService.processCommissionAfterPayment({
  affiliateCode: "ABC123XYZ",
  totalAmount: 500000,
  userId: "user123"
});
```

## 📊 Database Schema

### **1. Affiliates Collection**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  affiliateCode: String,
  commissionRate: Number,
  totalEarnings: Number,
  totalReferrals: Number,
  approvedReferrals: Number,
  status: String,
  paymentInfo: {
    bankName: String,
    accountNumber: String,
    accountHolder: String,
    bankCode: String
  },
  minPayoutAmount: Number,
  lastPayoutDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### **2. Commission Transactions Collection**
```typescript
{
  _id: ObjectId,
  affiliateId: ObjectId,
  orderId: ObjectId,
  referralId: ObjectId,
  orderAmount: Number,
  commission: Number,
  commissionRate: Number,
  status: String,
  paidDate: Date,
  paymentMethod: String,
  paymentReference: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **3. Affiliate Links Collection**
```typescript
{
  _id: ObjectId,
  affiliateId: ObjectId,
  productId: ObjectId,
  linkCode: String,
  originalUrl: String,
  shortUrl: String,
  expiresAt: Date,
  clickCount: Number,
  conversionCount: Number,
  totalCommissionEarned: Number,
  status: String,
  campaignName: String,
  notes: String,
  clickedByIPs: [String],
  convertedUserIds: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### **1. Test Affiliate Link Creation**
```bash
# 1. Đăng ký affiliate
curl -X POST http://localhost:3000/api/affiliates/register \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"commissionRate": 8, "paymentInfo": {"bankName": "VCB", "accountNumber": "1234567890", "accountHolder": "Test User"}}'

# 2. Tạo affiliate link
curl -X POST http://localhost:3000/api/affiliate-links \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": "PRODUCT_ID", "expiresAt": "2024-12-31", "campaignName": "Test Campaign"}'
```

### **2. Test Affiliate Redirect**
```bash
# Test redirect
curl -I http://localhost:3000/api/affiliate/redirect/YOUR_LINK_CODE
```

### **3. Test Commission Processing**
```bash
# Test mua hàng với affiliate code
curl -X POST http://localhost:3000/api/orders/buy-now \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id_product": "PRODUCT_ID", "quantity": 1, "affiliateCode": "YOUR_AFFILIATE_CODE"}'
```

## 🚀 Deployment

### **1. Environment Variables**
```env
# Backend
AFFILIATE_COMMISSION_RATE=8
AFFILIATE_MIN_PAYOUT=100000
AFFILIATE_HOLDING_PERIOD=30
AFFILIATE_MAX_REFERRALS_PER_DAY=10

# Frontend
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### **2. Database Indexes**
```javascript
// Tạo indexes cho performance
db.affiliates.createIndex({ affiliateCode: 1 });
db.affiliates.createIndex({ userId: 1 });
db.affiliate_links.createIndex({ linkCode: 1 });
db.affiliate_links.createIndex({ affiliateId: 1 });
db.commission_transactions.createIndex({ affiliateId: 1 });
db.commission_transactions.createIndex({ orderId: 1 });
```

## 📈 Monitoring

### **1. Key Metrics**
- Total affiliate clicks
- Conversion rate
- Total commission paid
- Active affiliates
- Pending payouts

### **2. Logs to Monitor**
```javascript
// Commission processing logs
console.log(`✅ Commission processed: ${commission} VND for affiliate ${affiliateCode}`);

// Click tracking logs
console.log(`📊 Affiliate link clicked: ${linkCode} from IP: ${userIP}`);

// Conversion tracking logs
console.log(`🎯 Conversion tracked: ${linkCode} for user ${userId}`);
```

## 🔒 Security

### **1. Rate Limiting**
- Affiliate redirect: 100 requests/phút
- Affiliate link creation: 10 requests/phút
- Commission processing: 50 requests/phút

### **2. Validation**
- Affiliate code format validation
- Commission amount validation
- Payout amount validation
- Link expiration checking

### **3. Fraud Prevention**
- IP tracking
- Duplicate conversion prevention
- Suspicious activity detection

## 🎯 Kết Luận

Hệ thống affiliate đã được implement hoàn chỉnh với:
- ✅ Full-stack implementation
- ✅ Real-time tracking
- ✅ Commission processing
- ✅ Payout management
- ✅ Dashboard & analytics
- ✅ Security & validation

**Ready for production!** 🚀

