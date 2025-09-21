import { Badge } from "@/components/ui/badge";
import { 
    Clock, 
    CheckCircle, 
    XCircle 
} from "lucide-react";

interface PaymentStatusBadgeProps {
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    showIcon?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
    PENDING: { 
        label: 'Chờ thanh toán', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock
    },
    COMPLETED: { 
        label: 'Đã thanh toán', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle
    },
    FAILED: { 
        label: 'Thanh toán thất bại', 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle
    },
};

const sizeConfig = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
};

export default function PaymentStatusBadge({ 
    status, 
    showIcon = false, 
    size = 'md' 
}: PaymentStatusBadgeProps) {
    const config = statusConfig[status];
    const Icon = config.icon;
    const sizeClass = sizeConfig[size];

    return (
        <Badge 
            className={`${config.color} ${sizeClass} border`}
            variant="outline"
        >
            {showIcon && <Icon className="h-3 w-3 mr-1" />}
            {config.label}
        </Badge>
    );
}
