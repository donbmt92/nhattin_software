"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import { CalendarIcon, ClockIcon, ChevronLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Post {
  _id: string
  title: string
  content: string
  slug: string
  thumbnail: string
  categoryId?: string
  category?: {
    _id: string
    name: string
  }
  createdAt: string
  updatedAt: string
  isActive?: boolean
  views?: number
}

interface Category {
  _id: string
  name: string
  description?: string
  isActive?: boolean
}

interface CategoryPageProps {
  params: {
    id: string
  }
}

// Hàm để tính thời gian đọc
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} phút đọc`;
};

// Hàm để trích xuất đoạn mô tả từ nội dung HTML
const extractDescription = (htmlContent: string, maxLength: number = 150): string => {
  // Loại bỏ các thẻ HTML
  const textContent = htmlContent.replace(/<[^>]+>/g, '');
  // Cắt đến độ dài mong muốn
  return textContent.length > maxLength 
    ? textContent.substring(0, maxLength) + '...' 
    : textContent;
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const { id } = params;
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(9);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch category info
        const categoryResponse = await axios.get(`${API_URL}/post-categories/${id}`);
        if (categoryResponse.data) {
          setCategory(categoryResponse.data);
        }
        
        // Fetch posts by category
        const postsResponse = await axios.get(`${API_URL}/posts?categoryId=${id}`);
        if (Array.isArray(postsResponse.data)) {
          setPosts(postsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id]);
  
  // Lọc bài viết theo tìm kiếm
  const filteredPosts = posts.filter(post => {
    return post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           extractDescription(post.content).toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  
  // Handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-full max-w-md" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <Card key={i}>
                <CardHeader className="p-0">
                  <Skeleton className="h-48 rounded-t-xl rounded-b-none" />
                </CardHeader>
                <CardContent className="p-6 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy danh mục</h1>
          <p className="text-gray-500 mb-6">Danh mục này không tồn tại hoặc đã bị xóa.</p>
          <Link href="/news">
            <Button>Quay lại trang tin tức</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link href="/news" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
            <ChevronLeft className="h-4 w-4" />
            <span>Quay lại tin tức</span>
          </Link>
        </div>
        
        {/* Category Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-3">{category.name}</h1>
          {category.description && (
            <p className="text-gray-500 max-w-3xl">{category.description}</p>
          )}
          
          {/* Search */}
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Tìm kiếm trong danh mục này..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Posts Grid */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {currentItems.map((post) => (
              <Link href={`/news/${post.slug}`} key={post._id}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src={`${API_URL}/${post.thumbnail}`}
                        alt={post.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-2">
                      {category.name}
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                      {extractDescription(post.content)}
                    </p>
                  </CardContent>
                  <CardFooter className="text-sm text-gray-500 pt-0">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                      <ClockIcon className="h-4 w-4 ml-3 mr-1" />
                      <span>{calculateReadTime(post.content)}</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg text-gray-500 mb-3">Không có bài viết nào trong danh mục này</h3>
            <p className="text-sm text-gray-400 mb-6">Hãy thử tìm kiếm với từ khóa khác hoặc xem các danh mục khác</p>
            <Link href="/news">
              <Button variant="outline">Xem tất cả bài viết</Button>
            </Link>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={prevPage}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => paginate(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={nextPage}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
} 