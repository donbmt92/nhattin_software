import { Payment } from '@/types/payment';

interface ProductInfoProps {
    payment: Payment;
    className?: string;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ 
    payment, 
    className = "max-w-[200px]" 
}) => {
    if (!payment.order_snapshot?.items || payment.order_snapshot.items.length === 0) {
        return <div className="text-sm text-gray-500">N/A</div>;
    }

    const items = payment.order_snapshot.items;
    const displayItems = items.slice(0, 2);
    const remainingCount = items.length - 2;

    return (
        <div className={className}>
            <div className="space-y-1">
                {displayItems.map((item, index) => (
                    <div key={index} className="text-xs">
                        <div className="font-medium truncate">
                            {item.product_snapshot?.name || 'Sản phẩm'}
                        </div>
                        <div className="text-gray-500">
                            SL: {item.quantity} - {item.final_price.toLocaleString('vi-VN')} VND
                        </div>
                    </div>
                ))}
                {remainingCount > 0 && (
                    <div className="text-xs text-gray-500">
                        +{remainingCount} sản phẩm khác
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductInfo;
