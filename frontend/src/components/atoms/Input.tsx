"use client";

import { InputHTMLAttributes, DetailedHTMLProps } from "react";

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Input = ({ className = "", ...props }: InputProps) => {
  return (
    <input
      {...props}
      className={`px-4 py-2 border border-[var(--color-primary)] text-[var(--color-text)] bg-[var(--color-background)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition duration-200 ease-in-out ${className}`}
    />
  );
};