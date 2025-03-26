"use client";
import { useCart } from "@/context/CartContext";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Link from "next/link";
import Image from "next/image";
export default function CartPopup() {
  const { listCart, total, totalItems, isCartOpen, toggleCart, updateQuantity, removeFromCart, createOrders } = useCart();
  if (!isCartOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleCart}></div>
      <div className="relative w-full max-w-md h-screen bg-white shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Giỏ hàng ({totalItems} sản phẩm)</h2>
          <button onClick={toggleCart} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-180px)] p-4">
          {listCart.map((item) => (
            <div key={item.id_product} className="flex items-center mb-4 p-2 border rounded">
              <div className="w-20 h-20 relative">
                <Image
                  src={`${item.id_product.image}`}
                  alt={item.id_product.name}
                  className="object-cover rounded"
                  width={100}
                  height={100}
                />
              </div>
              <div className="flex-1 ml-4">
                <h3 className="text-sm font-medium">{item.id_product.name}</h3>
                <p className="text-red-600 font-semibold">{Number(item.id_product.base_price).toLocaleString('vi-VN')} VNĐ</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-4 text-red-500"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Tổng tiền:</span>
            <span className="text-red-600 font-bold">{total.toLocaleString('vi-VN')} VNĐ</span>
          </div>
          <button
            onClick={createOrders}
            className="w-full p-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
