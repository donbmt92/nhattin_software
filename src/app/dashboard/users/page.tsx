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
    phone: z.string().min(3, "Phone must be at least 3 characters"),
    fullName: z.string().min(2, "Full name is required"),
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
                setError('Please login to view users');
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
                setError('Invalid data format received from server');
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Failed to fetch users');
            } else {
                setError('Failed to fetch users');
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
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = localStorage.getItem('nhattin_token');
                if (!token) {
                    alert('Please login to delete a user');
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
                alert("User deleted successfully");
            } catch (error) {
                console.error('Error deleting user:', error);
                if (axios.isAxiosError(error)) {
                    alert(error.response?.data?.message || 'Failed to delete user. Please try again.');
                } else {
                    alert('Failed to delete user. Please try again.');
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
                alert('Please login to update user');
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
            alert(selectedUser ? "User updated successfully" : "User created successfully");
        } catch (error) {
            console.error('Error saving user:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Failed to save user. Please try again.');
            } else {
                alert('Failed to save user. Please try again.');
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
                    <CardTitle>Users Management</CardTitle>
                    <div className="flex space-x-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search users..."
                                className="pl-8 w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleAddUser}>Add New User</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Phone</TableHead>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
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
                                            {user.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button 
                                            variant="secondary" 
                                            size="sm"
                                            onClick={() => handleEditUser(user)}
                                        >
                                            Edit
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="secondary" size="sm" className="bg-red-100 text-red-800 hover:bg-red-200">
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete this user? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteUser(user._id)}
                                                    >
                                                        Delete
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
                        <DialogTitle>{selectedUser ? "Edit User" : "Add New User"}</DialogTitle>
                        <DialogDescription>
                            {selectedUser ? "Make changes to the user here." : "Add a new user to the system."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Phone number" {...field} />
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
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Full name" {...field} />
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
                                        <FormLabel>Role</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                <SelectItem value="STAFF">Staff</SelectItem>
                                                <SelectItem value="USER">User</SelectItem>
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
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Password" {...field} />
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
                                            <FormLabel>Password (leave blank to keep current)</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="New password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <DialogFooter className="mt-6">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {selectedUser ? 'Update User' : 'Create User'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
} 