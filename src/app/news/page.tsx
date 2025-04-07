"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import axios from "axios"
import Link from "next/link"
import { CalendarIcon, ClockIcon, ChevronRightIcon, TrendingUpIcon, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Category {
  _id: string
  name: string
  description?: string
  isActive?: boolean
}

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

export default function NewsPage() {
  // State
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);

  // Fetch posts và categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch posts
        const postsResponse = await axios.get(`${API_URL}/posts`);
        console.log("fetchPost", postsResponse);
        
        if (Array.isArray(postsResponse.data)) {
          setPosts(postsResponse.data);
        }
        
        // Fetch categories
        const categoriesResponse = await axios.get(`${API_URL}/post-categories`);
        if (Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Lọc bài viết theo danh mục và tìm kiếm
  const filteredPosts = posts.filter(post => {
    // Lọc theo danh mục
    const categoryMatch = selectedCategory === "all" || post.category?._id === selectedCategory;
    
    // Lọc theo tìm kiếm
    const searchMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       extractDescription(post.content).toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  
  useEffect(() => {
    setTotalPages(Math.ceil(filteredPosts.length / itemsPerPage));
    setCurrentPage(1); // Reset về trang 1 khi lọc thay đổi
  }, [filteredPosts, itemsPerPage]);

  // Phân loại bài viết
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const latestPosts = filteredPosts.length > 1 ? filteredPosts.slice(1, 4) : [];
  
  // Handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Banner */}
        <div className="bg-blue-600 text-white rounded-xl p-8 mb-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-4">Tin tức & Bài viết mới nhất</h1>
            <p className="text-blue-100 mb-6">
              Cập nhật những tin tức mới nhất về công nghệ, sản phẩm và xu hướng thị trường
            </p>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="flex overflow-x-auto gap-4 mb-8 pb-4 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500
              ${selectedCategory === "all" 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-white text-gray-800 shadow-sm hover:shadow-md"}`}
          >
            <span className="font-medium">Tất cả</span>
          </button>
          
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/news/category/${category._id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500
                ${selectedCategory === category._id 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-white text-gray-800 shadow-sm hover:shadow-md"}`}
            >
              <span className="font-medium">{category.name}</span>
            </Link>
          ))}
        </div>

        {loading ? (
          /* Skeleton Loading */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="md:col-span-2">
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-24 w-32 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Featured and Trending Posts */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Main Featured Article */}
            {featuredPost && (
              <Link href={`/news/${featuredPost.slug}`} className="md:col-span-2 relative group rounded-xl overflow-hidden shadow-lg block">
                <div className="relative h-[400px] w-full">
                  <Image
                    src={`${featuredPost.thumbnail}`}
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6">
                  <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700">
                    {featuredPost.category?.name || "Tin tức"}
                  </Badge>
                  <h1 className="text-white text-2xl font-bold mt-3 leading-tight">
                    {featuredPost.title}
                  </h1>
                  <div className="flex items-center text-gray-300 text-sm mt-3">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>{new Date(featuredPost.createdAt).toLocaleDateString("vi-VN")}</span>
                    <ClockIcon className="h-4 w-4 ml-4 mr-2" />
                    <span>{calculateReadTime(featuredPost.content)}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Latest Articles */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Bài viết mới</h2>
              {latestPosts.map((post) => (
                <Link href={`/news/${post.slug}`} key={post._id} className="flex gap-4 group cursor-pointer">
                  <div className="relative h-24 w-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={`${post.thumbnail}`}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mt-2">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All News Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedCategory === "all" 
                ? "Tất cả bài viết" 
                : `Bài viết trong ${categories.find(c => c._id === selectedCategory)?.name || ""}`}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Lọc</span>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader className="p-0">
                    <Skeleton className="h-48 rounded-t-xl rounded-b-none" />
                  </CardHeader>
                  <CardContent className="p-6 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : currentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentItems.map((post) => (
                <Link href={`/news/${post.slug}`} key={post._id}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <div className="relative h-48 w-full">
                        <Image
                          src={`${post.thumbnail}`}
                          alt={post.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Badge variant="outline" className="mb-2">
                        {post.category?.name || "Tin tức"}
                      </Badge>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
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
            <div className="text-center py-12">
              <h3 className="text-lg text-gray-500">Không tìm thấy bài viết nào</h3>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
              >
                Xem tất cả bài viết
              </Button>
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

        {/* Newsletter Subscription */}
        <div className="bg-blue-600 rounded-xl p-8 text-white mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Đăng ký nhận tin tức mới nhất</h2>
            <p className="text-blue-100 mb-6">
              Nhận những tin tức mới nhất và độc quyền trực tiếp vào email của bạn
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Email của bạn"
                className="bg-white/10 border-white/20 text-white placeholder:text-blue-100"
              />
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                Đăng ký
              </Button>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Danh mục bài viết</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link href={`/news/category/${category._id}`} key={category._id}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {posts.filter(post => post.category?._id === category._id).length} bài viết
                    </p>
                    <div className="mt-4 text-blue-600 text-sm font-medium flex items-center">
                      <span>Xem tất cả</span>
                      <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 