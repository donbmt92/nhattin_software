# 🎯 Hệ Thống Affiliate - Hướng Dẫn Sử Dụng

## Tổng Quan
Hệ thống affiliate cho phép người dùng đăng ký làm đối tác giới thiệu và nhận hoa hồng từ các đơn hàng được giới thiệu thành công.

## 🚀 Tính Năng Chính

### 1. Đăng Ký Affiliate
- Form đăng ký với validation đầy đủ
- Chọn tỷ lệ hoa hồng từ 1% - 15% (mặc định 8%)
- Nhập thông tin tài khoản ngân hàng để nhận tiền
- Danh sách ngân hàng phổ biến với tùy chọn tùy chỉnh

### 2. Quản Lý Thông Tin Affiliate
- Hiển thị mã affiliate duy nhất
- Cập nhật thông tin thanh toán
- Theo dõi trạng thái affiliate (PENDING, ACTIVE, INACTIVE, SUSPENDED)

### 3. Thống Kê Và Báo Cáo
- Tổng số khách hàng được giới thiệu
- Tổng số đơn hàng thành công
- Tổng thu nhập và thu nhập đang chờ
- Lịch sử giao dịch chi tiết

### 4. Rút Tiền
- Yêu cầu rút tiền khi đạt số tiền tối thiểu (100,000 VNĐ)
- Thanh toán qua tài khoản ngân hàng đã đăng ký

## 📋 Yêu Cầu Hệ Thống

### Backend API Endpoints
```
POST /affiliates/register          - Đăng ký affiliate
GET  /affiliates/profile           - Lấy thông tin affiliate
GET  /affiliates/stats             - Lấy thống kê affiliate
PUT  /affiliates/profile           - Cập nhật thông tin affiliate
POST /affiliates/payout            - Yêu cầu rút tiền
GET  /affiliates/transactions      - Lịch sử giao dịch
GET  /affiliates/referrals         - Danh sách khách hàng giới thiệu
```

### Database Schema
```typescript
interface AffiliateInfo {
    _id?: string;
    userId: string;
    affiliateCode: string;
    commissionRate: number;
    status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    minPayoutAmount: number;
    totalEarnings: number;
    pendingEarnings: number;
    paymentInfo: PaymentInfo;
    createdAt?: string;
    updatedAt?: string;
}

interface PaymentInfo {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    bankCode?: string;
}
```

## 🛠️ Cài Đặt Và Sử Dụng

### 1. Import Components
```typescript
import AffiliateRegistration from './components/AffiliateRegistration';
import AffiliateStats from './components/AffiliateStats';
```

### 2. Sử Dụng Trong Component
```typescript
const [affiliateInfo, setAffiliateInfo] = useState<AffiliateInfo | null>(null);

const handleAffiliateRegistrationSuccess = (affiliate: AffiliateInfo) => {
    setAffiliateInfo(affiliate);
};

// Trong JSX
<AffiliateRegistration 
    user={user} 
    onRegistrationSuccess={handleAffiliateRegistrationSuccess}
/>

{affiliateInfo && (
    <AffiliateStats affiliateInfo={affiliateInfo} />
)}
```

### 3. Sử Dụng Service
```typescript
import AffiliateService from './services/affiliateService';

// Đăng ký affiliate
const result = await AffiliateService.registerAffiliate({
    commissionRate: 8,
    paymentInfo: {
        bankName: 'Vietcombank',
        accountNumber: '1234567890',
        accountHolder: 'Nguyễn Văn A'
    }
});

// Lấy thống kê
const stats = await AffiliateService.getAffiliateStats();
```

## 🎨 UI Components

### AffiliateRegistration
- Form đăng ký với validation
- Chọn tỷ lệ hoa hồng
- Nhập thông tin ngân hàng
- Hiển thị thông tin affiliate nếu đã đăng ký

### AffiliateStats
- Dashboard thống kê với 4 metrics chính
- Thông tin chi tiết về hoa hồng và thanh toán
- Hướng dẫn sử dụng
- Nút rút tiền (khi đủ điều kiện)

## 🔒 Bảo Mật

### Authentication
- Sử dụng JWT token từ localStorage
- Tự động logout khi token hết hạn
- Kiểm tra quyền truy cập cho mỗi API call

### Validation
- Client-side validation cho form đăng ký
- Server-side validation cho tất cả API endpoints
- Sanitize input data để tránh XSS

## 📱 Responsive Design

- Mobile-first approach
- Grid layout responsive
- Touch-friendly buttons và form elements
- Optimized cho các kích thước màn hình khác nhau

## 🚨 Error Handling

### Client Errors
- Validation errors với thông báo rõ ràng
- Network errors với retry mechanism
- Authentication errors với redirect to login

### Server Errors
- HTTP status codes handling
- User-friendly error messages
- Fallback UI cho error states

## 🔄 State Management

### Local State
- Form data management
- Loading states
- Error/success messages
- UI state (editing, viewing, etc.)

### API State
- Data fetching states
- Cache management
- Optimistic updates

## 📊 Performance

### Optimization
- Lazy loading cho components
- Memoization với React.memo
- Debounced API calls
- Efficient re-renders

### Caching
- Local storage cho user data
- API response caching
- Optimistic UI updates

## 🧪 Testing

### Unit Tests
- Component rendering tests
- Form validation tests
- API service tests
- Error handling tests

### Integration Tests
- User flow tests
- API integration tests
- State management tests

## 📈 Monitoring

### Analytics
- User registration tracking
- Conversion rate monitoring
- Performance metrics
- Error tracking

### Logging
- API call logging
- Error logging
- User action logging
- Performance logging

## 🔮 Roadmap

### Phase 1 (Hiện tại)
- ✅ Đăng ký affiliate cơ bản
- ✅ Quản lý thông tin affiliate
- ✅ Thống kê cơ bản

### Phase 2 (Tương lai)
- 🔄 Hệ thống referral tracking
- 🔄 Multi-level affiliate
- 🔄 Advanced analytics
- 🔄 Mobile app

### Phase 3 (Dài hạn)
- 🔄 AI-powered recommendations
- 🔄 Social media integration
- 🔄 International expansion
- 🔄 Blockchain integration

## 📞 Hỗ Trợ

### Technical Support
- Email: dev@nhattin.com
- Documentation: /docs/affiliate
- Issues: GitHub Issues

### User Support
- FAQ: /affiliate/faq
- Contact: /contact
- Live Chat: Available 24/7

---

**Lưu ý:** Hệ thống affiliate được thiết kế để tuân thủ các quy định pháp luật về quảng cáo và tiếp thị. Vui lòng đảm bảo tuân thủ các quy định địa phương khi sử dụng.
