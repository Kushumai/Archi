import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-transform",
  {
    variants: {
      variant: {
        default: [
          "bg-black",
          "text-white",
          "border",
          "border-black",
          "hover:bg-white",
          "hover:text-black",
          "hover:border-black",
          "active:scale-95",
        ].join(" "),
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-100",
        secondary: "bg-secondary text-black hover:bg-secondary-dark",
        ghost: "bg-transparent hover:bg-neutral-100",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);