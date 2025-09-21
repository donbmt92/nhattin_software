import { Badge } from "@/components/ui/badge";
import { 
    Clock, 
    CheckCircle, 
    Truck, 
    XCircle 
} from "lucide-react";

interface OrderStatusBadgeProps {
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed' | 'refunded';
    showIcon?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
    pending: { 
        label: 'Chờ xác nhận', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock
    },
    processing: { 
        label: 'Đang xử lý', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle
    },
    completed: { 
        label: 'Hoàn thành', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle
    },
    cancelled: { 
        label: 'Đã hủy', 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle
    },
    failed: { 
        label: 'Thất bại', 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle
    },
    refunded: { 
        label: 'Đã hoàn tiền', 
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: XCircle
    },
};

const sizeConfig = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
};

export default function OrderStatusBadge({ 
    status, 
    showIcon = false, 
    size = 'md' 
}: OrderStatusBadgeProps) {
    const config = statusConfig[status];
    const Icon = config.icon;
    const sizeClass = sizeConfig[size];

    return (
        <Badge 
            className={`${config.color} ${sizeClass} border`}
            variant="secondary"
        >
            {showIcon && <Icon className="h-3 w-3 mr-1" />}
            {config.label}
        </Badge>
    );
}
