"use client";
import { faMinus, faPlus, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { buyNow, getAffiliateCodeFromUrl, extractProductId, clearAffiliateCode } from '../../../../services/orderService'
import { useCart } from '@/context/CartContext'
import ProductHeaderAffiliate from '../../components/ProductHeaderAffiliate'
import api from '@/app/components/utils/api'

// The component that handles all the UI rendering
export default function ProductDetailComponent({
    products,
    subcriptionTypes,
    subcriptionDurations
}: {
    products: any[];
    subcriptionTypes: any[];
    subcriptionDurations: any[];
}) {
    const router = useRouter();
    const { addToCart } = useCart();
    const [selectedSubscriptionType, setSelectedSubscriptionType] = useState<any | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<any | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [affiliateCode, setAffiliateCode] = useState<string | undefined>(undefined);

    // Lấy durations từ subscription type đã chọn
    const availableDurations = selectedSubscriptionType?.durations || [];

    // Check for affiliate code on component mount
    React.useEffect(() => {
        const code = getAffiliateCodeFromUrl();
        setAffiliateCode(code);
    }, []);

    // Hàm xử lý khi nhấn nút trừ
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Hàm xử lý khi nhấn nút cộng
    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    // Hàm xử lý thêm vào giỏ hàng
    const handleAddToCart = async (product: any) => {
        try {
            setIsLoading(true);
            setError(null);
            
            console.log('Adding to cart:', product);
            await addToCart(product);
            
        } catch (error: any) {
            setError(error.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
            console.error('Add to cart error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm xử lý mua ngay
    const handleBuyNow = async (product: any) => {
        try {
            setIsLoading(true);
            setError(null);

            // Extract valid MongoDB ObjectId từ product data
            const productId = extractProductId(product);
            console.log('Extracted product ID:', productId);

            // Lấy thông tin user từ localStorage
            const storedUser = localStorage.getItem("nhattin_user");
            if (!storedUser) {
                throw new Error('Bạn cần đăng nhập để thực hiện mua hàng');
            }

            const user = JSON.parse(storedUser);
            console.log('🔍 User data from localStorage:', user);
            
            // Kiểm tra email trong các thuộc tính có thể có
            let userEmail = user.email || user.Email || user.userEmail;
            
            if (!userEmail) {
                // Nếu không có email trong localStorage, thử lấy từ API
                try {
                    const token = localStorage.getItem('nhattin_token');
                    if (token) {
                        const response = await api.get('/auth/verify-token');
                        if (response.data && response.data.email) {
                            userEmail = response.data.email;
                            console.log('✅ Got email from API:', userEmail);
                        }
                    }
                } catch (apiError) {
                    console.warn('Could not get email from API:', apiError);
                }
            }
            
            if (!userEmail) {
                throw new Error('Không tìm thấy email của người dùng. Vui lòng đăng nhập lại.');
            }

            const buyNowData = {
                id_product: productId,
                quantity: quantity,
                note: 'Mua ngay',
                affiliateCode: getAffiliateCodeFromUrl(),
                userEmail: userEmail,
                // Thêm thông tin subscription và duration (đã được validate ở trên)
                subscription_type_id: selectedSubscriptionType._id,
                subscription_duration_id: selectedDuration._id,
                subscription_type_name: selectedSubscriptionType.type_name,
                subscription_duration: selectedDuration.duration,
                subscription_days: selectedDuration.days,
                subscription_price: selectedDuration.price,
                total_price: Number(selectedDuration.price) * quantity
            };

            console.log('Buy now data:', buyNowData);
            const order = await buyNow(buyNowData);
            
            // Redirect đến trang order sau khi tạo đơn hàng thành công
            router.push('/order');
            
        } catch (error: any) {
            setError(error.message || 'Có lỗi xảy ra khi mua ngay');
            console.error('Buy now error:', error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="container mx-auto my-6">
            {products.map((prd, index) => (
                <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-col-1" key={index}>
                    <div className='flex justify-center items-center md:col-span-5'>
                        <Image src={prd.image} alt="" style={{ borderRadius: "10px", width: "100%" }} width={1000} height={100} />
                    </div>
                    <div className="md:col-span-1 mx-6"></div>
                    <div className="md:col-span-6 mx-6">

                        <div>
                            <div className="flex items-center mt-8">
                                {/* Tên sản phẩm chiếm 10 phần */}
                                <p className="font-semibold text-[40px] text-left text-ellipsis overflow-hidden"
                                    style={{ color: 'var(--clr-txt-1)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flex: '11' }}>
                                    {prd.name}
                                </p>

                                {/* Affiliate Button */}
                                <div className="mx-2">
                                    <ProductHeaderAffiliate 
                                        productId={prd._id.id}
                                        productName={prd.name}
                                    />
                                </div>

                                {/* Danh mục chiếm 2 phần */}
                                <p className="text-[16px] px-3 py-1 border rounded-md text-center"
                                    style={{ color: 'var(--clr-txt-2)', borderColor: 'var(--clr-txt-2)', flex: '1', minWidth: 'fit-content' }}>
                                    {prd.id_category.name}
                                </p>
                            </div>
                            
                            {/* Affiliate Code Banner */}
                            {affiliateCode && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                            <span className="text-sm text-blue-800 font-medium">
                                                Bạn đang sử dụng affiliate link
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">
                                                {affiliateCode}
                                            </code>
                                            <button
                                                onClick={() => {
                                                    clearAffiliateCode();
                                                    setAffiliateCode(undefined);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between items-center my-3">
                                <div className="flex items-center mx-1">
                                    <div className="flex mr-3">
                                        <FontAwesomeIcon icon={faStar} style={{ color: 'var(--clr-txt-4)', width: '20px', height: '20px', marginTop: '2px' }} />
                                        <p className="text-[18px] mx-2" style={{ color: 'var(--clr-txt-1)' }}>
                                            5.0
                                        </p>

                                    </div>
                                    |
                                    <div className="flex mx-2">
                                        <p
                                            className="text-[18px] mx-2"
                                            style={{ color: 'var(--clr-txt-1)' }}
                                        >
                                            <span
                                                style={{
                                                    color: 'var(--clr-txt-4)',
                                                    margin: '0px 5px',
                                                    position: 'relative',
                                                    display: 'inline-block',
                                                }}
                                            >
                                                {prd.sales}
                                                <span
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '-3px',
                                                        left: '0',
                                                        right: '0',
                                                        height: '2px',
                                                        backgroundColor: 'var(--clr-txt-4)',
                                                    }}
                                                />
                                            </span>
                                            Đánh Giá
                                        </p>
                                    </div>
                                    |
                                    <div className="flex mx-2">
                                        <p className="text-[18px] mx-2" style={{ color: 'var(--clr-txt-1)' }}>
                                            <span style={{ color: 'var(--clr-txt-4)', margin: '0px 5px' }}>{prd.sales}</span> Đã Bán
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-start items-end my-2">
                                {selectedDuration ? (
                                    <p className="text-[35px] mr-2 font-semibold" style={{ color: 'var(--clr-txt-4)' }}>
                                        {Number(selectedDuration.price).toLocaleString('vi-VN')} đ
                                    </p>
                                ) : (
                                    <p className="text-[35px] mr-2 font-semibold" style={{ color: 'var(--clr-txt-4)' }}>
                                        {Number(prd.base_price).toLocaleString('vi-VN')} đ - {Number(prd.base_price).toLocaleString('vi-VN')} đ
                                    </p>
                                )}
                            </div>
                            <div className=" justify-start items-end my-2">
                                <p className="text-[22px] mr-2 font-semibold my-3" style={{ color: 'var(--clr-txt-1)' }}>
                                    Gói đăng ký:
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-0">
                                    {subcriptionTypes.map((subtype) => (
                                        <div key={subtype._id} className="flex my-2 justify-center items-center">
                                            <button
                                                className="mx-3 rounded-full"
                                                onClick={() => {
                                                    setSelectedSubscriptionType(subtype);
                                                    setSelectedDuration(null); // Reset duration khi chọn subscription type mới
                                                }}
                                                style={{
                                                    padding: "10px 10px",
                                                    color: selectedSubscriptionType?._id === subtype._id ? "var(--clr-txt-3)" : "var(--clr-txt-2)",
                                                    backgroundColor: selectedSubscriptionType?._id === subtype._id ? "var(--clr-bg-4)" : "var(--clr-bg)",
                                                    fontSize: "16px",
                                                    border: "1px solid var(--clr-bg-3)",
                                                    fontWeight: "bold",
                                                    minWidth: "150px",
                                                }}
                                            >
                                                {subtype.type_name}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Hiển thị durations chỉ khi đã chọn subscription type */}
                            {selectedSubscriptionType && (
                                <div className=" justify-start items-end my-2">
                                    <p className="text-[22px] mr-2 font-semibold my-3" style={{ color: 'var(--clr-txt-1)' }}>
                                        Thời hạn ({selectedSubscriptionType.type_name}):
                                    </p>
                                    <div className="grid grid-cols-2 xl:grid-cols-4 md:grid-cols-3 gap-0">
                                        {availableDurations.map((duration: any) => (
                                            <div key={duration._id} className="flex my-3 justify-center items-center">
                                                <button
                                                    className="mx-3 rounded-full"
                                                    onClick={() => setSelectedDuration(duration)}
                                                    style={{
                                                        padding: '10px 10px',
                                                        color: selectedDuration?._id === duration._id ? 'var(--clr-txt-3)' : 'var(--clr-txt-2)',
                                                        backgroundColor: selectedDuration?._id === duration._id ? 'var(--clr-bg-4)' : 'var(--clr-bg)',
                                                        fontSize: '16px',
                                                        border: '1px solid var(--clr-bg-3)',
                                                        fontWeight: 'bold',
                                                        minWidth: '150px',
                                                    }}
                                                >
                                                    {duration.duration}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Hiển thị giá của duration đã chọn */}
                                    {selectedDuration && (
                                        <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--clr-bg-2)', border: '1px solid var(--clr-bg-3)' }}>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-lg font-semibold" style={{ color: 'var(--clr-txt-1)' }}>
                                                        {selectedDuration.duration}
                                                    </p>
                                                    <p className="text-sm" style={{ color: 'var(--clr-txt-2)' }}>
                                                        {selectedDuration.days} ngày
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold" style={{ color: 'var(--clr-txt-4)' }}>
                                                        {Number(selectedDuration.price).toLocaleString('vi-VN')} đ
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Hiển thị tổng tiền khi đã chọn đầy đủ */}
                            {selectedSubscriptionType && selectedDuration && (
                                <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--clr-bg-4)', border: '2px solid var(--clr-txt-4)' }}>
                                    <div className="text-center">
                                        <p className="text-lg font-semibold mb-2" style={{ color: 'var(--clr-txt-1)' }}>
                                            Tổng tiền ({quantity} {quantity > 1 ? 'gói' : 'gói'}):
                                        </p>
                                        <p className="text-3xl font-bold" style={{ color: 'var(--clr-txt-4)' }}>
                                            {(Number(selectedDuration.price) * quantity).toLocaleString('vi-VN')} đ
                                        </p>
                                        <p className="text-sm mt-1" style={{ color: 'var(--clr-txt-2)' }}>
                                            {selectedSubscriptionType.type_name} • {selectedDuration.duration} • {selectedDuration.days} ngày
                                        </p>
                                    </div>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 xl:grid-cols-2">
                                <div className="flex my-3 justify-center xl:justify-start items-center">
                                    <p className="text-[22px] mr-6 font-semibold" style={{ color: 'var(--clr-txt-1)' }}>
                                        Số lượng:
                                    </p>
                                    <div className="flex mx-4">
                                        <button
                                            onClick={decreaseQuantity}
                                            className="font-semibold rounded-l"
                                            style={{
                                                minWidth: '35px',
                                                minHeight: '35px',
                                                border: '1px solid var(--clr-bg-3)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            disabled={quantity <= 1}
                                        >
                                            <FontAwesomeIcon icon={faMinus} style={{ color: 'var(--clr-txt-1)', width: '15px', height: '15px' }} />
                                        </button>
                                        <div
                                            className=" flex justify-center items-center"
                                            style={{
                                                minWidth: '70px',
                                                minHeight: '35px',
                                                fontSize: '20px',
                                                padding: '0px 20px',
                                                textAlign: 'center',
                                                border: '1px solid var(--clr-bg-3)'
                                            }}
                                        >
                                            {quantity}
                                        </div>
                                        <button
                                            onClick={increaseQuantity}
                                            className="font-semibold rounded-r"
                                            style={{
                                                minWidth: '35px',
                                                minHeight: '35px',
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
                                <div className='flex my-3 justify-center items-center'>
                                    <p className="text-[20px] mx-7" style={{ color: 'var(--clr-txt-1)' }}>
                                        <span style={{ color: 'var(--clr-txt-4)', margin: '0px 5px' }}>{prd.sales}</span> Sản phẩm có sẵn
                                    </p>
                                </div>

                            </div>
                            {/* Error message */}
                            {error && (
                                <div className="my-3 p-3 rounded-md" style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca' }}>
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Thông báo khi chưa chọn đầy đủ */}
                            {(!selectedSubscriptionType || !selectedDuration) && (
                                <div className="my-4 p-3 rounded-md" style={{ backgroundColor: '#fef3c7', border: '1px solid #fbbf24' }}>
                                    <p className="text-yellow-800 text-sm">
                                        {!selectedSubscriptionType ? 'Vui lòng chọn gói đăng ký' : 'Vui lòng chọn thời hạn'}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-center items-center my-5">
                                <button 
                                    className=" rounded-md px-[30px] md:px-[60px] py-[3px]"
                                    style={{
                                        color: 'var(--clr-txt-2)',
                                        border: '1px solid var(--clr-bg-3)',
                                        fontSize: '18px',
                                        marginRight: '15px',
                                        opacity: (isLoading || !selectedSubscriptionType || !selectedDuration) ? 0.5 : 1,
                                        cursor: (isLoading || !selectedSubscriptionType || !selectedDuration) ? 'not-allowed' : 'pointer'
                                    }}
                                    onClick={() => handleAddToCart(prd)}
                                    disabled={isLoading || !selectedSubscriptionType || !selectedDuration}
                                >
                                    <div className="flex justify-center items-center mx-auto">
                                        <Image src="/images/icon/icon18.png" alt="" style={{ width: '25px', height: '25px', textAlign: 'center' }} width={100} height={100} />
                                    </div>
                                    <div>{isLoading ? 'Đang xử lý...' : 'Thêm vào giỏ'}</div>
                                </button>
                                &nbsp;
                                <button 
                                    className=" rounded-md flex px-[30px] md:px-[60px] py-[15px]"
                                    style={{ 
                                        color: 'var(--clr-txt-3)', 
                                        backgroundColor: 'var(--clr-bg-6)', 
                                        fontSize: '18px',
                                        opacity: (isLoading || !selectedSubscriptionType || !selectedDuration) ? 0.5 : 1,
                                        cursor: (isLoading || !selectedSubscriptionType || !selectedDuration) ? 'not-allowed' : 'pointer'
                                    }}
                                    onClick={() => handleBuyNow(prd)}
                                    disabled={isLoading || !selectedSubscriptionType || !selectedDuration}
                                >
                                    {isLoading ? 'Đang xử lý...' : 'Mua ngay'}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            ))}
        </div>
    )
} 