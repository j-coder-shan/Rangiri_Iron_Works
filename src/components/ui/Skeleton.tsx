// src/components/ui/Skeleton.tsx
import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-iron-light/60 rounded-md',
        className
      )}
    />
  );
}
