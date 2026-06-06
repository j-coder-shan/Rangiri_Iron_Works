// src/components/ui/Card.tsx
import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'glass' | 'dark' | 'light' | 'outline';
  hoverEffect?: boolean;
}

export default function Card({
  children,
  className,
  variant = 'glass',
  hoverEffect = false,
  ...props
}: CardProps) {
  const baseStyle = 'rounded-lg overflow-hidden transition-all duration-300 border';

  const variants = {
    // Glassmorphic dark card (ideal for hero, public pages)
    glass: 'bg-iron-mid/80 backdrop-blur-md border-iron-light/35 shadow-card hover:border-spark/40',
    // Solid dark card (for forms, main pages)
    dark: 'bg-iron-mid border-iron-light/60 shadow-dark',
    // Light card (ideal for admin dashboard)
    light: 'bg-white border-ash-dark text-iron shadow-card',
    // Minimal outline card
    outline: 'bg-transparent border-steel/30 text-smoke',
  };

  const hoverStyle = hoverEffect 
    ? 'hover:-translate-y-1.5 hover:shadow-spark/10 hover:border-spark/50' 
    : '';

  return (
    <div
      className={clsx(baseStyle, variants[variant], hoverStyle, className)}
      {...props}
    >
      {children}
    </div>
  );
}
