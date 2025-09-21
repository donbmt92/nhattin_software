"use client";
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Loader2, X } from "lucide-react";

interface Product {
    _id: string;
    id_category: string;
    name: string;
    description: string;
    image: string;
    thumbnail: string;
    base_price: number;
    min_price: number;
    max_price: number;
    rating: number;
    total_reviews: number;
    sold: number;
    warranty_policy: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface OrderItem {
    id: string;
    quantity: number;
    old_price: number;
    discount_precent: number;
    final_price: number;
    product_snapshot: {
        name: string;
        image: string;
        description: string;
        base_price: number;
        category_id: string;
        category_name: string;
        subscription_info?: {
            subscription_type_name: string;
            subscription_duration: string;
            subscription_days: number;
            subscription_price: number;
        };
    };
    product: Product;
}

interface Order {
    id: string;
    uid: string;
    note: string;
    voucher: string;
    status: string;
    total_items: number;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

interface UserProfile {
    _id: string;
    fullName: string;
    phone: string;
    email?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export default function OrderDetails() {
    const router = useRouter();
    type Quantities = {
        [productId: string]: number;
    };
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [quantities, setQuantities] = useState<Quantities>({});
    const [selectedMethod, setSelectedMethod] = useState("momo");
    const [maxWidth, setMaxWidth] = useState("200px");
    const [isLoading, setIsLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [order, setOrder] = useState('');
    
    // User information states
    const [user, setUser] = useState<UserProfile | null>(null);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [note, setNote] = useState('');
    
    // Exit confirmation states
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    // Load user data from API
    useEffect(() => {
        const getUserDetail = async () => {
            if (typeof window === 'undefined') return;
            
            const storedUser = localStorage.getItem("nhattin_user");
            if (!storedUser) return;

            try {
                const parsedUser = JSON.parse(storedUser);

                // Check if parsedUser is an object or array
                const userId = Array.isArray(parsedUser) ? parsedUser[0]?._id : parsedUser?._id;

                if (userId) {
                    const token = localStorage.getItem('nhattin_token');
                    if (!token) {
                        console.error('Authentication token not found');
                        return;
                    }

                    const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    const userData = userResponse.data;
                    setUser(userData);
                    setFullName(userData.fullName || '');
                    setPhone(userData.phone || '');
                    setEmail(userData.email || '');
                    
                    console.log("User data fetched from API:", userData);
                } else {
                    console.error("Không tìm thấy _id của user.");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
            }
        };

        getUserDetail();
    }, []);

    const getOrder = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');

            if (!token) {
                console.error('Authentication token not found');
                return;
            }

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Failed to fetch order data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm xử lý khi nhấn nút tăng/giảm
    const increaseQuantity = (productId: string) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: (prev[productId] || 1) + 1,
        }));
    };

    const decreaseQuantity = (productId: string) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max((prev[productId] || 1) - 1, 1),
        }));
    };

    useEffect(() => {
        const fetchOrderData = async () => {
            const orderData = await getOrder();
            setOrder(orderData[0].id);

            if (orderData && orderData.length > 0) {
                const typedOrderData = orderData as Order[];

                // Flatten all items from all orders into a single array
                const allItems = typedOrderData.flatMap(order => order.items);
                setOrderItems(allItems);

                // Initialize quantities from all order items
                const initialQuantities: Quantities = {};
                let total = 0;

                allItems.forEach((item: OrderItem) => {
                    initialQuantities[item.product._id] = item.quantity;
                    // Sử dụng subscription price nếu có, otherwise sử dụng final_price
                    const price = item.product_snapshot.subscription_info?.subscription_price || item.final_price;
                    total += price * item.quantity;
                });

                setQuantities(initialQuantities);
                setTotalAmount(total);
            }
        };
        fetchOrderData();
    }, []);

    // Cập nhật total khi quantities thay đổi
    useEffect(() => {
        if (orderItems.length > 0) {
            let total = 0;
            orderItems.forEach((item: OrderItem) => {
                const quantity = quantities[item.product._id] || item.quantity;
                const price = item.product_snapshot.subscription_info?.subscription_price || item.final_price;
                total += price * quantity;
            });
            setTotalAmount(total);
        }
    }, [quantities, orderItems]);

    useEffect(() => {
        const updateMaxWidth = () => {
            if (typeof window === 'undefined') return;

            if (window.matchMedia("(min-width: 1537px)").matches) {
                setMaxWidth("600px");
            } else if (window.matchMedia("(min-width: 1280px)").matches) {
                setMaxWidth("450px");
            } else if (window.matchMedia("(min-width: 1024px)").matches) {
                setMaxWidth("600px");
            } else if (window.matchMedia("(min-width: 768px)").matches) {
                setMaxWidth("350px");
            } else {
                setMaxWidth("200px");
            }
        };

        window.addEventListener("resize", updateMaxWidth);
        updateMaxWidth();

        return () => window.removeEventListener("resize", updateMaxWidth);
    }, []);

    const paymentMethods = [
        {
            id: "momo",
            label: "Thanh toán bằng ví MoMo",
            logo: "/images/momo.png",
            code: "0856666647"
        },
        {
            id: "MB bank",
            label: "Thanh toán MB bank",
            logo: "/images/Logo_MB_new.png",
            code: "2222226255555"
        },
        {
            id: "agribank",
            label: "Thanh toán Agribank",
            logo: "/images/IconAgribank.png",
            code: "5215888826666"
        },
    ];

    const handlePaymentSubmit = () => {
        // Show the payment popup
        setShowPaymentPopup(true);
    };

    const closePaymentPopup = () => {
        setShowPaymentPopup(false);
    };

    const handlePaymentSuccess = async () => {
        try {
            // Use the order ID from state (this is the correct Order ID)
            if (!order) {
                throw new Error("No order ID found");
            }
            const orderId = order; // Use the order ID from state
            console.log("orderId", orderId);
            const token = localStorage.getItem('nhattin_token');
            
            if (!token) {
                throw new Error("Authentication token not found");
            }
            
            // Create payment record
            const paymentData = {
                id_order: orderId,
                provider: selectedMethod,
                status: "completed",
                amount: totalAmount,
                is_bank_transfer: true,
                bank_name: selectedMethod === "momo" ? "MoMo" : 
                          selectedMethod === "MB bank" ? "MB Bank" : 
                          selectedMethod === "agribank" ? "Agribank" : "Unknown",
                transaction_reference: `${orderId}_${Date.now()}`,
                transfer_date: new Date().toISOString(),
                transfer_note: `${email} - ${phone} - ${fullName}`
            };

            console.log("Creating payment with data:", paymentData);

            // Create payment record
            const paymentResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/payments`,
                paymentData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const paymentId = paymentResponse.data.id;
            console.log("Payment created successfully with ID:", paymentId);

            // Update order status and link to payment
            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/${order}`, 
                { 
                    status: 'completed',
                    id_payment: paymentId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log("Order updated successfully:", response.data);
            
            // Close the popup
            setShowPaymentPopup(false);
            
            // Navigate to the payment success page
            router.push('/payment/success');
        } catch (error) {
            console.error('Error processing payment:', error);
            
            // Show user-friendly error message
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xử lý thanh toán';
                alert(`Lỗi: ${errorMessage}`);
            } else {
                alert('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.');
            }
        }
    };

    // Display user information in the payment popup
    const getUserInfo = () => {
        if (user) {
            return `${user.fullName} (${user.phone})`;
        }
        return "Chưa có thông tin";
    };

    // Function to delete current pending order
    const deleteCurrentOrder = async () => {
        try {
            if (!order) return;
            
            const token = localStorage.getItem('nhattin_token');
            if (!token) return;

            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('✅ Đã xóa đơn hàng cũ:', order);
        } catch (error) {
            console.error('❌ Lỗi khi xóa đơn hàng:', error);
        }
    };

    // Function to handle exit confirmation
    const handleExitConfirmation = () => {
        setShowExitConfirmation(true);
    };

    // Function to confirm exit and delete order
    const confirmExit = async () => {
        setIsExiting(true);
        try {
            await deleteCurrentOrder();
            setShowExitConfirmation(false);
            router.push('/');
        } catch (error) {
            console.error('Lỗi khi thoát:', error);
        } finally {
            setIsExiting(false);
        }
    };

    // Function to cancel exit
    const cancelExit = () => {
        setShowExitConfirmation(false);
    };

    // Handle browser back button and page unload
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (orderItems.length > 0) {
                e.preventDefault();
                e.returnValue = 'Bạn có chắc muốn thoát? Đơn hàng hiện tại sẽ bị hủy.';
                return 'Bạn có chắc muốn thoát? Đơn hàng hiện tại sẽ bị hủy.';
            }
        };

        const handlePopState = (e: PopStateEvent) => {
            if (orderItems.length > 0) {
                e.preventDefault();
                handleExitConfirmation();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [orderItems.length]);

    return (
        <div style={{ backgroundColor: 'var(--clr-bg-1)', padding: "40px 0px" }}>
            {/* Exit Confirmation Popup */}
            {showExitConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full relative shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--clr-txt-1)' }}>Xác nhận thoát</h2>
                            <p className="text-gray-600 text-lg">
                                Bạn có chắc muốn thoát khỏi trang thanh toán? Đơn hàng hiện tại sẽ bị hủy và bạn sẽ mất thông tin đã nhập.
                            </p>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={cancelExit}
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-lg font-medium"
                                disabled={isExiting}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmExit}
                                className="flex-1 py-3 px-4 rounded-md text-white font-medium text-lg"
                                style={{ backgroundColor: '#ef4444' }}
                                disabled={isExiting}
                            >
                                {isExiting ? 'Đang xử lý...' : 'Thoát'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Popup */}
            {showPaymentPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-8 max-w-2xl w-full relative shadow-2xl">
                        <button
                            onClick={closePaymentPopup}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={28} />
                        </button>
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--clr-txt-1)' }}>Xác nhận thanh toán</h2>
                            <p className="text-gray-600 text-lg">Vui lòng quét mã QR để hoàn tất thanh toán</p>
                        </div>

                        <div className="flex justify-center mb-6">
                            {selectedMethod === "momo" && (
                                <div className="text-center">
                                    <Image
                                        src="/images/momo.png"
                                        alt="MoMo QR Code"
                                        width={240}
                                        height={240}
                                        className="mx-auto mb-3 border-4 border-pink-100 rounded-lg p-2"
                                    />
                                    <p className="text-base text-gray-600 font-medium">Quét mã QR bằng ứng dụng MoMo</p>
                                </div>
                            )}

                            {selectedMethod === "MB bank" && (
                                <div className="text-center">
                                    <Image
                                        src="/images/Logo_MB_new.png"
                                        alt="MB Bank QR Code"
                                        width={240}
                                        height={240}
                                        className="mx-auto mb-3 border-4 border-blue-100 rounded-lg p-2"
                                    />
                                    <p className="text-base text-gray-600 font-medium">Quét mã QR bằng ứng dụng MB Bank</p>
                                </div>
                            )}

                            {selectedMethod === "agribank" && (
                                <div className="text-center">
                                    <Image
                                        src="/images/IconAgribank.png"
                                        alt="Agribank QR Code"
                                        width={240}
                                        height={240}
                                        className="mx-auto mb-3 border-4 border-green-100 rounded-lg p-2"
                                    />
                                    <p className="text-base text-gray-600 font-medium">Quét mã QR bằng ứng dụng Agribank</p>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4 mb-4">
                            <div className="flex justify-between mb-3">
                                <span className="font-medium text-lg">Tổng thanh toán:</span>
                                <span className="font-bold text-xl" style={{ color: 'var(--clr-txt-4)' }}>{totalAmount.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between mb-3">
                                <span className="font-medium text-lg">Phương thức:</span>
                                <span className="font-medium text-lg">{
                                    paymentMethods.find(method => method.id === selectedMethod)?.label || selectedMethod
                                }</span>
                            </div>
                            <div className="flex justify-between mb-3">
                                <span className="font-medium text-lg">Khách hàng:</span>
                                <span className="font-medium text-lg">{getUserInfo()}</span>
                            </div>
                            {/* TODO: add code */}
                            <div className="flex justify-between mb-3">
                                <span className="font-medium text-lg">Mã thanh toán:</span>
                                <span className="font-medium text-lg">{paymentMethods.find(method => method.id === selectedMethod)?.code || selectedMethod}</span>
                            </div>
                            <div className="flex flex-col mb-3">
                                <span className="font-semibold text-lg mb-2">Vui lòng chuyển khoản với nội dung: </span>
                                <span className="font-bold text-xl py-2 px-3 bg-gray-100 rounded-md text-center" style={{ color: 'var(--clr-txt-4)' }}>
                                    {email} - {phone} - {fullName}
                                </span>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={closePaymentPopup}
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-lg font-medium"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handlePaymentSuccess}
                                className="flex-1 py-3 px-4 rounded-md text-white font-medium text-lg"
                                style={{ backgroundColor: 'var(--clr-bg-7)' }}
                            >
                                Đã thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto p-4" style={{ backgroundColor: 'var(--clr-bg)', borderRadius: '10px' }}>
                <div className="ml-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 style={{ color: 'var(--clr-txt-1)', fontSize: '30px', marginBottom: '10px', fontWeight: 'bold' }}>Thanh Toán</h2>
                            <h2 className="text-[25px] text-left mb-1">Giỏ hàng</h2>
                            <hr style={{ border: "1px solid var(--clr-bg-5)", width: "60px" }} />
                            <hr style={{ border: "1px solid var(--clr-bg-4)", marginBottom: "20px", width: "65%" }} />
                        </div>
                        <button
                            onClick={handleExitConfirmation}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Thoát</span>
                            </div>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3">
                    <div className='col-span-2' style={{ margin: '0px 10px', padding: '10px' }}>
                        {isLoading ? (
                            <div className="flex items-center justify-center min-h-[200px]">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : orderItems.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-lg text-gray-500">Không có đơn hàng nào</p>
                            </div>
                        ) : (
                            <>
                                {orderItems.map((item) => {
                                    return (
                                        <div key={item.id} className=" m-2 grid grid-cols-1 md:grid-cols-12">
                                            <div className="col-span-10 flex py-6" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }} >
                                                <div className='justify-center items-center flex mx-3 cursor-pointer'>
                                                    <Image
                                                        src="/images/icon/icon28.png"
                                                        alt="Delete icon"
                                                        width={40}
                                                        height={40}
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                </div>
                                                <div className='flex justify-center items-center'>
                                                    <Image
                                                        src={`${item.product_snapshot.image}`}
                                                        alt={item.product_snapshot.name}
                                                        width={100}
                                                        height={100}
                                                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                                                    />
                                                    <div className='mx-3'>
                                                        <h2 style={{
                                                            fontSize: '20px',
                                                            fontWeight: 'bold',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: maxWidth,
                                                        }}>{item.product_snapshot.name}</h2>
                                                        {/* Hiển thị subscription info nếu có */}
                                                        {item.product_snapshot.subscription_info ? (
                                                            <div className='flex my-2'>
                                                                <h2 className='text-[16px] font-bold mr-2'>Gói đăng ký: </h2>
                                                                <span className='text-blue-600 font-medium'>
                                                                    {item.product_snapshot.subscription_info.subscription_type_name}
                                                                    {item.product_snapshot.subscription_info.subscription_duration && (
                                                                        <span> • {item.product_snapshot.subscription_info.subscription_duration}</span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className='flex my-2'>
                                                                <h2 className='text-[16px] font-bold mr-2'>Sản phẩm: </h2>
                                                                <span>{item.product.status}</span>
                                                            </div>
                                                        )}

                                                        <h2 className='text-[23px] font-bold' style={{ color: 'var(--clr-txt-4)' }}>
                                                            {(item.product_snapshot.subscription_info?.subscription_price || item.final_price).toLocaleString('vi-VN')}đ
                                                        </h2>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-span-2 py-6 justify-center' style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                                                <p className="text-[18px] ml-4 font-semibold" style={{ color: 'var(--clr-txt-1)' }}>
                                                    Số lượng:
                                                </p>
                                                <div className="flex my-3 justify-center xl:justify-start items-center">
                                                    <div className="flex mx-4">
                                                        <button
                                                            onClick={() => decreaseQuantity(item.product._id)}
                                                            className="font-semibold rounded-l"
                                                            style={{
                                                                minWidth: '30px',
                                                                minHeight: '30px',
                                                                border: '1px solid var(--clr-bg-3)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faMinus} style={{ color: 'var(--clr-txt-1)', width: '15px', height: '15px' }} />
                                                        </button>
                                                        <div
                                                            className=" flex justify-center items-center"
                                                            style={{
                                                                minWidth: '50px',
                                                                minHeight: '35px',
                                                                fontSize: '20px',
                                                                padding: '0px 20px',
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            {quantities[item.product._id] || 1}
                                                        </div>
                                                        <button
                                                            onClick={() => increaseQuantity(item.product._id)}
                                                            className="font-semibold rounded-r"
                                                            style={{
                                                                minWidth: '30px',
                                                                minHeight: '30px',
                                                                border: '1px solid var(--clr-bg-3)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faPlus} style={{ color: 'var(--clr-txt-1)', width: '15px', height: '15px' }} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className=''>
                                    <h2 style={{ color: 'var(--clr-txt-1)', fontSize: '26px', margin: '20px 0px', fontWeight: 'bold' }}>Thông tin nhận hàng</h2>
                                    <div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <input 
                                                    type="text" 
                                                    placeholder='Họ và tên ...' 
                                                    className='w-full p-2 border border-gray-300 rounded-md text-[18px]' 
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <input 
                                                    type="text" 
                                                    placeholder='Số điện thoại ...' 
                                                    className='w-full p-2 border border-gray-300 rounded-md text-[18px]' 
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <input 
                                                    type="text" 
                                                    placeholder='Địa chỉ Email * ...' 
                                                    className='w-full p-2 border border-gray-300 rounded-md text-[18px]' 
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className='my-4'>
                                            <textarea 
                                                placeholder='Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn.' 
                                                className='w-full p-2 border border-gray-300 rounded-md text-[18px]' 
                                                style={{ minHeight: '150px' }}
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                            />
                                        </div>
                                        <div className='my-4'>
                                            <p>Dữ liệu cá nhân của bạn sẽ được sử dụng để xử lý đơn đặt hàng, hỗ trợ trải nghiệm của bạn trên toàn
                                                bộ trang web này và cho các mục đích khác được mô tả trong <a href='/' style={{ color: 'var(--clr-txt-2)', fontWeight: 'bold' }}>chính sách riêng tư</a>.</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className='col-span-1' style={{ borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', margin: '0px 10px', padding: '10px' }}>
                        <div style={{ margin: '10px 20px', }}>
                            <h2 style={{ color: 'var(--clr-txt-1)', fontSize: '26px', fontWeight: 'bold' }}>Đơn hàng của bạn</h2>
                            <div className="my-3">
                                <h2 style={{ color: 'var(--clr-txt-2)', fontSize: '20px', fontWeight: 'semi-bold', marginBottom: '10px' }}>Nhập mã ưu đãi!</h2>
                                <div className='relative'>
                                    <input
                                        type="text"
                                        className="w-full py-3 px-3 pr-[80px] rounded-md text-[18px]"
                                        style={{ border: '1px solid var(--clr-bg-3)' }}
                                    />
                                    <button
                                        className="absolute right-[7px] top-[7px] cursor-pointer rounded-md"
                                        style={{ color: 'var(--clr-txt-3)', backgroundColor: 'var(--clr-bg-4)' }}
                                    >
                                        <Image
                                            src="/images/icon/icon29.png"
                                            alt="Apply coupon"
                                            width={45}
                                            height={40}
                                            style={{ width: '45px', height: '40px' }}
                                        />
                                    </button>
                                </div>
                                <div>
                                    <div className="mt-6 border-b">
                                        <div className="flex justify-between my-4">
                                            <p className="font-medium">Tạm tính</p>
                                            <p className="font-medium">{totalAmount.toLocaleString()}đ</p>
                                        </div>
                                        <div className="flex justify-between mb-6">
                                            <p className="font-semibold">Tổng</p>
                                            <p className="font-semibold">{totalAmount.toLocaleString()}đ</p>
                                        </div>
                                    </div>
                                    <div className="p-4 w-full justify-center">
                                        <div>
                                            {paymentMethods.map((method) => (
                                                <div
                                                    key={method.id}
                                                    className={`items-center border rounded-md mb-3 ${method.id === "momo" ? "text-blue-600" : selectedMethod === method.id ? "border-blue-500" : "border-gray-300"
                                                        }`}
                                                >
                                                    <div
                                                        className="flex items-center justify-between p-3"
                                                        onClick={() => setSelectedMethod(method.id)}
                                                    >
                                                        <div className="flex items-center">
                                                            <p className="font-medium mr-2">{method.label}</p>
                                                            <Image
                                                                src={method.logo}
                                                                alt={method.label}
                                                                width={40}
                                                                height={40}
                                                                className="w-10 mr-3"
                                                            />
                                                        </div>
                                                        <input
                                                            type="radio"
                                                            name="payment"
                                                            value={method.id}
                                                            checked={selectedMethod === method.id}
                                                            onChange={() => setSelectedMethod(method.id)}
                                                            className="mr-3 w-5 h-5"
                                                        />
                                                    </div>

                                                    {/* Hiển thị dòng thông báo cho MoMo dù được chọn hay không */}
                                                    {/* {method.id === "momo" && (
                                                        <div className="border-t rounded-b-md p-3">
                                                            <p className="text-sm text-gray-600">
                                                                Quét mã thanh toán tới nhà cung cấp dịch vụ là GAMIKEY
                                                            </p>
                                                        </div>
                                                    )} */}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            className="w-full py-2 rounded-md mt-4 flex items-center justify-center cursor-pointer"
                                            style={{ backgroundColor: 'var(--clr-bg-7)', color: 'var(--clr-txt-5)', fontWeight: 'bold' }}
                                            onClick={handlePaymentSubmit}
                                        >
                                            Đặt Hàng
                                            <Image
                                                src="/images/icon/icon30.png"
                                                alt="Order icon"
                                                width={24}
                                                height={24}
                                                style={{ marginLeft: '10px' }}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
