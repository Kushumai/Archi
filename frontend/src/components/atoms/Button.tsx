"use client";

import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button = ({ children, className = "", ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 bg-[var(--color-primary)] text-white rounded-md shadow-sm hover:opacity-90 transition duration-200 ease-in-out ${className}`}
    >
      {children}
    </button>
  );
};