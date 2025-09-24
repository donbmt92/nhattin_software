"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import { CalendarIcon, ClockIcon, ChevronLeft, Share2, BookmarkPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { ArticleSchema, BreadcrumbSchema } from "@/components/StructuredData"

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

interface PostDetailPageProps {
    params: {
        slug: string
    }
}

// Hàm để tính thời gian đọc
const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} phút đọc`;
};

export default function PostDetailPage({ params }: PostDetailPageProps) {
    const { slug } = params;
    const [post, setPost] = useState<Post | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                // Fetch post by slug
                const response = await axios.get(`${API_URL}/posts/slug/${slug}`);
                console.log("chitiet", response);

                if (response.data) {
                    setPost(response.data);

                    // Fetch related posts by category
                    if (response.data.category?._id) {
                        const relatedResponse = await axios.get(`${API_URL}/posts?categoryId=${response.data.category._id}&limit=3`);
                        if (Array.isArray(relatedResponse.data)) {
                            // Lọc ra những bài viết khác với bài hiện tại
                            const filtered = relatedResponse.data.filter(p => p._id !== response.data._id);
                            setRelatedPosts(filtered);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-4">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-16 w-full" />
                </div>
                <Skeleton className="h-[400px] w-full mb-8 rounded-xl" />
                <div className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h1>
                <p className="text-gray-500 mb-8">Bài viết này không tồn tại hoặc đã bị xóa.</p>
                <Link href="/news">
                    <Button>Quay lại trang tin tức</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Structured Data */}
            <ArticleSchema
                headline={post.title}
                description={post.content.replace(/<[^>]*>/g, '').substring(0, 160)}
                image={post.thumbnail}
                datePublished={post.createdAt}
                dateModified={post.updatedAt}
                author={{ name: "Nhất Tín Software Team" }}
                publisher={{ name: "Nhất Tín Software", logo: "https://nhattinsoftware.com/images/icon/logo.svg" }}
            />
            <BreadcrumbSchema
                items={[
                    { name: "Trang chủ", url: "https://nhattinsoftware.com" },
                    { name: "Tin tức", url: "https://nhattinsoftware.com/news" },
                    { name: post.title, url: `https://nhattinsoftware.com/news/${post.slug}` }
                ]}
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link href="/news" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                        <ChevronLeft className="h-4 w-4" />
                        <span>Quay lại tin tức</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <article className="bg-white rounded-xl shadow-md overflow-hidden">
                            {/* Post Header */}
                            <div className="p-6 pb-0">
                                {post.category && (
                                    <Badge variant="outline" className="mb-3">
                                        {post.category.name}
                                    </Badge>
                                )}
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
                                <div className="flex items-center text-gray-500 text-sm mb-6 flex-wrap gap-y-2">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    <span className="mr-4">{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                                    <ClockIcon className="h-4 w-4 mr-1" />
                                    <span className="mr-4">{calculateReadTime(post.content)}</span>
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div className="relative h-[400px] w-full mb-6">
                                <Image
                                    src={`${post.thumbnail}`}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Actions */}
                            <div className="px-6 mb-6 flex gap-3">
                                <Button variant="outline" size="sm" className="flex gap-1">
                                    <Share2 className="h-4 w-4" />
                                    <span>Chia sẻ</span>
                                </Button>
                                <Button variant="outline" size="sm" className="flex gap-1">
                                    <BookmarkPlus className="h-4 w-4" />
                                    <span>Lưu</span>
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="px-6 pb-8">
                                <div
                                    className="prose prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            </div>
                        </article>

                        {/* Tags and Categories */}
                        <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
                            <div className="flex flex-wrap gap-2">
                                {post.category && (
                                    <Link href={`/news?category=${post.category._id}`}>
                                        <Badge variant="secondary" className="cursor-pointer">
                                            {post.category.name}
                                        </Badge>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        {/* Related Posts */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                            <h3 className="text-lg font-semibold mb-4">Bài viết liên quan</h3>

                            {relatedPosts.length > 0 ? (
                                <div className="space-y-6">
                                    {relatedPosts.map((relatedPost) => (
                                        <Link href={`/news/${relatedPost.slug}`} key={relatedPost._id} className="block group">
                                            <div className="flex gap-3">
                                                <div className="relative h-20 w-28 flex-shrink-0 rounded-md overflow-hidden">
                                                    <Image
                                                        src={`${relatedPost.thumbnail}`}
                                                        alt={relatedPost.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-all duration-300"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                        {relatedPost.title}
                                                    </h4>
                                                    <span className="text-xs text-gray-500 mt-1 block">
                                                        {new Date(relatedPost.createdAt).toLocaleDateString("vi-VN")}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">Không có bài viết liên quan</p>
                            )}
                        </div>

                        {/* Newsletter */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">Đăng ký nhận tin</h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    Nhận thông báo về những bài viết mới nhất
                                </p>
                                <div className="space-y-3">
                                    <input
                                        type="email"
                                        placeholder="Email của bạn"
                                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Button className="w-full">Đăng ký</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
} 