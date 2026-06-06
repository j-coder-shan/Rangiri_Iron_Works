// src/components/ui/Button.tsx
import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'spark' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function Button({
  children,
  className,
  variant = 'spark',
  size = 'md',
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-md select-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    spark: 'bg-spark hover:bg-spark-light text-white shadow-lg shadow-spark/20 hover:shadow-spark/30 active:scale-[0.98]',
    outline: 'border border-steel hover:border-spark bg-transparent text-smoke hover:text-spark active:scale-[0.98]',
    ghost: 'hover:bg-iron-light text-smoke hover:text-white',
    danger: 'bg-danger hover:bg-red-500 text-white shadow-lg active:scale-[0.98]',
    success: 'bg-success hover:bg-green-500 text-white shadow-lg active:scale-[0.98]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-8 py-3.5',
  };

  return (
    <button
      disabled={disabled || loading}
      className={clsx(baseStyle, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
