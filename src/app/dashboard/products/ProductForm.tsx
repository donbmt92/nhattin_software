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
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toggle } from "@/components/ui/toggle";
import { 
    Bold, 
    Italic, 
    Strikethrough, 
    List, 
    ListOrdered,
    Heading2
} from "lucide-react";

// MongoDB ObjectId regex pattern
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must not exceed 100 characters"),
    desc: z.string().min(10, "Description must be at least 10 characters"),
    id_category: z.string().regex(objectIdRegex, "Must be a valid MongoDB ID"),
    id_discount: z.string().optional(),
    id_inventory: z.string().optional(),
    base_price: z.number({
        required_error: "Base price is required",
        invalid_type_error: "Base price must be a number",
    })
    .int("Base price must be an integer")
    .nonnegative("Base price must not be less than 0")
    .min(0, "Base price must not be less than 0"),
    min_price: z.number({
        invalid_type_error: "Min price must be a number",
    })
    .int("Min price must be an integer")
    .nonnegative("Min price must not be less than 0")
    .min(0, "Min price must not be less than 0")
    .optional(),
    max_price: z.number({
        invalid_type_error: "Max price must be a number",
    })
    .int("Max price must be an integer")
    .nonnegative("Max price must not be less than 0")
    .min(0, "Max price must not be less than 0")
    .optional(),
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
        desc: string;
        image: string;
        id_category: string;
        id_discount?: string;
        id_inventory?: string;
        base_price: number;
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

const Tiptap = ({ 
    value, 
    onChange 
}: { 
    value: string;
    onChange: (value: string) => void;
}) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="border rounded-lg border-input bg-background">
            <div className="flex flex-wrap gap-1 p-1 border-b border-input bg-muted/50">
                <Toggle
                    size="sm"
                    pressed={editor?.isActive('bold')}
                    onPressedChange={() => editor?.chain().focus().toggleBold().run()}
                    variant="outline"
                    className="h-8 w-8 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                    aria-label="Toggle bold"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor?.isActive('italic')}
                    onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
                    variant="outline"
                    className="h-8 w-8 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                    aria-label="Toggle italic"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor?.isActive('strike')}
                    onPressedChange={() => editor?.chain().focus().toggleStrike().run()}
                    variant="outline"
                    className="h-8 w-8 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                    aria-label="Toggle strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor?.isActive('heading', { level: 2 })}
                    onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    variant="outline"
                    className="h-8 w-8 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                    aria-label="Toggle heading"
                >
                    <Heading2 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor?.isActive('bulletList')}
                    onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}
                    variant="outline"
                    className="h-8 w-8 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                    aria-label="Toggle bullet list"
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor?.isActive('orderedList')}
                    onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}
                    variant="outline"
                    className="h-8 w-8 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                    aria-label="Toggle ordered list"
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>
            </div>
            <div className="p-3">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

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
                const token = localStorage.getItem('nhattin_token');
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
            desc: initialData?.desc || "",
            id_category: initialData?.id_category || "",
            id_discount: initialData?.id_discount || "none",
            id_inventory: initialData?.id_inventory || undefined,
            base_price: initialData?.base_price || 0,
            min_price: initialData?.min_price || initialData?.base_price || undefined,
            max_price: initialData?.max_price || initialData?.base_price || undefined,
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
                desc: initialData.desc,
                id_category: initialData.id_category,
                id_discount: initialData.id_discount || "none",
                id_inventory: initialData.id_inventory || undefined,
                base_price: initialData.base_price,
                min_price: initialData.min_price || initialData.base_price,
                max_price: initialData.max_price || initialData.base_price,
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
        
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        formData.append('name', values.name);
        formData.append('description', values.desc);
        formData.append('id_category', values.id_category);
        formData.append('base_price', values.base_price.toString());

        if (values.id_discount && values.id_discount !== "none") {
            formData.append('id_discount', values.id_discount);
        }
        
        if (values.id_inventory) {
            formData.append('id_inventory', values.id_inventory);
        }
        
        // Add min_price if provided, otherwise use base_price
        if (values.min_price !== undefined) {
            formData.append('min_price', values.min_price.toString());
        } else {
            formData.append('min_price', values.base_price.toString());
        }
        
        // Add max_price if provided, otherwise use base_price
        if (values.max_price !== undefined) {
            formData.append('max_price', values.max_price.toString());
        } else {
            formData.append('max_price', values.base_price.toString());
        }
        
        if (values.rating !== undefined) {
            formData.append('rating', values.rating.toString());
        }
        
        if (values.total_reviews !== undefined) {
            formData.append('total_reviews', values.total_reviews.toString());
        }
        
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
                            name="desc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Tiptap
                                            value={field.value}
                                            onChange={field.onChange}
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
                            name="min_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min Price (VND, optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter minimum price (defaults to base price if empty)"
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
                                    <FormLabel>Max Price (VND, optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter maximum price (defaults to base price if empty)"
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