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
    name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must not exceed 100 characters"),
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
    id_inventory: z.string().optional(),
    original_price: z.number().optional(),
    current_price: z.number().optional(),
    base_price: z.number().optional(),
    min_price: z.number().optional(),
    max_price: z.number().optional(),
    rating: z.number().min(0).max(5).optional(),
    total_reviews: z.number().min(0).optional(),
    sold: z.number().min(0).optional(),
    warranty_policy: z.boolean().optional(),
    status: z.string().optional(),
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
        id_inventory?: string;
        original_price?: number;
        current_price?: number;
        base_price?: number;
        min_price?: number;
        max_price?: number;
        rating?: number;
        total_reviews?: number;
        sold?: number;
        warranty_policy?: boolean;
        status?: string;
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
                
                console.log('Categories:', categoriesData);
                console.log('Active discounts:', activeDiscounts);
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
            id_inventory: initialData?.id_inventory || undefined,
            original_price: initialData?.original_price || undefined,
            current_price: initialData?.current_price || undefined,
            base_price: initialData?.base_price || undefined,
            min_price: initialData?.min_price || undefined,
            max_price: initialData?.max_price || undefined,
            rating: initialData?.rating || undefined,
            total_reviews: initialData?.total_reviews || undefined,
            sold: initialData?.sold || undefined,
            warranty_policy: initialData?.warranty_policy || undefined,
            status: initialData?.status || undefined,
        },
    });

    // Update form values when initialData changes
    useEffect(() => {
        if (initialData) {
            console.log('Setting form values from initialData:', initialData);
            form.reset({
                name: initialData.name,
                price: initialData.price,
                desc: initialData.desc,
                id_category: initialData.id_category,
                id_discount: initialData.id_discount || "none",
                id_inventory: initialData.id_inventory || undefined,
                original_price: initialData.original_price || undefined,
                current_price: initialData.current_price || undefined,
                base_price: initialData.base_price || undefined,
                min_price: initialData.min_price || undefined,
                max_price: initialData.max_price || undefined,
                rating: initialData.rating || undefined,
                total_reviews: initialData.total_reviews || undefined,
                sold: initialData.sold || undefined,
                warranty_policy: initialData.warranty_policy || undefined,
                status: initialData.status || undefined,
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
        
        // Đảm bảo price là số dương
        const price = Math.max(0, Math.abs(values.price));
        // formData.append('price', price.toString());
        
        // Thêm description (backend expects 'description', not 'desc')
        formData.append('description', values.desc);
        
        formData.append('id_category', values.id_category);

        // Chỉ thêm id_discount nếu có giá trị và khác "none"
        if (values.id_discount && values.id_discount !== "none") {
            formData.append('id_discount', values.id_discount);
        }
        
        // Add id_inventory if provided
        if (values.id_inventory) {
            formData.append('id_inventory', values.id_inventory);
        }
        
        // Add original_price if provided
        if (values.original_price !== undefined) {
            // formData.append('original_price', values.original_price.toString());
        }
        
        // Add current_price if provided
        if (values.current_price !== undefined) {
            // formData.append('current_price', values.current_price.toString());
        }
        
        // Add base_price if provided (required by backend)
        if (values.base_price !== undefined) {
            formData.append('base_price', values.base_price.toString());
        } else {
            // If base_price is not provided, use price as base_price
            formData.append('base_price', price.toString());
        }
        
        // Add min_price if provided (required by backend)
        if (values.min_price !== undefined) {
            formData.append('min_price', values.min_price.toString());
        } else {
            // If min_price is not provided, use price as min_price
            formData.append('min_price', price.toString());
        }
        
        // Add max_price if provided (required by backend)
        if (values.max_price !== undefined) {
            formData.append('max_price', values.max_price.toString());
        } else {
            // If max_price is not provided, use price as max_price
            formData.append('max_price', price.toString());
        }
        
        // Add rating if provided
        if (values.rating !== undefined) {
            formData.append('rating', values.rating.toString());
        }
        
        // Add total_reviews if provided
        if (values.total_reviews !== undefined) {
            formData.append('total_reviews', values.total_reviews.toString());
        }
        
        // Add sold if provided
        if (values.sold !== undefined) {
            formData.append('sold', values.sold.toString());
        }
        
        // Add warranty_policy if provided
        if (values.warranty_policy !== undefined) {
            formData.append('warranty_policy', values.warranty_policy.toString());
        }
        
        // Add status if provided
        if (values.status !== undefined) {
            formData.append('status', values.status);
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
                                            placeholder="Enter product price"
                                            {...field}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Ensure integer and non-negative
                                                const numValue = value === '' ? 0 : Math.max(0, Math.floor(Number(value)));
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
                            name="base_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base Price (VND, required by backend)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter base price (defaults to price if empty)"
                                            value={field.value || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const numValue = value === '' ? undefined : Math.max(0, Math.floor(Number(value)));
                                                field.onChange(numValue);
                                            }}
                                            onBlur={(e) => {
                                                const value = e.target.value;
                                                if (value === '') {
                                                    field.onChange(undefined);
                                                } else {
                                                    const numValue = Math.max(0, Math.floor(Number(value)));
                                                    e.target.value = numValue.toString();
                                                    field.onChange(numValue);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="min_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min Price (VND, required by backend)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter minimum price (defaults to price if empty)"
                                            value={field.value || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const numValue = value === '' ? undefined : Math.max(0, Math.floor(Number(value)));
                                                field.onChange(numValue);
                                            }}
                                            onBlur={(e) => {
                                                const value = e.target.value;
                                                if (value === '') {
                                                    field.onChange(undefined);
                                                } else {
                                                    const numValue = Math.max(0, Math.floor(Number(value)));
                                                    e.target.value = numValue.toString();
                                                    field.onChange(numValue);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="max_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Price (VND, required by backend)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter maximum price (defaults to price if empty)"
                                            value={field.value || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const numValue = value === '' ? undefined : Math.max(0, Math.floor(Number(value)));
                                                field.onChange(numValue);
                                            }}
                                            onBlur={(e) => {
                                                const value = e.target.value;
                                                if (value === '') {
                                                    field.onChange(undefined);
                                                } else {
                                                    const numValue = Math.max(0, Math.floor(Number(value)));
                                                    e.target.value = numValue.toString();
                                                    field.onChange(numValue);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="original_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Original Price (VND, optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter original price if different"
                                            value={field.value || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const numValue = value === '' ? undefined : Math.max(0, Math.floor(Number(value)));
                                                field.onChange(numValue);
                                            }}
                                            onBlur={(e) => {
                                                const value = e.target.value;
                                                if (value === '') {
                                                    field.onChange(undefined);
                                                } else {
                                                    const numValue = Math.max(0, Math.floor(Number(value)));
                                                    e.target.value = numValue.toString();
                                                    field.onChange(numValue);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="current_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Price (VND, optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter current price if different"
                                            value={field.value || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const numValue = value === '' ? undefined : Math.max(0, Math.floor(Number(value)));
                                                field.onChange(numValue);
                                            }}
                                            onBlur={(e) => {
                                                const value = e.target.value;
                                                if (value === '') {
                                                    field.onChange(undefined);
                                                } else {
                                                    const numValue = Math.max(0, Math.floor(Number(value)));
                                                    e.target.value = numValue.toString();
                                                    field.onChange(numValue);
                                                }
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
                                        defaultValue={field.value}
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
                                        defaultValue={field.value}
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

                        <FormField
                            control={form.control}
                            name="id_inventory"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Inventory ID (Optional)</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Enter inventory ID if available" 
                                            {...field} 
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating (0-5, Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter product rating"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                            {...field}
                                            value={field.value || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const numValue = value === '' ? undefined : Math.min(5, Math.max(0, Number(value)));
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
                            name="total_reviews"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Reviews (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter total number of reviews"
                                            min="0"
                                            {...field}
                                            value={field.value || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const numValue = value === '' ? undefined : Math.max(0, Math.floor(Number(value)));
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
                            name="sold"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Units Sold (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter number of units sold"
                                            min="0"
                                            {...field}
                                            value={field.value || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const numValue = value === '' ? undefined : Math.max(0, Math.floor(Number(value)));
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
                            name="warranty_policy"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            checked={field.value || false}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Warranty Policy</FormLabel>
                                        <p className="text-sm text-muted-foreground">
                                            Check if this product has a warranty policy
                                        </p>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Status</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        value={field.value || 'IN_STOCK'}
                                        defaultValue={field.value || 'IN_STOCK'}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select product status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="IN_STOCK">In Stock</SelectItem>
                                            <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                                            <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
                                            <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
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