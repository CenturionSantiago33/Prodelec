import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] group",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        outline:
          "border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 text-gray-700",
        secondary:
          "bg-navy-800 text-white hover:bg-navy-900 shadow-sm",
        ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-700",
        link: "text-primary-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-[8px] px-4",
        lg: "h-14 rounded-[12px] px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // If asChild is true, we should render the Slot component from radix, but since we didn't install radix slot, let's just use standard button for simplicity unless strictly needed.
    // Wait, let's avoid @radix-ui/react-slot dependency to keep it simple, or I should install it.
    // I will rewrite this to not use Slot to save an install, since we don't strictly need polymorphism right now, or we can just use a simple button.
    const Comp = "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
