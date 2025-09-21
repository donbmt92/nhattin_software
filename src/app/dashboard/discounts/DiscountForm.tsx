"use client";
import { Button } from "@/app/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";

interface DiscountFormData {
    name: string;
    desc: string;
    discount_percent: number;
    time_start: Date;
    time_end: Date;
    status: string;
}

interface DiscountFormProps {
    initialData?: {
        _id?: string;
        name: string;
        desc: string;
        discount_percent: number;
        time_start: Date;
        time_end: Date;
        status: string;
    };
    onSubmit: (data: DiscountFormData) => Promise<void>;
    isLoading?: boolean;
    setIsDialogOpen?: (open: boolean) => void;
}

export default function DiscountForm({ 
    initialData, 
    onSubmit, 
    isLoading,
}: DiscountFormProps) {
    const form = useForm<DiscountFormData>({
        defaultValues: {
            name: initialData?.name || "",
            desc: initialData?.desc || "",
            discount_percent: initialData?.discount_percent || 0,
            time_start: initialData?.time_start 
                ? new Date(initialData.time_start)
                : new Date(Date.now() + 24 * 60 * 60 * 1000),
            time_end: initialData?.time_end 
                ? new Date(initialData.time_end)
                : new Date(Date.now() + 48 * 60 * 60 * 1000),
            status: initialData?.status || "active",
        }
    });

    const handleSubmit = async (values: DiscountFormData) => {
        try {
            // Validate values before sending
            if (!values.name || values.name.length < 3) {
                form.setError('name', {
                    type: 'manual',
                    message: 'Name must be at least 3 characters'
                });
                return;
            }

            if (!values.desc || values.desc.length < 10) {
                form.setError('desc', {
                    type: 'manual',
                    message: 'Description must be at least 10 characters'
                });
                return;
            }

            const discount_percent = Number(values.discount_percent);
            if (isNaN(discount_percent) || discount_percent < 0 || discount_percent > 100) {
                form.setError('discount_percent', {
                    type: 'manual',
                    message: 'Discount percentage must be between 0 and 100'
                });
                return;
            }

            if (!values.status || values.status.length < 3) {
                form.setError('status', {
                    type: 'manual',
                    message: 'Status must be at least 3 characters'
                });
                return;
            }

            // Kiểm tra time_end phải sau time_start
            if (values.time_end <= values.time_start) {
                form.setError('time_end', {
                    type: 'manual',
                    message: 'End time must be after start time'
                });
                return;
            }

            const data = {
                name: values.name.trim(),
                desc: values.desc.trim(),
                discount_percent: discount_percent,
                time_start: values.time_start,
                time_end: values.time_end,
                status: values.status.trim()
            };

            // Call the parent's onSubmit handler
            await onSubmit(data);
            
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            // Handle validation errors
            if (error.response?.data?.message) {
                const errorMessage = error.response.data.message;
                
                // Check for MongoDB duplicate key error
                if (errorMessage?.includes('E11000 duplicate key error') || 
                    errorMessage?.includes('dup key')) {
                    form.setError('name', {
                        type: 'manual',
                        message: 'A discount with this name already exists. Please choose a different name.'
                    });
                    return;
                }

                // Handle other validation errors
                if (Array.isArray(errorMessage)) {
                    form.clearErrors();
                    errorMessage.forEach(message => {
                        if (message.includes('name')) {
                            form.setError('name', {
                                type: 'manual',
                                message: message
                            });
                        } else if (message.includes('desc')) {
                            form.setError('desc', {
                                type: 'manual',
                                message: message
                            });
                        } else if (message.includes('discount_percent')) {
                            form.setError('discount_percent', {
                                type: 'manual',
                                message: message
                            });
                        } else if (message.includes('status')) {
                            form.setError('status', {
                                type: 'manual',
                                message: message
                            });
                        }
                    });
                }
            }
        }
    };

    // Tính toán giá trị tối thiểu cho datetime-local
    const minDateTime = new Date();
    minDateTime.setMinutes(minDateTime.getMinutes() - minDateTime.getTimezoneOffset());

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discount Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter discount name" {...field} />
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
                                    placeholder="Enter discount description"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="discount_percent"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discount Percentage</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                    placeholder="Enter discount percentage"
                                    {...field}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const numValue = value === '' ? 0 : Math.min(100, Math.max(0, parseInt(value)));
                                        field.onChange(numValue);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="time_start"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        min={minDateTime.toISOString().slice(0, 16)}
                                        value={field.value?.toISOString().slice(0, 16) || ''}
                                        onChange={(e) => {
                                            field.onChange(e.target.value ? new Date(e.target.value) : null);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="time_end"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        min={form.watch('time_start')?.toISOString().slice(0, 16) || minDateTime.toISOString().slice(0, 16)}
                                        value={field.value?.toISOString().slice(0, 16) || ''}
                                        onChange={(e) => {
                                            field.onChange(e.target.value ? new Date(e.target.value) : null);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Status</FormLabel>
                                <div className="text-sm text-muted-foreground">
                                    Discount is {field.value}
                                </div>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value === "active"}
                                    onCheckedChange={(checked) => {
                                        field.onChange(checked ? "active" : "inactive");
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Saving...' : (initialData ? 'Update Discount' : 'Create Discount')}
                </Button>
            </form>
        </Form>
    );
} 
