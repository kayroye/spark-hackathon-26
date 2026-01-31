'use client';

import { cn } from '@/lib/utils';

interface MountainRidgeProps {
  className?: string;
  color?: string;
}

/**
 * Mountain Ridge SVG component - subtle nature motif
 * Used for login page background and empty states
 */
export function MountainRidge({ className, color = '#e2e8f0' }: MountainRidgeProps) {
  return (
    <svg
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      className={cn('w-full', className)}
      aria-hidden="true"
    >
      {/* Back ridge - lighter/further away */}
      <path
        fill={color}
        fillOpacity="0.5"
        d="M0,224 L48,213.3 C96,203,192,181,288,176 C384,171,480,181,576,197.3 C672,213,768,235,864,229.3 C960,224,1056,192,1152,181.3 C1248,171,1344,181,1392,186.7 L1440,192 L1440,320 L1392,320 C1344,320,1248,320,1152,320 C1056,320,960,320,864,320 C768,320,672,320,576,320 C480,320,384,320,288,320 C192,320,96,320,48,320 L0,320 Z"
      />
      {/* Middle ridge */}
      <path
        fill={color}
        fillOpacity="0.7"
        d="M0,256 L48,250.7 C96,245,192,235,288,218.7 C384,203,480,181,576,186.7 C672,192,768,224,864,234.7 C960,245,1056,235,1152,224 C1248,213,1344,203,1392,197.3 L1440,192 L1440,320 L1392,320 C1344,320,1248,320,1152,320 C1056,320,960,320,864,320 C768,320,672,320,576,320 C480,320,384,320,288,320 C192,320,96,320,48,320 L0,320 Z"
      />
      {/* Front ridge - darkest/closest */}
      <path
        fill={color}
        fillOpacity="1"
        d="M0,288 L48,277.3 C96,267,192,245,288,240 C384,235,480,245,576,256 C672,267,768,277,864,272 C960,267,1056,245,1152,240 C1248,235,1344,245,1392,250.7 L1440,256 L1440,320 L1392,320 C1344,320,1248,320,1152,320 C1056,320,960,320,864,320 C768,320,672,320,576,320 C480,320,384,320,288,320 C192,320,96,320,48,320 L0,320 Z"
      />
    </svg>
  );
}

export default MountainRidge;
