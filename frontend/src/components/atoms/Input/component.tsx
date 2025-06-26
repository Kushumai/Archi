import React, { forwardRef } from 'react';
import { cn } from "@/lib/utils"
import { InputProps } from './types';

const Input = forwardRef<HTMLInputElement, InputProps>(({ className,type, ...props }, ref) => (
  <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
  />
));

Input.displayName = 'Input';

export default Input;