import api from "@/app/components/utils/api";
import { User, Notification, Product } from "@/app/profile/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [listCart, setListCart] = useState<any[]>([]);
  const totalItems = listCart.reduce((sum, item) => sum + item.quantity, 0);
  const total = listCart.reduce((sum, item) => sum + item.id_product.base_price * item.quantity, 0);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
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
  const getListCart = async () => {
    try {
      if (!user) {
        console.log("Không có user, không gọi API.");
        return;
      }
      console.log("Gọi API lấy giỏ hàng...");
      const response = await api.get("/carts/");
      setListCart(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };
  useEffect(() => {
    if (!user) return;
    console.log("User tồn tại, gọi getListCart()");
    getListCart();
  }, [user]);
  const addToCart = async (product: Product) => {
    try {
      if (!user) return;
      // Gọi API lấy danh sách giỏ hàng mới nhất để kiểm tra (tránh trường hợp dữ liệu cũ)
      const { data: updatedCart } = await api.get("/carts");

      // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
      const existingItem = updatedCart.find((item: any) =>
        String(item.id_product?._id || item.id_product) === String(product._id)
      );

      if (existingItem) {
        // Nếu đã có trong giỏ hàng, cập nhật số lượng
        await api.patch(`/carts/${existingItem._id}`, { quantity: existingItem.quantity + 1 });
        await getListCart(); // Gọi lại danh sách giỏ hàng sau khi cập nhật
        showNotification(`Đã cập nhật số lượng ${product.name} trong giỏ hàng`, "success");
      } else {
        // Nếu chưa có trong giỏ hàng, thêm mới
        const response = await api.post("/carts", { id_product: product._id.id, quantity: 1 });

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
      await api.patch(`/carts/${id}`, { quantity });
      setListCart((prev) =>
        prev.map((item) => (item._id === id ? { ...item, quantity } : item))
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await api.delete(`/carts/${id}`);
      setListCart((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <CartContext.Provider value={{ user, listCart, total, totalItems, notification, isCartOpen, toggleCart, getListCart, updateQuantity, removeFromCart, addToCart }}>
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