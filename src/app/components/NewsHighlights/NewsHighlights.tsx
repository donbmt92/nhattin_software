"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Post {
  _id: string;
  title: string;
  content: string;
  slug: string;
  thumbnail: string;
  categoryId?: string;
  category?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  views?: number;
}

// Hàm để tính thời gian đọc
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} phút đọc`;
};

export default function NewsHighlights() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/posts?limit=4`);
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Phân loại bài viết
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const latestPosts = posts.length > 1 ? posts.slice(1, 4) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Tin tức & Bài viết</h2>
        <Link href="/news" className="text-blue-600 hover:underline font-medium">
          Xem tất cả
        </Link>
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
    </div>
  );
}
