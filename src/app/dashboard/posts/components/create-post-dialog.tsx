"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Editor } from '@tinymce/tinymce-react'
import Image from 'next/image'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const generateSlug = (title: string): string => {
  return title
    .toLowerCase() // chuyển thành chữ thường
    .normalize('NFD') // chuẩn hóa unicode
    .replace(/[\u0300-\u036f]/g, '') // xóa dấu tiếng Việt
    .replace(/[đĐ]/g, 'd') // thay thế đ/Đ thành d
    .replace(/[^a-z0-9\s]/g, '') // chỉ giữ lại chữ cái và số
    .replace(/\s+/g, '-') // thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, '-') // xóa các dấu gạch ngang liên tiếp
    .replace(/^-+|-+$/g, '') // xóa dấu gạch ngang ở đầu và cuối
}

// Định nghĩa kiểu dữ liệu cho danh mục
interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  onSuccess: () => void
}

export default function CreatePostDialog({
  open,
  onOpenChange,
  categories,
  onSuccess,
}: CreatePostDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState("")
  const [slug, setSlug] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    categoryId: "",
    thumbnail: "",
    slug: ""
  })

  // Debug log để kiểm tra danh sách categories
  useEffect(() => {
    console.log("Available categories:", categories);
    console.log("Category structure sample:", categories.length > 0 ? categories[0] : "No categories");
    // Thiết lập giá trị mặc định cho categoryId nếu có danh sách categories
    if (categories && categories.length > 0 && !categoryId) {
      setCategoryId(categories[0]._id);
      console.log("Setting default categoryId:", categories[0]._id);
    }
  }, [categories, categoryId]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnail(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setThumbnailPreview(previewUrl)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    // Tự động cập nhật slug khi nhập tiêu đề
    setSlug(generateSlug(newTitle))
  }

  // Xem trước thông tin danh mục được chọn
  const selectedCategory = categories.find(cat => cat._id === categoryId);
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setCategoryId(selectedId);
    console.log("Selected category:", selectedId, 
      "Category object:", categories.find(cat => cat._id === selectedId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({
      title: "",
      content: "",
      categoryId: "",
      thumbnail: "",
      slug: ""
    })

    // Validate fields
    let hasError = false
    if (!title.trim()) {
      setErrors(prev => ({ ...prev, title: "Vui lòng nhập tiêu đề" }))
      hasError = true
    }
    if (!content.trim()) {
      setErrors(prev => ({ ...prev, content: "Vui lòng nhập nội dung" }))
      hasError = true
    }
    if (!categoryId) {
      setErrors(prev => ({ ...prev, categoryId: "Vui lòng chọn danh mục" }))
      hasError = true
    }
    if (!thumbnail) {
      setErrors(prev => ({ ...prev, thumbnail: "Vui lòng chọn ảnh thumbnail" }))
      hasError = true
    }
    if (!slug.trim()) {
      setErrors(prev => ({ ...prev, slug: "Vui lòng nhập slug" }))
      hasError = true
    }

    if (hasError) return

    try {
      setLoading(true)
      
      // Lấy token từ localStorage
      const token = localStorage.getItem('nhattin_token')
      if (!token) {
        throw new Error('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.')
      }
      
      // Kiểm tra token có hợp lệ không
      console.log("Verifying token...");
      try {
        const verifyResponse = await axios.get(`${API_URL}/auth/verify-token`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("Token verification response:", verifyResponse.data);
      } catch (error) {
        console.error("Token verification failed:", error);
        // Kiểm tra xem có phải lỗi 401 không
        const tokenError = error as any;
        if (tokenError.response && tokenError.response.status === 401) {
          // Xóa token không hợp lệ và chuyển hướng đến trang login
          localStorage.removeItem('nhattin_token');
          localStorage.removeItem('nhattin_user');
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          // Sử dụng window.location thay vì router.push vì cần reload
          window.location.href = '/login';
          return;
        }
        // Nếu không phải 401, tiếp tục thử tạo bài viết
        console.log("Token might still be valid, continuing...");
      }
      
      // Kiểm tra API_URL
      if (!API_URL) {
        throw new Error('API_URL không được cấu hình. Vui lòng kiểm tra biến môi trường NEXT_PUBLIC_API_URL.');
      }
      
      console.log("API URL:", API_URL);
      console.log("Creating post with category ID:", categoryId);
      
      // Kiểm tra định dạng của categoryId
      if (!categoryId || categoryId.trim() === "") {
        throw new Error('CategoryId không được để trống');
      }
      
      // Xác nhận xem categoryId có phải là một ID hợp lệ không
      const selectedCategory = categories.find(cat => cat._id === categoryId);
      if (!selectedCategory) {
        console.error("Invalid category selection. Available categories:", categories);
        console.error("Current categoryId:", categoryId);
        throw new Error('Danh mục không hợp lệ. Vui lòng chọn lại.');
      }
      console.log("Selected category for submission:", selectedCategory);
      
      // Kiểm tra định dạng MongoDB ObjectId - thường là 24 ký tự hex
      const objectIdPattern = /^[0-9a-fA-F]{24}$/;
      if (!objectIdPattern.test(selectedCategory._id)) {
        console.error("Invalid ObjectId format:", selectedCategory._id);
        throw new Error('ID danh mục không đúng định dạng MongoDB ObjectId.');
      }
      
      // Làm sạch nội dung (phòng ngừa)
      const sanitizedContent = content.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
      
      // Kiểm tra endpoint
      const endpoint = `${API_URL}/posts`;
      console.log("Posting to endpoint:", endpoint);

      try {
        console.log("Sending post data...");
        
        // Tạo form data
        const postFormData = new FormData();
        postFormData.append('title', title);
        postFormData.append('content', sanitizedContent);
        
        // Đảm bảo categoryId được gửi đúng dạng mà API mong đợi
        // MongoDB có thể chấp nhận cả chuỗi ID và ObjectId thực tế
        console.log("Selected category:", selectedCategory);
        const categoryIdToSend = selectedCategory._id;
        console.log("Category ID being sent:", categoryIdToSend, typeof categoryIdToSend);
        postFormData.append('categoryId', categoryIdToSend);
        
        postFormData.append('slug', slug);
        if (thumbnail) {
          postFormData.append('thumbnail', thumbnail);
        }
        
        // Hiển thị FormData để debug
        console.log("FormData being sent:");
        for (const pair of Array.from(postFormData.entries())) {
          console.log(`${pair[0]}: ${pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]}`);
        }
        
        // Gửi dữ liệu
        const response = await axios.post(endpoint, postFormData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            // Không chỉ định Content-Type, để axios tự xử lý
          }
        });
        
        console.log("Server response:", response.data);
        onSuccess();
        onOpenChange(false);
        resetForm();
        return;
      } catch (error: any) {
        console.error("Error creating post:", error);
        
        // Thử xử lý một số lỗi cụ thể từ dữ liệu lỗi
        const errorData = error.response?.data;
        const errorMessage = errorData?.message || error.message || 'Unknown error';
        console.log("Full error message:", errorMessage);
        
        // Phát hiện lỗi ObjectId
        if (typeof errorMessage === 'string' && 
            (errorMessage.includes('Cast to ObjectId') || 
             errorMessage.includes('ObjectId') || 
             errorMessage.includes('PostCategory'))) {
          console.error("ObjectId error detected:", errorMessage);
          console.log("Current categoryId:", categoryId);
          console.log("Selected category:", selectedCategory);
          
          setErrors(prev => ({ 
            ...prev, 
            categoryId: "ID danh mục không hợp lệ. Đang sử dụng: " + categoryId 
          }));
          
          alert(`Lỗi: ID danh mục không hợp lệ. 
Chi tiết: ${errorMessage}
ID đang sử dụng: ${categoryId}`);
          
        } else if (error.response?.status === 400) {
          // Xử lý lỗi validate từ server
          setErrors(prev => ({ 
            ...prev,
            title: errorData?.title || prev.title,
            content: errorData?.content || prev.content,
            categoryId: errorData?.categoryId || prev.categoryId,
            thumbnail: errorData?.thumbnail || prev.thumbnail,
            slug: errorData?.slug || prev.slug
          }));
        } else {
          // Hiển thị thông báo lỗi chung
          alert(`Lỗi khi tạo bài viết: ${errorMessage}`);
        }
      }
    } catch (error: any) {
      // Xử lý lỗi tổng quát
      console.error("General error in handleSubmit:", error);
    } finally {
      // Đảm bảo luôn tắt trạng thái loading
      setLoading(false);
    }
  }
  
  // Hàm reset form
  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategoryId("");
    setThumbnail(null);
    setThumbnailPreview("");
    setSlug("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm bài viết mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Nhập tiêu đề bài viết"
              required
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Slug sẽ được tự động tạo từ tiêu đề"
              required
            />
            {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Ảnh thumbnail</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              required
            />
            {thumbnailPreview && (
              <div className="mt-2 relative w-[200px] h-[150px]">
                <Image 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            {errors.thumbnail && <p className="text-sm text-red-500">{errors.thumbnail}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Danh mục</Label>
            <select
              id="category"
              value={categoryId}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border rounded-md border-input bg-background"
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {selectedCategory && (
              <p className="text-xs text-gray-500">
                ID đã chọn: {categoryId} - {selectedCategory.name}
              </p>
            )}
            {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
          </div>
          <div className="space-y-2">
            <Label>Nội dung</Label>
            <Editor
              apiKey="7ym8qu58ux5xtav5swudx1urfs7zaxh5zsg27tjey45v48oo"
              value={content}
              onEditorChange={(content) => setContent(content)}
              init={{
                height: 400,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo bài viết"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
