import React, { forwardRef } from 'react';
import { InputProps } from './types';

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={`border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring ${className}`}
    {...props}
  />
));

Input.displayName = 'Input';

export default Input;