import { Payment } from '@/types/payment';

interface OrderInfoProps {
    payment: Payment;
    className?: string;
}

export const OrderInfo: React.FC<OrderInfoProps> = ({ 
    payment, 
    className = "max-w-[150px]" 
}) => {
    const getOrderId = () => {
        if (payment.order_snapshot?.id) {
            return `#${payment.order_snapshot.id.slice(-8)}`;
        }
        if (payment.id_order) {
            return `#${payment.id_order.slice(-8)}`;
        }
        return 'Không có đơn hàng';
    };

    const getOrderItems = () => {
        if (payment.order_snapshot?.total_items) {
            return `${payment.order_snapshot.total_items} sản phẩm`;
        }
        if (payment.order?.total_items) {
            return `${payment.order.total_items} sản phẩm`;
        }
        return 'Thanh toán trực tiếp';
    };

    return (
        <div className={className}>
            <div className="text-sm font-medium">
                {getOrderId()}
            </div>
            <div className="text-xs text-gray-500">
                {getOrderItems()}
            </div>
        </div>
    );
};

export default OrderInfo;
