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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CategoryData {
  type: string;
  name: string;
}

const createCategory = async (data: CategoryData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
};

const updateCategory = async (id: string, data: CategoryData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/categories?id=${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
};

const formSchema = z.object({
  type: z.string().min(2, {
    message: "Type must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

interface CategoryFormProps {
  initialData?: {
    _id?: string;
    type: string;
    name: string;
  };
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialData?.type || "",
      name: initialData?.name || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData?._id) {
        await updateCategory(initialData._id, values);
      } else {
        await createCategory(values);
      }
      router.push("/dashboard/categories");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {initialData?._id ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 