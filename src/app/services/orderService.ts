// services/orderService.ts
import api from '../components/utils/api';

interface BuyNowData {
  id_product: string;
  quantity: number;
  note: string;
  id_payment?: string;
  voucher?: string;
  affiliateCode?: string;
  userEmail: string;
  // Subscription fields
  subscription_type_id?: string;
  subscription_duration_id?: string;
  subscription_type_name?: string;
  subscription_duration?: string;
  subscription_days?: number;
  subscription_price?: number;
  total_price?: number;
}

interface BuyNowResponse {
  _id: string;
  status: string;
  message?: string;
}

// MongoDB ObjectId validation
const isValidObjectId = (id: string): boolean => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

// Function to extract valid MongoDB ObjectId from product data
const extractProductId = (product: any): string => {
  // Thử các cách khác nhau để lấy ID
  if (product._id) {
    // Nếu _id là object có thuộc tính id
    if (typeof product._id === 'object' && product._id.id) {
      return product._id.id;
    }
    // Nếu _id là string
    if (typeof product._id === 'string') {
      return product._id;
    }
  }
  
  // Thử id trực tiếp
  if (product.id && typeof product.id === 'string') {
    return product.id;
  }
  
  throw new Error('Không thể lấy ID sản phẩm hợp lệ');
};

// API call để mua ngay
export const buyNow = async (buyNowData: BuyNowData): Promise<BuyNowResponse> => {
  // Validate product ID format
  if (!isValidObjectId(buyNowData.id_product)) {
    throw new Error(`ID sản phẩm không hợp lệ: ${buyNowData.id_product}. ID phải có định dạng MongoDB ObjectId (24 ký tự hex)`);
  }

  try {
    // Thử endpoint /orders/buy-now trước, nếu không có thì dùng /orders
    const response = await api.post('/orders/buy-now', buyNowData);
    return response.data;
  } catch (error: any) {
    console.error('Buy now API error:', error);
    
    // Nếu endpoint /orders/buy-now không tồn tại (404), thử endpoint /orders
    if (error.response?.status === 404) {
      try {
        console.log('Trying fallback endpoint /orders');
        const fallbackResponse = await api.post('/orders', buyNowData);
        return fallbackResponse.data;
      } catch (fallbackError: any) {
        console.error('Fallback API error:', fallbackError);
        throw new Error('Endpoint tạo đơn hàng không tồn tại. Vui lòng liên hệ admin.');
      }
    }
    
    if (error.response?.status === 401) {
      throw new Error('Bạn cần đăng nhập để thực hiện mua hàng');
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('Mua ngay thất bại');
  }
};

// Export function để extract product ID
export { extractProductId };

// Utility function để lấy affiliate code từ URL
export const getAffiliateCodeFromUrl = (): string | undefined => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Kiểm tra affiliate code từ URL parameter (?affiliate=CODE)
    const affiliateCode = urlParams.get('affiliate');
    if (affiliateCode) {
      return affiliateCode;
    }
    
    // Kiểm tra affiliate code từ localStorage (được set khi user click affiliate link)
    const storedAffiliateCode = localStorage.getItem('affiliate_code');
    if (storedAffiliateCode) {
      return storedAffiliateCode;
    }
    
    // Kiểm tra affiliate code từ sessionStorage
    const sessionAffiliateCode = sessionStorage.getItem('affiliate_code');
    if (sessionAffiliateCode) {
      return sessionAffiliateCode;
    }
  }
  return undefined;
};

// Function để set affiliate code khi user click affiliate link
export const setAffiliateCode = (code: string): void => {
  if (typeof window !== 'undefined') {
    // Lưu vào localStorage để persist across sessions
    localStorage.setItem('affiliate_code', code);
    // Lưu vào sessionStorage để dùng ngay
    sessionStorage.setItem('affiliate_code', code);
    
    // Set cookie để backend có thể đọc được
    document.cookie = `affiliate_code=${code}; path=/; max-age=86400`; // 24 hours
  }
};

// Function để clear affiliate code
export const clearAffiliateCode = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('affiliate_code');
    sessionStorage.removeItem('affiliate_code');
    document.cookie = 'affiliate_code=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};
