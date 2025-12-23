"use client";

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
}

export function Button({ children, className, variant = 'default', ...props }: ButtonProps) {
  const baseClasses = 'px-4 py-2 font-bold transition-colors rounded-none';
  
  const variantClasses = {
    default: '',
    outline: 'border-2 border-black bg-transparent text-black hover:bg-zinc-100',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}