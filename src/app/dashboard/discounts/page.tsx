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
import { Loader2 } from "lucide-react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import axios from 'axios';
import DiscountForm from "@/app/dashboard/discounts/DiscountForm";

interface Discount {
    _id: string;
    name: string;
    desc: string;
    discount_percent: number;
    time_start: string;
    time_end: string;
    status: string;
}

interface DiscountFormData {
    name: string;
    desc: string;
    discount_percent: number;
    time_start: Date;
    time_end: Date;
    status: string;
}

export default function DiscountsPage() {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);

    const fetchDiscounts = async () => {
        try {
            const token = localStorage.getItem('nhattin_token');
            if (!token) {
                setError('Vui lòng đăng nhập để xem danh sách khuyến mãi');
                return;
            }

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/discounts`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (Array.isArray(response.data)) {
                setDiscounts(response.data);
            } else {
                setError('Định dạng dữ liệu không hợp lệ từ máy chủ');
            }
        } catch (error) {
            console.error('Error fetching discounts:', error);
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Không thể tải danh sách khuyến mãi');
            } else {
                setError('Không thể tải danh sách khuyến mãi');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('nhattin_token');
        if (!token) {
            alert('Vui lòng đăng nhập để xóa khuyến mãi');
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/discounts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            await fetchDiscounts();
        } catch (error) {
            console.error('Error deleting discount:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể xóa khuyến mãi');
            } else {
                alert('Không thể xóa khuyến mãi');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (discount: Discount) => {
        setSelectedDiscount(discount);
        setIsDialogOpen(true);
    };

    const handleFormSubmit = async (data: DiscountFormData) => {
        const token = localStorage.getItem('nhattin_token');
        if (!token) {
            alert('Vui lòng đăng nhập để tiếp tục');
            return;
        }

        try {
            setLoading(true);
            if (selectedDiscount) {
                // Update existing discount
                await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/discounts/${selectedDiscount._id}`,
                    data,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            } else {
                // Create new discount
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/discounts`,
                    data,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            setIsDialogOpen(false);
            setSelectedDiscount(null);
            await fetchDiscounts();
        } catch (error) {
            throw error; // Re-throw error to be handled by the form
        } finally {
            setLoading(false);
        }
    };

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

    if (loading && !discounts.length) {
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
                    <CardTitle>Quản lý Khuyến mãi</CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setSelectedDiscount(null)}>
                                Thêm Khuyến mãi mới
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {selectedDiscount ? 'Chỉnh sửa Khuyến mãi' : 'Tạo Khuyến mãi mới'}
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedDiscount 
                                        ? 'Chỉnh sửa thông tin khuyến mãi bên dưới.' 
                                        : 'Điền thông tin để tạo khuyến mãi mới.'}
                                </DialogDescription>
                            </DialogHeader>
                            <DiscountForm
                                initialData={selectedDiscount ? {
                                    _id: selectedDiscount._id,
                                    name: selectedDiscount.name,
                                    desc: selectedDiscount.desc,
                                    discount_percent: selectedDiscount.discount_percent,
                                    time_start: new Date(selectedDiscount.time_start),
                                    time_end: new Date(selectedDiscount.time_end),
                                    status: selectedDiscount.status
                                } : undefined}
                                onSubmit={handleFormSubmit}
                                isLoading={loading}
                                setIsDialogOpen={setIsDialogOpen}
                            />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên</TableHead>
                                <TableHead>Mô tả</TableHead>
                                <TableHead>Chiết khấu %</TableHead>
                                <TableHead>Thời gian bắt đầu</TableHead>
                                <TableHead>Thời gian kết thúc</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {discounts.map((discount) => (
                                <TableRow key={discount._id}>
                                    <TableCell className="font-medium">{discount.name}</TableCell>
                                    <TableCell>{discount.desc}</TableCell>
                                    <TableCell>{discount.discount_percent}%</TableCell>
                                    <TableCell>{new Date(discount.time_start).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(discount.time_end).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            discount.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {discount.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleEdit(discount)}
                                        >
                                            Sửa
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="secondary" size="sm" className="bg-red-100 text-red-800 hover:bg-red-200">
                                                    Xóa
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Xóa Khuyến mãi</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Bạn có chắc chắn muốn xóa khuyến mãi này? Hành động này không thể hoàn tác.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(discount._id)}
                                                    >
                                                        Xóa
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
} 
