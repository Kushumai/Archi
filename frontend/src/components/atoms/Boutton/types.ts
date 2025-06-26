import { ButtonHTMLAttributes, ElementType } from "react";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./variants";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  component?: ElementType;
}