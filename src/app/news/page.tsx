"use client"

import Image from "next/image"
import { CalendarIcon, ClockIcon, ChevronRightIcon, TrendingUpIcon } from "lucide-react"
import { useState } from "react"

const categories = [
  { id: "all", name: "Tất cả", count: "347" },
  { id: "tech", name: "Công nghệ", count: "124" },
  { id: "programming", name: "Lập trình", count: "89" },
  { id: "security", name: "Bảo mật", count: "56" },
  { id: "ai", name: "AI & ML", count: "78" }
]

const articles = [
  {
    id: "1",
    title: "Cuộc cách mạng AI 2024: Những đột phá mới nhất trong công nghệ trí tuệ nhân tạo",
    image: "/images/ai-future.jpg",
    category: "ai",
    categoryLabel: "CÔNG NGHỆ",
    date: "24/03/2024",
    readTime: "8 phút đọc",
    views: "2.5K",
    featured: true
  },
  {
    id: "2",
    title: "Apple Vision Pro: Tương lai của thực tế ảo đã đến",
    image: "/images/vision-pro.jpg",
    category: "tech",
    date: "24/03/2024",
    views: "1.8K",
    trending: true
  },
  {
    id: "3",
    title: "ChatGPT-5: OpenAI chuẩn bị ra mắt phiên bản mới",
    image: "/images/chatgpt.jpg",
    category: "ai",
    date: "23/03/2024",
    views: "1.5K",
    trending: true
  },
  {
    id: "4",
    title: "Quantum Computing: Cuộc đua của các gã khổng lồ công nghệ",
    image: "/images/quantum.jpg",
    category: "tech",
    date: "23/03/2024",
    views: "1.2K",
    trending: true
  },
  {
    id: "5",
    title: "Web Development 2024: Những xu hướng mới nhất",
    desc: "React Server Components, Next.js App Router và những công nghệ đang định hình tương lai của web",
    image: "/images/web-dev.jpg",
    category: "programming",
    categoryLabel: "LẬP TRÌNH",
    date: "24/03/2024"
  },
  {
    id: "6",
    title: "Cybersecurity: Những thách thức trong kỷ nguyên AI",
    desc: "Làm thế nào để bảo vệ dữ liệu trong thời đại của các mối đe dọa thông minh",
    image: "/images/security.jpg",
    category: "security",
    categoryLabel: "BẢO MẬT",
    date: "24/03/2024"
  },
  {
    id: "7",
    title: "5G và IoT: Kết nối vạn vật trong tương lai",
    desc: "Khám phá tiềm năng của mạng 5G trong việc phát triển Internet of Things",
    image: "/images/5g-iot.jpg",
    category: "tech",
    categoryLabel: "CÔNG NGHỆ",
    date: "23/03/2024"
  }
]

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredArticles = articles.filter(
    article => selectedCategory === "all" || article.category === selectedCategory
  )

  const featuredArticle = filteredArticles.find(article => article.featured)
  const trendingArticles = filteredArticles.filter(article => article.trending)
  const latestArticles = filteredArticles.filter(article => !article.featured && !article.trending)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Categories Navigation */}
        <div className="flex overflow-x-auto gap-4 mb-8 pb-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500
                ${selectedCategory === category.id 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-white text-gray-800 shadow-sm hover:shadow-md"}`}
            >
              <span className="font-medium">{category.name}</span>
              <span className={`text-sm ${selectedCategory === category.id ? "text-blue-100" : "text-gray-500"}`}>
                ({category.count})
              </span>
            </button>
          ))}
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Main Featured Article */}
          {featuredArticle && (
            <div className="md:col-span-2 relative group rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-[400px] w-full">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6">
                <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                  {featuredArticle.categoryLabel}
                </span>
                <h1 className="text-white text-2xl font-bold mt-3 leading-tight">
                  {featuredArticle.title}
                </h1>
                <div className="flex items-center text-gray-300 text-sm mt-3">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>{featuredArticle.date}</span>
                  <ClockIcon className="h-4 w-4 ml-4 mr-2" />
                  <span>{featuredArticle.readTime}</span>
                  <TrendingUpIcon className="h-4 w-4 ml-4 mr-2" />
                  <span>{featuredArticle.views}</span>
                </div>
              </div>
            </div>
          )}

          {/* Trending Articles */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Xu hướng</h2>
            {trendingArticles.map((article) => (
              <div key={article.id} className="flex gap-4 group cursor-pointer">
                <div className="relative h-24 w-32 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mt-2">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{article.date}</span>
                    <TrendingUpIcon className="h-4 w-4 ml-3 mr-1" />
                    <span>{article.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest News Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Tin mới nhất</h2>
            <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium">
              Xem tất cả <ChevronRightIcon className="h-4 w-4 ml-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-xl shadow-md overflow-hidden group">
                <div className="relative h-48 w-full">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-blue-600">{article.categoryLabel}</span>
                  <h3 className="mt-2 text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">{article.desc}</p>
                  <div className="flex items-center mt-4 text-gray-500 text-sm">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{article.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-blue-600 rounded-xl p-8 text-white mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Đăng ký nhận tin tức công nghệ mới nhất</h2>
            <p className="text-blue-100 mb-6">
              Nhận những tin tức công nghệ mới nhất và độc quyền trực tiếp vào email của bạn
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: "Công nghệ", count: "124" },
            { name: "Lập trình", count: "89" },
            { name: "Bảo mật", count: "56" },
            { name: "AI & ML", count: "78" }
          ].map((category, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="font-semibold text-gray-800">{category.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{category.count} bài viết</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 