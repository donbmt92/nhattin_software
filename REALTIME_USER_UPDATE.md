# Hệ thống Cập nhật Thông tin User Realtime

## Tổng quan

Hệ thống này đảm bảo thông tin user được cập nhật realtime trên toàn bộ ứng dụng khi có thay đổi về trạng thái đăng nhập/đăng xuất.

## Cách hoạt động

### 1. CartContext với refreshUser function

- `CartContext` cung cấp function `refreshUser()` để cập nhật thông tin user từ localStorage
- Function này được gọi khi:
  - Component mount lần đầu
  - Có thay đổi trong localStorage (qua event listener)
  - Được gọi trực tiếp từ các component khác

### 2. Event System

Hệ thống sử dụng 2 loại event:

#### Storage Event (Cross-tab)
- Tự động trigger khi localStorage thay đổi từ tab/window khác
- Được listen trong `CartContext` để tự động refresh user data

#### Custom Event (Same-tab)
- Event `userDataChanged` được dispatch khi có thay đổi user data trong cùng tab
- Được listen trong `CartContext` để refresh user data

### 3. Utility Functions

File `src/utils/userEvents.ts` cung cấp các utility functions:

```typescript
dispatchUserDataChanged()  // Thông báo user data đã thay đổi
dispatchUserLoggedIn()     // Thông báo user đã đăng nhập
dispatchUserLoggedOut()    // Thông báo user đã đăng xuất
```

## Các điểm tích hợp

### 1. Trang Login (`src/app/login/page.tsx`)
```typescript
// Sau khi đăng nhập thành công
localStorage.setItem('nhattin_user', JSON.stringify(data.data));
dispatchUserDataChanged();  // Thông báo thay đổi
refreshUser();              // Cập nhật context
```

### 2. TopHeader (`src/app/components/Header/TopHeader.tsx`)
```typescript
// Khi đăng xuất
localStorage.removeItem('nhattin_user');
dispatchUserDataChanged();  // Thông báo thay đổi
```

### 3. CartContext (`src/context/CartContext.tsx`)
```typescript
// Event listeners
useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'nhattin_user') {
      refreshUser();
    }
  };
  
  const handleCustomStorageChange = () => {
    refreshUser();
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('userDataChanged', handleCustomStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('userDataChanged', handleCustomStorageChange);
  };
}, [refreshUser]);
```

## Lợi ích

1. **Realtime Updates**: Thông tin user được cập nhật ngay lập tức trên toàn bộ ứng dụng
2. **Cross-tab Sync**: Thay đổi ở tab này sẽ được sync với tab khác
3. **Centralized State**: Tất cả thông tin user được quản lý tập trung trong CartContext
4. **Easy Integration**: Chỉ cần import và sử dụng `useCart()` hook
5. **Event-driven**: Sử dụng event system để đảm bảo tính nhất quán

## Cách sử dụng

### Trong component cần thông tin user:
```typescript
import { useCart } from '@/context/CartContext';

function MyComponent() {
  const { user, refreshUser } = useCart();
  
  // user sẽ được cập nhật tự động khi có thay đổi
  return <div>Hello {user?.fullName}</div>;
}
```

### Khi cần cập nhật user data:
```typescript
import { dispatchUserDataChanged } from '@/utils/userEvents';

// Sau khi thay đổi localStorage
localStorage.setItem('nhattin_user', JSON.stringify(newUserData));
dispatchUserDataChanged(); // Thông báo cho tất cả components
```

## Testing

Sử dụng `UserStatusDemo` component trong development để kiểm tra:

```typescript
import UserStatusDemo from '@/components/UserStatusDemo';

// Thêm vào layout hoặc page để test
<UserStatusDemo />
```

Component này sẽ hiển thị:
- Trạng thái đăng nhập
- Tên user hiện tại
- Role của user
- Thời gian cập nhật cuối cùng
