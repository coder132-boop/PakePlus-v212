interface ChoreCoreLogoProps {
  size?: number;
  className?: string;
}

export function ChoreCoreLogo({ size = 48, className = '' }: ChoreCoreLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hexagon background with gradient */}
      <defs>
        <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C2A8" />
          <stop offset="50%" stopColor="#00FFD1" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="cGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0F7F4" />
        </linearGradient>
        {/* Glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Hexagon shape */}
      <path
        d="M50 5 L86.6 27.5 L86.6 72.5 L50 95 L13.4 72.5 L13.4 27.5 Z"
        fill="url(#coreGradient)"
        filter="url(#glow)"
        opacity="0.95"
      />
      
      {/* Inner hexagon border for depth */}
      <path
        d="M50 5 L86.6 27.5 L86.6 72.5 L50 95 L13.4 72.5 L13.4 27.5 Z"
        stroke="#FFFFFF"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      
      {/* Stylized "C" */}
      <path
        d="M 65 30 C 55 25, 40 25, 32 35 C 24 45, 24 55, 32 65 C 40 75, 55 75, 65 70"
        stroke="url(#cGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        filter="url(#glow)"
      />
      
      {/* Core dot in center */}
      <circle
        cx="50"
        cy="50"
        r="6"
        fill="#FFD43B"
        filter="url(#glow)"
      />
      
      {/* Sparkle accents */}
      <circle cx="70" cy="35" r="2" fill="#FFD43B" opacity="0.8" />
      <circle cx="75" cy="50" r="1.5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="68" cy="65" r="2" fill="#FFD43B" opacity="0.7" />
    </svg>
  );
}
