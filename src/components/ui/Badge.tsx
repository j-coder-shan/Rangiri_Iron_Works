// src/components/ui/Badge.tsx
import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'spark' | 'steel' | 'success' | 'warning' | 'danger' | 'code';
  className?: string;
}

export default function Badge({ children, variant = 'steel', className }: BadgeProps) {
  const baseStyle = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold select-none';
  
  const variants = {
    spark: 'bg-spark/10 text-spark border border-spark/20',
    steel: 'bg-iron-light text-steel-light border border-iron-light/60',
    success: 'bg-green-500/10 text-green-400 border border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
    code: 'bg-spark/10 text-spark-light border border-spark/30 font-mono tracking-wider px-2.5 py-1 text-xs',
  };

  return (
    <span className={clsx(baseStyle, variants[variant], className)}>
      {children}
    </span>
  );
}
