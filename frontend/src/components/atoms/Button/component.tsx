"use client";

import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./variants";
import { ButtonProps } from "./types";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, component,onClick, ...props }, ref) => {
    const Tag = asChild ? Slot : component ?? "button";
    return (
      <Tag
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          e.currentTarget.blur();
          onClick?.(e);
        }}
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";