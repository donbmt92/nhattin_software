import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const floatButtonVariants = cva(
  "fixed rounded-full shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      size: {
        default: "h-14 w-14",
        sm: "h-10 w-10",
        lg: "h-16 w-16",
      },
      position: {
        "bottom-right": "bottom-4 right-4 md:bottom-8 md:right-8",
        "bottom-left": "bottom-4 left-4 md:bottom-8 md:left-8",
        "top-right": "top-4 right-4 md:top-8 md:right-8",
        "top-left": "top-4 left-4 md:top-8 md:left-8",
      },
    },
    defaultVariants: {
      size: "default",
      position: "bottom-right",
    },
  },
)

export interface FloatButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof floatButtonVariants> {
  asChild?: boolean
  icon?: React.ReactNode
}

const FloatButton = React.forwardRef<HTMLButtonElement, FloatButtonProps>(
  ({ className, size, position, icon, asChild = false, ...props }, ref) => {
    return (
      <Button
        className={cn(floatButtonVariants({ size, position, className }))}
        size="icon"
        variant="default"
        ref={ref}
        {...props}
      >
        {icon || <Plus className="h-6 w-6" />}
      </Button>
    )
  },
)
FloatButton.displayName = "FloatButton"

export { FloatButton, floatButtonVariants }

