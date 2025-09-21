"use client";
import { useState } from 'react';
import { Payment } from '@/types/payment';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Package, Eye } from 'lucide-react';

interface ProductInfoWithPopupProps {
    payment: Payment;
    className?: string;
}

export const ProductInfoWithPopup: React.FC<ProductInfoWithPopupProps> = ({ 
    payment, 
    className = "max-w-[120px]" 
}) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!payment.order_snapshot?.items || payment.order_snapshot.items.length === 0) {
        return <div className="text-sm text-gray-500">N/A</div>;
    }

    const items = payment.order_snapshot.items;
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className={className}>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto p-2 hover:bg-gray-100"
                    >
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-600" />
                            <div className="text-left">
                                <div className="text-sm font-medium">
                                    {totalItems} sản phẩm
                                </div>
                                <div className="text-xs text-gray-500">
                                    {totalQuantity} món
                                </div>
                            </div>
                            <Eye className="h-3 w-3 text-gray-400" />
                        </div>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Chi tiết sản phẩm trong đơn hàng
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                        {/* Thông tin tổng quan */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Tổng sản phẩm:</span>
                                    <span className="ml-2 text-blue-600 font-semibold">{totalItems}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Tổng số lượng:</span>
                                    <span className="ml-2 text-green-600 font-semibold">{totalQuantity}</span>
                                </div>
                            </div>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Danh sách sản phẩm:</h4>
                            {items.map((item, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                {item.product_snapshot?.image && (
                                                    <img 
                                                        src={item.product_snapshot.image} 
                                                        alt={item.product_snapshot.name}
                                                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-gray-900 mb-1">
                                                        {item.product_snapshot?.name || 'Sản phẩm không xác định'}
                                                    </h5>
                                                    {item.product_snapshot?.description && (
                                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                            {item.product_snapshot.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span>
                                                            <span className="font-medium">SL:</span> {item.quantity}
                                                        </span>
                                                        <span>
                                                            <span className="font-medium">Giá gốc:</span> {item.old_price?.toLocaleString('vi-VN')} VND
                                                        </span>
                                                        <span>
                                                            <span className="font-medium">Giảm:</span> {item.discount_precent || 0}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-semibold text-green-600">
                                                {item.final_price?.toLocaleString('vi-VN')} VND
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                / {item.quantity} món
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tổng kết */}
                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>Tổng giá trị đơn hàng:</span>
                                <span className="text-green-600">
                                    {items.reduce((sum, item) => sum + (item.final_price * item.quantity), 0).toLocaleString('vi-VN')} VND
                                </span>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductInfoWithPopup;
