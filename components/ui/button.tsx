"use client";

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "px-4 py-2 font-bold transition-colors rounded-none",
  {
    variants: {
      variant: {
        default: "",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border-2 border-black bg-transparent text-black hover:bg-zinc-100",
        secondary: "bg-zinc-200 text-black hover:bg-zinc-300",
        ghost: "hover:bg-zinc-100",
        link: "text-black underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export function Button({ children, className, variant, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, className })}
      {...props}
    >
      {children}
    </button>
  );
}
