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
import { 
    Loader2, 
    CreditCard, 
    Calendar, 
    DollarSign, 
    RefreshCw, 
    AlertCircle,
    TrendingUp,
    Users,
    Filter,
    Download,
    Eye,
    Search
} from "lucide-react";
import axios from 'axios';
import { Payment, PaymentStatus as PaymentStatusEnum } from '@/types/payment';
import { TransferNoteParser, OrderInfo, ProductInfoWithPopup, PaymentStatus } from '@/components/payment';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAllPayments, setShowAllPayments] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [providerFilter, setProviderFilter] = useState<string>('all');

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
            
            console.log("Fetching payments from:", `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
            console.log("Token exists:", !!token);
            
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                timeout: 10000 // 10 seconds timeout
            });
            
            console.log("Full response:", response);
            console.log("Response data:", response.data);
            console.log("Response data type:", typeof response.data);
            console.log("Is array:", Array.isArray(response.data));
            
            if (Array.isArray(response.data)) {
                console.log("Setting payments:", response.data);
                setPayments(response.data);
            } else {
                console.error("Invalid data format:", response.data);
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

    // Lọc và tìm kiếm payments
    useEffect(() => {
        let filtered = payments;

        // Tìm kiếm theo từ khóa
        if (searchTerm) {
            filtered = filtered.filter(payment => {
                const paymentId = payment.id || payment._id || '';
                return paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    payment.transfer_note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    payment.transaction_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    payment.bank_name?.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        // Lọc theo trạng thái
        if (statusFilter !== 'all') {
            filtered = filtered.filter(payment => payment.status === statusFilter as PaymentStatusEnum);
        }

        // Lọc theo provider
        if (providerFilter !== 'all') {
            filtered = filtered.filter(payment => payment.provider === providerFilter);
        }

        setFilteredPayments(filtered);
    }, [payments, searchTerm, statusFilter, providerFilter]);

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
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const momoPayments = filteredPayments.filter(p => p.provider === 'momo').length;
    const bankPayments = filteredPayments.filter(p => p.provider !== 'momo').length;
    const successfulPayments = filteredPayments.filter(p => p.status === PaymentStatusEnum.COMPLETED).length;
    const pendingPayments = filteredPayments.filter(p => p.status === PaymentStatusEnum.PENDING).length;

    return (
        <div className="p-6 space-y-6">
            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">Tổng giao dịch</p>
                                <p className="text-2xl font-bold text-blue-900">{filteredPayments.length}</p>
                                <p className="text-xs text-blue-600">({payments.length} tổng cộng)</p>
                            </div>
                            <CreditCard className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700">Tổng tiền</p>
                                <p className="text-2xl font-bold text-green-900">{totalAmount.toLocaleString('vi-VN')} VND</p>
                                <p className="text-xs text-green-600">{successfulPayments} thành công</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-pink-700">MoMo</p>
                                <p className="text-2xl font-bold text-pink-900">{momoPayments}</p>
                                <p className="text-xs text-pink-600">Giao dịch</p>
                            </div>
                            <div className="h-8 w-8 bg-pink-200 rounded-full flex items-center justify-center">
                                <span className="text-pink-700 font-bold text-sm">M</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700">Ngân hàng</p>
                                <p className="text-2xl font-bold text-purple-900">{bankPayments}</p>
                                <p className="text-xs text-purple-600">Giao dịch</p>
                            </div>
                            <div className="h-8 w-8 bg-purple-200 rounded-full flex items-center justify-center">
                                <span className="text-purple-700 font-bold text-sm">B</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Thanh tìm kiếm và lọc */}
            <Card className="mb-4">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Tìm kiếm */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo mã giao dịch, ghi chú, ngân hàng..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        {/* Lọc theo trạng thái */}
                        <div className="flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="pending">Chờ xử lý</option>
                                <option value="processing">Đang xử lý</option>
                                <option value="failed">Thất bại</option>
                                <option value="refunded">Hoàn tiền</option>
                            </select>
                            
                            {/* Lọc theo provider */}
                            <select
                                value={providerFilter}
                                onChange={(e) => setProviderFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">Tất cả phương thức</option>
                                <option value="momo">MoMo</option>
                                <option value="bank">Ngân hàng</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Danh sách Thanh toán
                        <span className="text-sm font-normal text-gray-500">
                            ({filteredPayments.length} / {payments.length})
                        </span>
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
                            {filteredPayments.map((payment) => (
                                <TableRow key={payment.id || payment._id}>
                                    <TableCell className="font-mono text-sm">
                                        #{(payment.id || payment._id || '').slice(-8)}
                                    </TableCell>
                                    <TableCell>
                                        <OrderInfo payment={payment} />
                                    </TableCell>
                                    <TableCell>
                                        <ProductInfoWithPopup payment={payment} />
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

                    {filteredPayments.length === 0 && payments.length > 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Filter className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium">Không tìm thấy giao dịch nào</p>
                            <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                        </div>
                    )}
                    
                    {payments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium">Chưa có giao dịch thanh toán nào</p>
                            <p className="text-sm">Các giao dịch sẽ hiển thị ở đây sau khi được tạo</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
