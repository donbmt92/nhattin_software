"use client";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Badge
} from "@/components/ui/badge";
import {
    Loader2, 
    ArrowLeft, 
    Package, 
    User, 
    CreditCard, 
    Calendar,
    Clock,
    MapPin,
    Phone,
    Mail,
    Truck,
    CheckCircle,
    XCircle
} from "lucide-react";
import Image from "next/image";
import axios from 'axios';
import AffiliateInfo from "../components/AffiliateInfo";

interface OrderItem {
    id: string;
    quantity: number;
    old_price: number;
    discount_precent: number;
    final_price: number;
    product_snapshot?: {
        name: string;
        image: string;
        description: string;
        base_price: number;
        category_id: string;
        category_name: string;
    };
}

interface Order {
    id: string;
    uid: string;
    user?: {
        _id: string;
        fullName: string;
        phone: string;
        email: string;
        role: string;
        image?: string;
        affiliateCode?: string;
        isAffiliate?: boolean;
    };
    items: string[]; // Array of OrderItem IDs
    total_items: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed' | 'refunded';
    note: string;
    voucher?: string;
    created_at: string;
    updated_at: string;
    id_payment?: string;
    payment_status?: 'PENDING' | 'COMPLETED' | 'FAILED';
    affiliateCode?: string;
    commissionAmount?: number;
    commissionStatus?: string;
    shipping_address?: {
        name: string;
        address: string;
        city: string;
        district: string;
        ward: string;
    };
    payment_method?: string;
}

const statusConfig = {
    pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle },
    failed: { label: 'Thất bại', color: 'bg-red-100 text-red-800', icon: XCircle },
    refunded: { label: 'Đã hoàn tiền', color: 'bg-gray-100 text-gray-800', icon: XCircle },
};

const paymentStatusConfig = {
    PENDING: { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800' },
    COMPLETED: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
    FAILED: { label: 'Thanh toán thất bại', color: 'bg-red-100 text-red-800' },
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    const fetchOrder = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');
            if (!token) {
                setError('Vui lòng đăng nhập để xem chi tiết đơn hàng');
                return;
            }

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Parse user data from string JSON
            let parsedUser = null;
            try {
                if (typeof response.data.uid === 'string' && response.data.uid.includes('ObjectId')) {
                    const userDataMatch = response.data.uid.match(/\{[\s\S]*\}/);
                    if (userDataMatch) {
                        parsedUser = JSON.parse(userDataMatch[0]);
                    }
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
            
            setOrder({
                ...response.data,
                user: parsedUser
            });
        } catch (error) {
            console.error('Error fetching order:', error);
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Không thể tải thông tin đơn hàng');
            } else {
                setError('Không thể tải thông tin đơn hàng');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [params.id]);

    const handleStatusUpdate = async (newStatus: string) => {
        const token = localStorage.getItem('nhattin_token');
        if (!token) {
            alert('Vui lòng đăng nhập để cập nhật trạng thái đơn hàng');
            return;
        }

        try {
            setUpdating(true);
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/${params.id}`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            
            await fetchOrder();
            alert('Cập nhật trạng thái đơn hàng thành công');
        } catch (error) {
            console.error('Error updating order status:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng');
            } else {
                alert('Không thể cập nhật trạng thái đơn hàng');
            }
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="text-center py-6 text-red-500">
                        {error || 'Không tìm thấy đơn hàng'}
                    </CardContent>
                </Card>
            </div>
        );
    }

    const StatusIcon = statusConfig[order.status].icon;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/orders">
                        <Button variant="secondary" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
                        <p className="text-gray-500">Mã đơn hàng: #{order.id.slice(-8)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <StatusIcon className="h-5 w-5" />
                    <Badge className={statusConfig[order.status].color}>
                        {statusConfig[order.status].label}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Sản phẩm trong đơn hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sản phẩm</TableHead>
                                        <TableHead>Số lượng</TableHead>
                                        <TableHead>Đơn giá</TableHead>
                                        <TableHead>Thành tiền</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-gray-500">
                                            {order.total_items} sản phẩm (Chi tiết items sẽ được load từ API riêng)
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Order Notes */}
                    {order.note && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Ghi chú đơn hàng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{order.note}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cập nhật trạng thái</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select
                                value={order.status}
                                onValueChange={handleStatusUpdate}
                                disabled={updating}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                    <SelectItem value="processing">Đang xử lý</SelectItem>
                                    <SelectItem value="completed">Hoàn thành</SelectItem>
                                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                                    <SelectItem value="failed">Thất bại</SelectItem>
                                    <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                                </SelectContent>
                            </Select>
                            {updating && (
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Đang cập nhật...
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Thông tin khách hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span>{order.user?.fullName || 'Khách hàng'}</span>
                            </div>
                            {order.user?.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span>{order.user.phone}</span>
                                </div>
                            )}
                            {order.user?.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span>{order.user.email}</span>
                                </div>
                            )}
                            {order.shipping_address && (
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                    <div>
                                        <div>{order.shipping_address.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {order.shipping_address.address}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {order.shipping_address.ward}, {order.shipping_address.district}, {order.shipping_address.city}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Thanh toán
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span>Tổng tiền:</span>
                                <span className="font-medium">{order.commissionAmount ? order.commissionAmount.toLocaleString('vi-VN') : 'N/A'} VND</span>
                            </div>
                            {order.voucher && (
                                <div className="flex justify-between text-green-600">
                                    <span>Voucher:</span>
                                    <span>{order.voucher}</span>
                                </div>
                            )}
                            {order.payment_status && (
                                <div className="flex items-center gap-2">
                                    <span>Trạng thái:</span>
                                    <Badge className={paymentStatusConfig[order.payment_status].color}>
                                        {paymentStatusConfig[order.payment_status].label}
                                    </Badge>
                                </div>
                            )}
                            {order.payment_method && (
                                <div className="flex justify-between">
                                    <span>Phương thức:</span>
                                    <span>{order.payment_method}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Thời gian
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span>Tạo đơn:</span>
                                <span className="text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleString('vi-VN')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Cập nhật:</span>
                                <span className="text-sm text-gray-500">
                                    {new Date(order.updated_at).toLocaleString('vi-VN')}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Affiliate Info */}
                    <AffiliateInfo
                        affiliateCode={order.affiliateCode}
                        commissionAmount={order.commissionAmount}
                        commissionStatus={order.commissionStatus}
                    />
                </div>
            </div>
        </div>
    );
}
