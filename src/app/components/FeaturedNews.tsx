"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import { CalendarIcon, ChevronRightIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Post {
  _id: string
  title: string
  slug: string
  thumbnail: string
  category?: {
    _id: string
    name: string
  }
  createdAt: string
}

// Hàm để trích xuất đoạn mô tả từ nội dung HTML
const extractDescription = (htmlContent: string, maxLength: number = 150): string => {
  if (!htmlContent) return "";
  // Loại bỏ các thẻ HTML
  const textContent = htmlContent.replace(/<[^>]+>/g, '');
  // Cắt đến độ dài mong muốn
  return textContent.length > maxLength 
    ? textContent.substring(0, maxLength) + '...' 
    : textContent;
};

export default function FeaturedNews() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/posts?limit=3`);
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tin tức mới nhất</h2>
          <Link href="/news" className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium">
            Xem tất cả <ChevronRightIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link href={`/news/${post.slug}`} key={post._id}>
              <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src={`${API_URL}/${post.thumbnail}`}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  {post.category && (
                    <Badge variant="outline" className="mb-2">
                      {post.category.name}
                    </Badge>
                  )}
                  <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center mt-3 text-gray-500 text-xs">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 