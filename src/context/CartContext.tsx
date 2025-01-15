import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  title: string;
  price: string;
  quantity: number;
  image: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  isCartOpen: boolean;
  toggleCart: () => void;
  notification: Notification | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Hide notification after 3 seconds
  };

  const addToCart = (newItem: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      if (existingItem) {
        showNotification(`Đã cập nhật số lượng ${newItem.title} trong giỏ hàng`, 'success');
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      showNotification(`Đã thêm ${newItem.title} vào giỏ hàng`, 'success');
      return [...currentItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.id === id);
      if (itemToRemove) {
        showNotification(`Đã xóa ${itemToRemove.title} khỏi giỏ hàng`, 'success');
      }
      return currentItems.filter(item => item.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      isCartOpen,
      toggleCart,
      notification
    }}>
      {children}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
          <div className={`rounded-lg px-4 py-3 shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 