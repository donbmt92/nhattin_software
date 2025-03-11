/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { User, Notification, Product } from "@/app/profile/types";
import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react";


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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [listCart, setListCart] = useState<any[]>([]);
  console.log(listCart);
  const totalItems = listCart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const total = listCart?.reduce((sum, item) => sum + item.id_product.base_price * item.quantity, 0) || 0;
  const [user, setUser] = useState<User | null>(null);
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
      alert(error);
      console.error("Lỗi khi lấy giỏ hàng:", error);
      setListCart([]);
    }
  }, [user]);
  useEffect(() => {
    if (!user) return;
    console.log("User tồn tại, gọi getListCart()");
    getListCart();
  }, [getListCart, user]);
  const addToCart = async (product: Product) => {
    try {
      if (!user) return;
      const token = localStorage.getItem('nhattin_token');
      // Gọi API lấy danh sách giỏ hàng mới nhất để kiểm tra (tránh trường hợp dữ liệu cũ)
      const { data: updatedCart } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/carts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(updatedCart);
      
      // Check if updatedCart is an array or an object with a message
      if (!Array.isArray(updatedCart)) {
        // If cart is empty, just add the product
        console.log("Giỏ hàng trống, thêm sản phẩm mới");
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/carts`, 
          { id_product: product._id.id, quantity: 1 },
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
      const existingItem = updatedCart.find((item: any) =>
        String(item.id_product?._id || item.id_product) === String(product._id)
      );

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
          { id_product: product._id.id, quantity: 1 },
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
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      showNotification("Không thể thêm sản phẩm vào giỏ hàng", "error");
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
      console.error("Lỗi khi cập nhật số lượng:", error);
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
      console.error("Lỗi khi xóa sản phẩm:", error);
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
        total: total, // Using the total from the cart context
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
        setIsCartOpen(false);
        return response.data;
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      showNotification("Không thể tạo đơn hàng", "error");
    }
  };

  return (
    <CartContext.Provider value={{ user, listCart, total, totalItems, notification, isCartOpen, toggleCart, getListCart, updateQuantity, removeFromCart, addToCart, createOrders }}>
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