"use client"

import { useState } from "react"
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

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Array<{ id: string; name: string }>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
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
      const token = localStorage.getItem('token')
      console.log(categoryId);
      
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('categoryId', categoryId)
      formData.append('slug', slug)
      if (thumbnail) {
        formData.append('thumbnail', thumbnail)
      }

      await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      
      onSuccess()
      onOpenChange(false)
      setTitle("")
      setContent("")
      setCategoryId("")
      setThumbnail(null)
      setThumbnailPreview("")
      setSlug("")
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setLoading(false)
    }
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
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-input bg-background"
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
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
              variant="outline"
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