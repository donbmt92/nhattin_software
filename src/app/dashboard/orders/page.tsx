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
import { Loader2, Eye, Package, Calendar } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import OrderFilters from "./components/OrderFilters";
import OrderStatusBadge from "./components/OrderStatusBadge";
import PaymentStatusBadge from "./components/PaymentStatusBadge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from 'axios';

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
}


export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');
            if (!token) {
                setError('Vui lòng đăng nhập để xem danh sách đơn hàng');
                return;
            }

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (Array.isArray(response.data)) {
                // Parse user data from string JSON
                const processedOrders = response.data.map(order => {
                    let parsedUser = null;
                    try {
                        if (typeof order.uid === 'string' && order.uid.includes('ObjectId')) {
                            // Parse the user data from the stringified JSON
                            const userDataMatch = order.uid.match(/\{[\s\S]*\}/);
                            if (userDataMatch) {
                                parsedUser = JSON.parse(userDataMatch[0]);
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing user data:', error);
                    }
                    
                    return {
                        ...order,
                        user: parsedUser
                    };
                });
                setOrders(processedOrders);
            } else {
                setError('Định dạng dữ liệu không hợp lệ từ máy chủ');
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Không thể tải danh sách đơn hàng');
            } else {
                setError('Không thể tải danh sách đơn hàng');
            }
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        const token = localStorage.getItem('nhattin_token');
        if (!token) {
            alert('Vui lòng đăng nhập để cập nhật trạng thái đơn hàng');
            return;
        }

        try {
            setLoading(true);
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            
            await fetchOrders();
            alert('Cập nhật trạng thái đơn hàng thành công');
        } catch (error) {
            console.error('Error updating order status:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng');
            } else {
                alert('Không thể cập nhật trạng thái đơn hàng');
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        console.log("data order", order);
        
        const matchesSearch = 
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.phone?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesPaymentStatus = paymentStatusFilter === "all" || order.payment_status === paymentStatusFilter;
        
        return matchesSearch && matchesStatus && matchesPaymentStatus;
    });

    if (error) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="text-center py-6 text-red-500">
                        {error}
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Quản lý Đơn hàng
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                            Tổng: {filteredOrders.length} đơn hàng
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <OrderFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        paymentStatusFilter={paymentStatusFilter}
                        onPaymentStatusFilterChange={setPaymentStatusFilter}
                    />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã đơn hàng</TableHead>
                                <TableHead>Khách hàng</TableHead>
                                <TableHead>Sản phẩm</TableHead>
                                <TableHead>Tổng tiền</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Thanh toán</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-sm">
                                        #{order.id.slice(-8)}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {order.user?.fullName || 'Khách hàng'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.user?.phone || 'N/A'}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[200px]">
                                            <div className="text-sm font-medium">
                                                {order.total_items} sản phẩm
                                            </div>
                                            <div className="text-xs text-gray-500 truncate">
                                                {order.items.length} items
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {order.commissionAmount ? order.commissionAmount.toLocaleString('vi-VN') : 'N/A'} VND
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <OrderStatusBadge status={order.status} size="sm" />
                                            <Select
                                                value={order.status}
                                                onValueChange={(value) => handleStatusUpdate(order.id, value)}
                                            >
                                                <SelectTrigger className="w-[120px] h-6 text-xs">
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
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {order.payment_status && (
                                            <PaymentStatusBadge status={order.payment_status} size="sm" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/dashboard/orders/${order.id}`}>
                                            <Button variant="secondary" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                Xem
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Không tìm thấy đơn hàng nào
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
