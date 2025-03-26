"use client"

import * as React from "react"
import { Plus, X, Facebook } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SocialButtonProps {
  icon: React.ReactNode
  color: string
  href: string
  label: string
}

const SocialButton = ({ icon, color, href, label }: SocialButtonProps) => (
  <Button size="icon" className={cn("h-10 w-10 rounded-full shadow-md transition-all duration-200", color)} asChild>
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
      {icon}
    </a>
  </Button>
)

// Custom TikTok icon
const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    <path d="M15 8v8a4 4 0 0 1-4 4" />
    <line x1="15" y1="4" x2="15" y2="12" />
  </svg>
)

// Custom Zalo icon
const ZaloIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M7 13l3 3 7-7" />
  </svg>
)

export function ExpandingFloatButton() {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-3">
      {/* Social media buttons */}
      <div className="flex flex-col gap-3">
        {/* Facebook button */}
        <div
          className={cn(
            "transition-all duration-300 transform",
            isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none",
          )}
        >
          <SocialButton
            icon={<Facebook className="h-5 w-5" />}
            color="bg-blue-600 hover:bg-blue-700 text-white"
            href="https://facebook.com"
            label="Facebook"
          />
        </div>

        {/* TikTok button */}
        <div
          className={cn(
            "transition-all duration-300 transform",
            isExpanded ? "opacity-100 translate-y-0 delay-75" : "opacity-0 translate-y-10 pointer-events-none",
          )}
        >
          <SocialButton
            icon={<TikTokIcon />}
            color="bg-black hover:bg-gray-800 text-white"
            href="https://tiktok.com"
            label="TikTok"
          />
        </div>

        {/* Zalo button */}
        <div
          className={cn(
            "transition-all duration-300 transform",
            isExpanded ? "opacity-100 translate-y-0 delay-150" : "opacity-0 translate-y-10 pointer-events-none",
          )}
        >
          <SocialButton
            icon={<ZaloIcon />}
            color="bg-blue-500 hover:bg-blue-600 text-white"
            href="https://zalo.me"
            label="Zalo"
          />
        </div>
      </div>

      {/* Main floating button */}
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={toggleExpand}
        aria-label={isExpanded ? "Close social media menu" : "Open social media menu"}
      >
        {isExpanded ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  )
}

