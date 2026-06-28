import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white border border-transparent hover:bg-blue-700",
        secondary: "text-blue-600 hover:text-blue-800 font-semibold",
        outline: "border border-gray-200 text-gray-800 hover:bg-gray-100",
        ghost: "text-gray-800 hover:bg-gray-100",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
      },
      size: {
        default: "py-2.5 px-4",
        sm: "py-2 px-3 text-xs",
        lg: "py-3 px-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
