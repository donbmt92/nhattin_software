"use client";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import axios from "axios";

// MongoDB ObjectId regex pattern
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    price: z.number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
    })
    .int("Price must be an integer")
    .nonnegative("Price must not be less than 0")
    .min(0, "Price must not be less than 0"),
    desc: z.string().min(10, "Description must be at least 10 characters"),
    id_category: z.string().regex(objectIdRegex, "Must be a valid MongoDB ID"),
    id_discount: z.string().optional(),
});

interface ProductFormProps {
    initialData?: {
        id?: string;
        name: string;
        price: number;
        desc: string;
        image: string;
        id_category: string;
        id_discount?: string;
    };
    onSubmit: (data: FormData) => void;
    isLoading?: boolean;
}

interface Discount {
    _id: string;
    name: string;
    discount_percent: number;
    status: string;
    time_end: string;
}

export default function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(
        initialData?.image 
            ? `${process.env.NEXT_PUBLIC_API_URL}/${initialData.image}`
            : null
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
    const [discounts, setDiscounts] = useState<Array<{ _id: string; name: string; discount_percent: number }>>([]);

    // Fetch categories and discounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                // Fetch categories
                const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
                if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);

                // Fetch active discounts
                const discountsResponse = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/discounts`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                // Filter only active discounts
                const activeDiscounts = discountsResponse.data.filter(
                    (discount: Discount) => 
                        discount.status === 'active' && 
                        new Date(discount.time_end) > new Date()
                );
                setDiscounts(activeDiscounts);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            price: initialData?.price || 0,
            desc: initialData?.desc || "",
            id_category: initialData?.id_category || "",
            id_discount: initialData?.id_discount || "none",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                price: initialData.price,
                desc: initialData.desc,
                id_category: initialData.id_category,
                id_discount: initialData.id_discount || "none",
            });
        }
    }, [initialData, form]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        console.log('Form values before FormData:', values);
        
        const formData = new FormData();
        
        // Chỉ thêm image vào FormData nếu có
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        // Thêm các trường dữ liệu khác
        formData.append('name', values.name);
        // Đảm bảo price là số dương và được chuyển thành string
        const price = Math.max(0, Math.abs(values.price));
        formData.append('price', price.toString());
        formData.append('desc', values.desc);
        formData.append('id_category', values.id_category);
        // Chỉ thêm id_discount nếu có giá trị và khác "none"
        if (values.id_discount && values.id_discount !== "none") {
            formData.append('id_discount', values.id_discount);
        }
        
        // Log để kiểm tra
        console.log('FormData entries:');
        const entries = Array.from(formData.entries());
        entries.forEach(entry => {
            console.log('Entry:', entry[0], entry[1], typeof entry[1]);
        });
        
        onSubmit(formData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{initialData ? 'Edit Product' : 'Create New Product'}</CardTitle>
                <CardDescription>
                    {initialData ? 'Update the product details below.' : 'Fill in the details to create a new product.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter product name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price (VND)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="1000"
                                            placeholder="Enter price in VND (e.g. 199000)"
                                            {...field}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Ensure integer and non-negative
                                                const numValue = value === '' ? 0 : Math.max(0, Math.floor(Number(value)));
                                                console.log('Input value:', value);
                                                console.log('Converted price:', numValue);
                                                field.onChange(numValue);
                                            }}
                                            onBlur={(e) => {
                                                // Format on blur to ensure valid value
                                                const value = e.target.value;
                                                const numValue = value === '' ? 0 : Math.max(0, Math.floor(Number(value)));
                                                e.target.value = numValue.toString();
                                                field.onChange(numValue);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="desc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter product description"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                                <div className="space-y-4">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="cursor-pointer"
                                    />
                                    {imagePreview && (
                                        <div className="relative w-40 h-40">
                                            <Image
                                                src={imagePreview}
                                                alt="Product preview"
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="id_category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category._id} value={category._id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="id_discount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a discount (optional)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">No discount</SelectItem>
                                            {discounts.map((discount) => (
                                                <SelectItem key={discount._id} value={discount._id}>
                                                    {discount.name} ({discount.discount_percent}% off)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
} 