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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from 'axios';

interface User {
    _id: string;
    phone: string;
    fullName: string;
    role: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

const userFormSchema = z.object({
    phone: z.string().min(3, "Số điện thoại phải có ít nhất 3 ký tự"),
    fullName: z.string().min(2, "Họ tên không được để trống"),
    role: z.enum(["ADMIN", "USER", "STAFF"]),
    password: z.string().optional(),
});

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const form = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            phone: "",
            fullName: "",
            role: "USER",
            password: "",
        },
    });

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('nhattin_token');
            if (!token) {
                setError('Vui lòng đăng nhập để xem danh sách người dùng');
                setIsLoading(false);
                return;
            }

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                setError('Định dạng dữ liệu không hợp lệ từ máy chủ');
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Không thể tải danh sách người dùng');
            } else {
                setError('Không thể tải danh sách người dùng');
            }
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        form.reset({
            phone: user.phone,
            fullName: user.fullName,
            role: user.role as "ADMIN" | "USER" | "STAFF",
            password: '',
        });
        setIsDialogOpen(true);
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
            try {
                const token = localStorage.getItem('nhattin_token');
                if (!token) {
                    alert('Vui lòng đăng nhập để xóa người dùng');
                    return;
                }

                setIsLoading(true);
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/deleteUser/${userId}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                // Refresh users list
                await fetchUsers();
                alert("Đã xóa người dùng thành công");
            } catch (error) {
                console.error('Error deleting user:', error);
                if (axios.isAxiosError(error)) {
                    alert(error.response?.data?.message || 'Không thể xóa người dùng. Vui lòng thử lại.');
                } else {
                    alert('Không thể xóa người dùng. Vui lòng thử lại.');
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const onSubmit = async (data: z.infer<typeof userFormSchema>) => {
        try {
            const token = localStorage.getItem('nhattin_token');
            if (!token) {
                alert('Vui lòng đăng nhập để cập nhật người dùng');
                return;
            }

            setIsLoading(true);
            
            // Create payload, only include password if it's provided
            const payload = { ...data };
            if (!payload.password) {
                delete payload.password;
            }

            if (selectedUser) {
                // Update existing user
                await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/updateUser/${selectedUser._id}`,
                    payload,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            } else {
                // Create new user
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/users`,
                    payload,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }
            
            // Refresh user list
            await fetchUsers();
            setIsDialogOpen(false);
            setSelectedUser(null);
            form.reset();
            alert(selectedUser ? "Cập nhật người dùng thành công" : "Tạo người dùng mới thành công");
        } catch (error) {
            console.error('Error saving user:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Không thể lưu thông tin người dùng. Vui lòng thử lại.');
            } else {
                alert('Không thể lưu thông tin người dùng. Vui lòng thử lại.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddUser = () => {
        form.reset({
            phone: "",
            fullName: "",
            role: "USER" as "ADMIN" | "USER" | "STAFF",
            password: "",
        });
        setSelectedUser(null);
        setIsDialogOpen(true);
    };

    const filteredUsers = users.filter(user => 
        (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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

    if (isLoading && users.length === 0) {
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
                    <CardTitle>Quản lý Người dùng</CardTitle>
                    <div className="flex space-x-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm người dùng..."
                                className="pl-8 w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleAddUser}>Thêm Người dùng mới</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Số điện thoại</TableHead>
                                <TableHead>Họ và tên</TableHead>
                                <TableHead>Vai trò</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell className="font-medium">{user.phone}</TableCell>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            user.role === 'ADMIN' 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : user.role === 'STAFF'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.role === 'ADMIN' ? 'Quản trị viên' : 
                                             user.role === 'STAFF' ? 'Nhân viên' : 'Người dùng'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                            Hoạt động
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button 
                                            variant="secondary" 
                                            size="sm"
                                            onClick={() => handleEditUser(user)}
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
                                                    <AlertDialogTitle>Xóa Người dùng</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteUser(user._id)}
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

            {/* Edit/Create User Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{selectedUser ? "Chỉnh sửa Người dùng" : "Thêm Người dùng mới"}</DialogTitle>
                        <DialogDescription>
                            {selectedUser ? "Thay đổi thông tin người dùng tại đây." : "Thêm một người dùng mới vào hệ thống."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập số điện thoại" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ và tên</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập họ và tên" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vai trò</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn vai trò" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                                                <SelectItem value="STAFF">Nhân viên</SelectItem>
                                                <SelectItem value="USER">Người dùng</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {!selectedUser && (
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mật khẩu</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Nhập mật khẩu" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            {selectedUser && (
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mật khẩu (để trống nếu giữ nguyên)</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Nhập mật khẩu mới" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <DialogFooter className="mt-6">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Hủy</Button>
                                </DialogClose>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {selectedUser ? 'Cập nhật' : 'Tạo mới'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
} 