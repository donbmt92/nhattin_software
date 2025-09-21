import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Users, DollarSign, Calendar } from "lucide-react";

interface AffiliateInfoProps {
    affiliateCode?: string;
    commissionAmount?: number;
    commissionStatus?: string;
    commissionPaidDate?: string;
}

const commissionStatusConfig = {
    PENDING: { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800' },
    PAID: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
};

export default function AffiliateInfo({ 
    affiliateCode, 
    commissionAmount, 
    commissionStatus, 
    commissionPaidDate 
}: AffiliateInfoProps) {
    if (!affiliateCode) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Thông tin Affiliate
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between">
                    <span>Mã Affiliate:</span>
                    <span className="font-mono text-sm">{affiliateCode}</span>
                </div>
                
                {commissionAmount && (
                    <div className="flex justify-between">
                        <span>Hoa hồng:</span>
                        <span className="font-medium text-green-600">
                            {commissionAmount.toLocaleString('vi-VN')} VND
                        </span>
                    </div>
                )}
                
                {commissionStatus && (
                    <div className="flex items-center justify-between">
                        <span>Trạng thái:</span>
                        <Badge className={commissionStatusConfig[commissionStatus as keyof typeof commissionStatusConfig]?.color || 'bg-gray-100 text-gray-800'}>
                            {commissionStatusConfig[commissionStatus as keyof typeof commissionStatusConfig]?.label || commissionStatus}
                        </Badge>
                    </div>
                )}
                
                {commissionPaidDate && (
                    <div className="flex items-center justify-between">
                        <span>Ngày thanh toán:</span>
                        <span className="text-sm text-gray-500">
                            {new Date(commissionPaidDate).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
