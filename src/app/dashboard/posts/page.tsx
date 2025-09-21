"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreatePostDialog from "./components/create-post-dialog"
import EditPostDialog from "./components/edit-post-dialog"
import DeleteDialog from "./components/delete-dialog"
import CreateCategoryDialog from "./components/create-category-dialog"
import EditCategoryDialog from "./components/edit-category-dialog"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Post {
  _id: string
  title: string
  content: string
  categoryId?: string
  category?: {
    _id: string
    name: string
    description?: string
    isActive?: boolean
  }
  createdAt: string
  updatedAt: string
  thumbnail?: string
  slug?: string
  isActive?: boolean
}

interface PostCategory {
  _id: string
  name: string
  description: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<PostCategory[]>([])
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [isEditPostOpen, setIsEditPostOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("posts")

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`)
      console.log("fetchPosts", response.data);
      
      // Đảm bảo dữ liệu có định dạng đúng
      const formattedPosts = Array.isArray(response.data) ? response.data.map(post => {
        return {
          ...post,
          // Đảm bảo các trường chính luôn tồn tại
          _id: post._id,
          title: post.title || '',
          content: post.content || '',
          category: post.category || { _id: '', name: 'Không phân loại' }
        };
      }) : [];

      console.log("Formatted posts:", formattedPosts);
      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/post-categories`)
      console.log("Categories data from API:", response.data);
      
      // Đảm bảo dữ liệu có cấu trúc đúng
      const categoriesData = response.data;
      if (Array.isArray(categoriesData)) {
        // Map data để đảm bảo cấu trúc nhất quán
        const formattedCategories = categoriesData.map(cat => ({
          _id: cat._id,
          name: cat.name,
          description: cat.description,
          isActive: cat.isActive,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt
        }));
        
        console.log("Formatted categories:", formattedCategories);
        setCategories(formattedCategories);
      } else {
        console.error("Categories data is not an array:", categoriesData);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  }

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [])

  const handleDelete = async (id: string, type: 'post' | 'category') => {
    try {
      console.log(id);
      
      const endpoint = type === 'post' ? 'posts' : 'post-categories'
      await axios.delete(`${API_URL}/${endpoint}/${id}`)
      if (type === 'post') {
        fetchPosts()
      } else {
        fetchCategories()
      }
      setIsDeleteOpen(false)
    } catch (error) {
      console.error(`Error deleting ${type}:`, error)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="posts">Bài viết</TabsTrigger>
            <TabsTrigger value="categories">Danh mục</TabsTrigger>
          </TabsList>
          <Button
            onClick={() => activeTab === "posts" ? setIsCreatePostOpen(true) : setIsCreateCategoryOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm {activeTab === "posts" ? "bài viết" : "danh mục"}
          </Button>
        </div>

        <TabsContent value="posts">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {post.category?.name || "Không phân loại"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => {
                          setSelectedItem(post)
                          setIsEditPostOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => {
                          setSelectedItem({ id: post._id, type: 'post' })
                          setIsDeleteOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{new Date(category.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => {
                          setSelectedItem(category)
                          setIsEditCategoryOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => {
                          setSelectedItem({ id: category._id, type: 'category' })
                          setIsDeleteOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
        categories={categories}
        onSuccess={fetchPosts}
      />

      <EditPostDialog
        open={isEditPostOpen}
        onOpenChange={setIsEditPostOpen}
        post={selectedItem}
        categories={categories}
        onSuccess={fetchPosts}
      />

      <CreateCategoryDialog
        open={isCreateCategoryOpen}
        onOpenChange={setIsCreateCategoryOpen}
        onSuccess={fetchCategories}
      />

      <EditCategoryDialog
        open={isEditCategoryOpen}
        onOpenChange={setIsEditCategoryOpen}
        category={selectedItem}
        onSuccess={fetchCategories}
      />

      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={() => {
          if (selectedItem && selectedItem.id) {
            handleDelete(selectedItem.id, selectedItem.type);
          }
        }}
        type={selectedItem?.type || 'post'}
      />
    </div>
  )
} 
