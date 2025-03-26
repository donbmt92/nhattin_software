"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CategoryData {
  type: string;
  name: string;
  image?: File;
}

const createCategory = async (data: CategoryData) => {
    const token = localStorage.getItem('nhattin_token');
    const formData = new FormData();
    
    // Append all data to FormData
    formData.append('name', data.name);
    formData.append('type', data.type);
    if (data.image) {
        formData.append('image', data.image);
    }

    try {
        const response = await axios.post(`${API_URL}/categories`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Failed to create category');
        }
        throw error;
    }
};

const updateCategory = async (id: string, data: CategoryData) => {
    const token = localStorage.getItem('nhattin_token');
    const formData = new FormData();
    
    // Append all data to FormData
    formData.append('name', data.name);
    formData.append('type', data.type);
    if (data.image) {
        formData.append('image', data.image);
    }

    try {
        const response = await axios.put(`${API_URL}/categories/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Failed to update category');
        }
        throw error;
    }
};

const formSchema = z.object({
  type: z.string().min(2, {
    message: "Type must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  image: z.any().optional(),
});

interface CategoryFormProps {
  initialData?: {
    _id?: string;
    type: string;
    name: string;
    image?: string;
  };
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image || null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialData?.type || "",
      name: initialData?.name || "",
      image: null,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('File type must be jpg, jpeg, png, or gif');
        return;
      }

      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsUploading(true);
      if (initialData?._id) {
        await updateCategory(initialData._id, values);
      } else {
        await createCategory(values);
      }
      router.push("/dashboard/categories");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert('Failed to save category. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData?._id ? "Edit Category" : "Create New Category"}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {initialData?._id ? "Update the category details below." : "Fill in the details to create a new category."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Type</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter category type" 
                      {...field} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter category name" 
                      {...field} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif"
                        onChange={(e) => {
                          handleImageChange(e);
                          onChange(e.target.files?.[0]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {previewUrl && (
                        <div className="relative w-32 h-32">
                          <Image
                            src={previewUrl}
                            alt="Category preview"
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-end space-x-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/categories")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : (initialData?._id ? "Update Category" : "Create Category")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 