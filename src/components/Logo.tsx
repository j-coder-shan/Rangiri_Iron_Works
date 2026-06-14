// src/components/Logo.tsx
import React from 'react';

interface LogoProps {
  height?: number; // Target height in pixels
  variant?: 'light' | 'dark'; // light: for dark bg (white text), dark: for light bg (charcoal text)
  showTagline?: boolean;
}

export default function Logo({ height = 40, variant = 'light', showTagline = false }: LogoProps) {
  // Sizing factors based on a base scale
  const scale = height / 40;

  // Text color based on theme
  const textColor = variant === 'light' ? '#FAFAF9' : '#1A1A1A';
  const subTextColor = variant === 'light' ? '#9CA3AF' : '#6B7280';
  const sparkColor = '#E8500A'; // Deep Orange accent

  return (
    <div className="flex items-center gap-3 select-none" style={{ height }}>
      {/* Icon Mark: Anvil and Welder Spark */}
      <svg
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        style={{ width: height }}
      >
        {/* Anvil Base Silhouette */}
        <path
          d="M15 75C15 75 25 75 30 70C35 65 35 55 38 50H62C65 55 65 65 70 70C75 75 85 75 85 75V82H15V75Z"
          fill={variant === 'light' ? '#E86B2F' : '#2D2D2D'}
          className={variant === 'light' ? 'fill-spark/90' : 'fill-iron-mid'}
        />
        {/* Anvil Horn and Body */}
        <path
          d="M10 32C25 32 30 40 40 40H75C88 40 92 32 92 32V46C92 46 80 50 75 50H25C20 50 10 46 10 46V32Z"
          fill={textColor}
        />
        {/* Spark/Weld Laser line */}
        <path
          d="M50 15L45 35L55 35L50 55"
          stroke={sparkColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-pulse"
        />
        {/* Additional Weld Spark Particles */}
        <circle cx="38" cy="22" r="3" fill={sparkColor} />
        <circle cx="62" cy="28" r="2.5" fill={sparkColor} />
        <circle cx="58" cy="18" r="1.5" fill={sparkColor} />
      </svg>

      {/* Brand Text Column */}
      <div className="flex flex-col justify-center">
        {/* English Brand Name */}
        <span
          className="font-display font-bold leading-none tracking-wider uppercase"
          style={{
            fontSize: `${18 * scale}px`,
            color: textColor,
          }}
        >
          Rangiri
        </span>
        {/* Sinhala Brand Sub-name */}
        <span
          className="font-sinhala font-medium leading-none"
          style={{
            fontSize: `${11 * scale}px`,
            color: subTextColor,
            marginTop: `${2 * scale}px`,
          }}
        >
          රංගිරි යකඩ වැඩ
        </span>

        {showTagline && (
          <span
            className="font-body italic hidden sm:inline"
            style={{
              fontSize: `${8 * scale}px`,
              color: sparkColor,
              marginTop: `${3 * scale}px`,
            }}
          >
            Crafted in Steel. Built to Last.
          </span>
        )}
      </div>
    </div>
  );
}
