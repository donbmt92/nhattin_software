/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { User, Notification, Product } from "@/app/profile/types";
import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";


interface CartContextType {
  user: User | null;
  listCart: any[];
  total: number;
  totalItems: number;
  isCartOpen: boolean;
  toggleCart: () => void;
  notification: Notification | null;
  getListCart: () => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  createOrders: () => Promise<void>;
  handleLogout: () => void;
  checkUserLogin: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [listCart, setListCart] = useState<any[]>([]);
  const totalItems = listCart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  console.log("abc",listCart);
  
  const total = listCart?.reduce((sum, item) => sum + item.id_product.base_price * item.quantity, 0) || 0;
  const [user, setUser] = useState<User | null>(null);
  
  // Function to check if user is logged in
  const checkUserLogin = useCallback(() => {
    const token = localStorage.getItem('nhattin_token');
    const userData = localStorage.getItem('nhattin_user');
    return !!(token && userData);
  }, []);
  
  // Function to handle user logout
  const handleLogout = useCallback(() => {
    // Clear user data and token from localStorage
    localStorage.removeItem('nhattin_token');
    localStorage.removeItem('nhattin_user');
    
    // Reset cart state
    setListCart([]);
    setUser(null);
    
    // Show notification
    showNotification('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
    
    // Redirect to login page
    router.push('/login');
  }, [router]);

  // Function to handle API errors, specifically 401 Unauthorized
  const handleApiError = useCallback((error: unknown) => {
    if (
      error && 
      typeof error === 'object' && 
      'response' in error && 
      error.response && 
      typeof error.response === 'object' && 
      'status' in error.response && 
      error.response.status === 401
    ) {
      console.log('Token expired or invalid. Logging out...');
      handleLogout();
      return true; // Error was handled
    }
    return false; // Error was not handled
  }, [handleLogout]);
  
  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("nhattin_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi parse user từ localStorage:", error);
        setUser(null);
      }
    }
  }, []);

  // Check token validity on mount
  useEffect(() => {
    const token = localStorage.getItem('nhattin_token');
    if (!token) {
      // No token found, clear user data if somehow it exists
      if (user) {
        setUser(null);
        localStorage.removeItem('nhattin_user');
      }
      return;
    }

    // Verify token by making a simple authenticated request
    const verifyToken = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Token is valid, no action needed
      } catch (error) {
        // Token is invalid or expired
        if (
          error && 
          typeof error === 'object' && 
          'response' in error && 
          error.response && 
          typeof error.response === 'object' && 
          'status' in error.response && 
          error.response.status === 401
        ) {
          handleLogout();
        }
      }
    };

    verifyToken();
  }, [handleLogout, user]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Hide notification after 3 seconds
  };
  
  const getListCart = useCallback(async () => {
    try {
      if (!user) {
        console.log("Không có user, không gọi API.");
        return;
      }
      console.log("Gọi API lấy giỏ hàng...");
      const token = localStorage.getItem('nhattin_token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/carts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        setListCart(response.data);
      } else {
        // If it's an object with a message (empty cart), set an empty array
        console.log("Giỏ hàng trống:", response.data.message);
        setListCart([]);
      }
    } catch (error) {
      if (!handleApiError(error)) {
        // Only show error if it's not a 401 (which is handled by handleApiError)
        console.error("Lỗi khi lấy giỏ hàng:", error);
        setListCart([]);
      }
    }
  }, [user, handleApiError]);
  
  useEffect(() => {
    if (!user) return;
    console.log("User tồn tại, gọi getListCart()");
    getListCart();
  }, [getListCart, user]);
  
  const addToCart = async (product: Product) => {
    try {
      console.log("Add to cart product:", product);
      
      // Xác định ID sản phẩm từ các nguồn khác nhau có thể có
      let productId;
      if (typeof product._id === 'object' && product._id?.id) {
        productId = product._id.id;
      } else if (product._id) {
        productId = product._id;
      } else if (product.id) {
        productId = product.id;
      } else if ((product as any).product_id) {
        productId = (product as any).product_id;
      } else {
        console.error("Không thể xác định ID sản phẩm:", product);
        showNotification("Không thể xác định ID sản phẩm để thêm vào giỏ hàng", "error");
        return;
      }
      
      console.log("ID sản phẩm được xác định:", productId);
      
      const token = localStorage.getItem('nhattin_token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Check if updatedCart is available
      await getListCart();
      
      if (listCart.length === 0) {
        console.log("Giỏ hàng trống, thêm sản phẩm mới");
        const payload = { 
          id_product: productId, 
          quantity: 1 
        };
        console.log("Request payload:", payload);
        
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/carts`, 
          payload,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (response.data) {
          await getListCart(); // Gọi lại danh sách giỏ hàng sau khi thêm mới
          showNotification(`Đã thêm ${product.name} vào giỏ hàng`, "success");
        } else {
          throw new Error("Dữ liệu phản hồi không hợp lệ");
        }
        return;
      }
      
      // If updatedCart is an array, proceed with the existing logic
      const existingItem = listCart.find((item: any) => {
        // Lấy ID từ item trong giỏ hàng
        const cartItemId = item.id_product?._id || item.id_product;
        
        // Lấy ID từ sản phẩm mới
        const newItemId = typeof product._id === 'object' ? product._id.id : product._id;
        
        console.log(`So sánh: cartItemId=${cartItemId}, newItemId=${newItemId}, bằng nhau=${String(cartItemId) === String(newItemId)}`);
        
        return String(cartItemId) === String(newItemId) || String(cartItemId) === String(productId);
      });

      if (existingItem) {
        // Nếu đã có trong giỏ hàng, cập nhật số lượng
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/carts/${existingItem._id}`, 
          { quantity: existingItem.quantity + 1 },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        await getListCart(); // Gọi lại danh sách giỏ hàng sau khi cập nhật
        showNotification(`Đã cập nhật số lượng ${product.name} trong giỏ hàng`, "success");
      } else {
        // Nếu chưa có trong giỏ hàng, thêm mới
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/carts`, 
          { id_product: productId, quantity: 1 },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data) {
          await getListCart(); // Gọi lại danh sách giỏ hàng sau khi thêm mới
          showNotification(`Đã thêm ${product.name} vào giỏ hàng`, "success");
        } else {
          throw new Error("Dữ liệu phản hồi không hợp lệ");
        }
      }
    } catch (error) {
      if (!handleApiError(error)) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        showNotification("Không thể thêm sản phẩm vào giỏ hàng", "error");
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      const token = localStorage.getItem('nhattin_token');
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/carts/${id}`, 
        { quantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setListCart((prev) =>
        prev.map((item) => (item._id === id ? { ...item, quantity } : item))
      );
    } catch (error) {
      if (!handleApiError(error)) {
        console.error("Lỗi khi cập nhật số lượng:", error);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      const token = localStorage.getItem('nhattin_token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/carts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setListCart((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      if (!handleApiError(error)) {
        console.error("Lỗi khi xóa sản phẩm:", error);
      }
    }
  };
  
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  //create payment
  const createOrders = async () => {
    try {
      const token = localStorage.getItem('nhattin_token');
      // Create order data based on the CreateOrderDto requirements
      const orderData = {
        note: "", // Default empty note, you might want to add a note input field in your UI
        // total: total, // Using the total from the cart context
        items: listCart,
        status: "pending", // Default status for new orders
        voucher: "" // Optional voucher code, can be added later
      };
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, 
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data) {
        // Clear cart after successful order creation
        await getListCart();
        showNotification("Đơn hàng đã được tạo thành công", "success");
        // Close cart after order is created
        router.push('/order');
        setIsCartOpen(false);
        return response.data;
      }
    } catch (error) {
      if (!handleApiError(error)) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        showNotification("Không thể tạo đơn hàng", "error");
      }
    }
  };

  return (
    <CartContext.Provider value={{ 
      user, 
      listCart, 
      total, 
      totalItems, 
      notification, 
      isCartOpen, 
      toggleCart, 
      getListCart, 
      updateQuantity, 
      removeFromCart, 
      addToCart, 
      createOrders,
      handleLogout,
      checkUserLogin
    }}>
      {children}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
          <div className={`rounded-lg px-4 py-3 shadow-lg ${notification.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
            }`}>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 