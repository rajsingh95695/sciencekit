import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,var(--primary),color-mix(in_srgb,var(--primary)_74%,var(--color-ocean)_26%))] px-5 py-2.5 text-[var(--primary-foreground)] shadow-[0_18px_30px_rgba(10,107,117,0.22)] hover:-translate-y-0.5 hover:shadow-[0_24px_42px_rgba(10,107,117,0.28)]",
        secondary:
          "bg-[linear-gradient(135deg,var(--secondary),#ffffff)] px-5 py-2.5 text-[var(--secondary-foreground)] shadow-[0_12px_26px_rgba(7,18,37,0.08)] hover:-translate-y-0.5 hover:bg-white",
        ghost: "px-4 py-2 text-[var(--foreground)] hover:bg-white/70",
        outline:
          "border border-[var(--border)] bg-white/60 px-5 py-2.5 text-[var(--foreground)] shadow-[0_10px_24px_rgba(7,18,37,0.05)] hover:-translate-y-0.5 hover:bg-white",
        destructive:
          "bg-[var(--destructive)] px-5 py-2.5 text-[var(--destructive-foreground)] hover:opacity-90"
      },
      size: {
        default: "h-11",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6",
        icon: "h-11 w-11 rounded-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
