import { PaymentStatus as PaymentStatusEnum } from '@/types/payment';

interface PaymentStatusProps {
    status: PaymentStatusEnum;
    className?: string;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ 
    status, 
    className = "" 
}) => {
    const getStatusColor = (status: PaymentStatusEnum) => {
        switch (status) {
            case PaymentStatusEnum.COMPLETED:
                return 'bg-green-100 text-green-800 border-green-200';
            case PaymentStatusEnum.PENDING:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case PaymentStatusEnum.PROCESSING:
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case PaymentStatusEnum.FAILED:
                return 'bg-red-100 text-red-800 border-red-200';
            case PaymentStatusEnum.REFUNDED:
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (status: PaymentStatusEnum) => {
        switch (status) {
            case PaymentStatusEnum.COMPLETED:
                return 'Đã thanh toán';
            case PaymentStatusEnum.PENDING:
                return 'Chờ thanh toán';
            case PaymentStatusEnum.PROCESSING:
                return 'Đang xử lý';
            case PaymentStatusEnum.FAILED:
                return 'Thanh toán thất bại';
            case PaymentStatusEnum.REFUNDED:
                return 'Đã hoàn tiền';
            default:
                return status;
        }
    };

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)} ${className}`}>
            {getStatusLabel(status)}
        </span>
    );
};

export default PaymentStatus;
