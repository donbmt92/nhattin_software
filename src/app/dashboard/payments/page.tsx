"use client";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
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
import { Loader2, CreditCard, Calendar, DollarSign, RefreshCw, AlertCircle } from "lucide-react";
import axios from 'axios';
import { Payment, PaymentStatus as PaymentStatusEnum } from '@/types/payment';
import { TransferNoteParser, OrderInfo, ProductInfo, PaymentStatus } from '@/components/payment';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAllPayments, setShowAllPayments] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Kiểm tra quyền admin
    useEffect(() => {
        const userRole = localStorage.getItem('nhattin_user_role');
        setIsAdmin(userRole === 'admin');
    }, []);

    const fetchPayments = async (showAll = false, isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);

            const token = localStorage.getItem('nhattin_token');
            if (!token) {
                setError('Vui lòng đăng nhập để xem danh sách thanh toán');
                return;
            }

            // Sử dụng endpoint admin nếu là admin và muốn xem tất cả
            const endpoint = isAdmin && showAll ? '/payments/admin/all' : '/payments';
            
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                timeout: 10000 // 10 seconds timeout
            });
            
            if (Array.isArray(response.data)) {
                console.log("response.data", response.data);
                setPayments(response.data);
            } else {
                setError('Định dạng dữ liệu không hợp lệ từ máy chủ');
                setPayments([]);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    setError('Kết nối timeout. Vui lòng thử lại.');
                } else if (error.response?.status === 401) {
                    setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                } else if (error.response?.status === 403) {
                    setError('Bạn không có quyền truy cập tính năng này.');
                } else {
                    setError(error.response?.data?.message || 'Không thể tải danh sách thanh toán');
                }
            } else {
                setError('Không thể tải danh sách thanh toán');
            }
            setPayments([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        fetchPayments(showAllPayments, true);
    };

    useEffect(() => {
        fetchPayments(showAllPayments);
    }, [showAllPayments, isAdmin]);


    if (error) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="text-center py-6">
                        <div className="flex flex-col items-center gap-4">
                            <AlertCircle className="h-12 w-12 text-red-500" />
                            <div className="text-red-500 font-medium">{error}</div>
                            <Button 
                                onClick={handleRefresh} 
                                variant="secondary" 
                                className="flex items-center gap-2"
                                disabled={refreshing}
                            >
                                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                Thử lại
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading && payments.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // Tính toán thống kê
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const momoPayments = payments.filter(p => p.provider === 'momo').length;
    const bankPayments = payments.filter(p => p.provider !== 'momo').length;

    return (
        <div className="p-6 space-y-6">
            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng giao dịch</p>
                                <p className="text-2xl font-bold">{payments.length}</p>
                            </div>
                            <CreditCard className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng tiền</p>
                                <p className="text-2xl font-bold">{totalAmount.toLocaleString('vi-VN')} VND</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">MoMo</p>
                                <p className="text-2xl font-bold">{momoPayments}</p>
                            </div>
                            <div className="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center">
                                <span className="text-pink-600 font-bold text-sm">M</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Ngân hàng</p>
                                <p className="text-2xl font-bold">{bankPayments}</p>
                            </div>
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-sm">B</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Danh sách Thanh toán
                    </CardTitle>
                    <div className="flex items-center gap-4">
                        <Button 
                            onClick={handleRefresh} 
                            variant="secondary" 
                            size="sm"
                            className="flex items-center gap-2"
                            disabled={refreshing}
                        >
                            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Làm mới
                        </Button>
                        {isAdmin && (
                            <div className="flex items-center gap-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={showAllPayments}
                                        onChange={(e) => setShowAllPayments(e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                    Hiển thị tất cả (bao gồm chưa thanh toán)
                                </label>
                            </div>
                        )}
                        <span className="text-sm text-gray-500">
                            {showAllPayments ? 'Hiển thị tất cả giao dịch' : 'Chỉ hiển thị giao dịch đã thanh toán thành công'}
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã thanh toán</TableHead>
                                <TableHead>Đơn hàng</TableHead>
                                <TableHead>Sản phẩm</TableHead>
                                <TableHead>Khách hàng</TableHead>
                                <TableHead>Phương thức</TableHead>
                                <TableHead>Số tiền</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngân hàng</TableHead>
                                <TableHead>Mã giao dịch</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-mono text-sm">
                                        #{payment.id.slice(-8)}
                                    </TableCell>
                                    <TableCell>
                                        <OrderInfo payment={payment} />
                                    </TableCell>
                                    <TableCell>
                                        <ProductInfo payment={payment} />
                                    </TableCell>
                                    <TableCell>
                                        <TransferNoteParser transferNote={payment.transfer_note} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-medium">
                                            {payment.provider}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            {payment.amount.toLocaleString('vi-VN')} VND
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <PaymentStatus status={payment.status} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {payment.bank_name || 'N/A'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-mono text-xs text-gray-600 max-w-[120px] truncate">
                                            {payment.transaction_reference || 'N/A'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(payment.createdAt).toLocaleDateString('vi-VN')}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {payments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Không có giao dịch thanh toán nào
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
