import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[8px] whitespace-nowrap rounded-[12px] text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--button-bg)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:h-[16px] [&_svg]:w-[16px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-[var(--button-bg)] text-[var(--button-color)] hover:opacity-95",
        destructive:
          "border border-transparent bg-[var(--danger-color)] text-white hover:opacity-95",
        outline:
          "border border-[var(--primary-border-color)] bg-[var(--primary-bg)] text-[var(--primary-color)] hover:bg-[var(--primary-table-hover-bg)]",
        secondary:
          "border border-transparent bg-[var(--filter-input-bg)] text-[var(--primary-color)] hover:opacity-95",
        ghost: "border border-transparent bg-transparent text-[var(--secondary-color)] hover:bg-[var(--primary-table-hover-bg)] hover:text-[var(--primary-color)]",
        link: "text-[var(--button-bg)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[40px] px-[16px]",
        sm: "h-[34px] rounded-[10px] px-[12px] text-[13px]",
        lg: "h-[44px] rounded-[14px] px-[20px] text-[15px]",
        icon: "h-[36px] w-[36px] rounded-[10px] p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
