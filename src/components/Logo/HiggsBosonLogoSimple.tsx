import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const HiggsBosonLogoSimple: React.FC<LogoProps> = ({ 
  size = 24, 
  className = ''
}) => {
  const uniqueId = `simple-logo-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`simpleGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#21456f" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      
      {/* Main circle background */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={`url(#simpleGradient-${uniqueId})`}
      />
      
      {/* Central core */}
      <circle cx="24" cy="24" r="3" fill="white" />
      
      {/* Simple orbital ring */}
      <circle
        cx="24"
        cy="24"
        r="12"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        opacity="0.7"
      />
      
      {/* Four primary particles */}
      <circle cx="36" cy="24" r="1.5" fill="white" />
      <circle cx="12" cy="24" r="1.5" fill="white" />
      <circle cx="24" cy="36" r="1.5" fill="white" />
      <circle cx="24" cy="12" r="1.5" fill="white" />
      
      {/* Subtle H and B */}
      <g opacity="0.2">
        <path
          d="M19 19 L19 23 M19 21 L23 21 M23 19 L23 23"
          stroke="white"
          strokeWidth="0.8"
          fill="none"
        />
        <path
          d="M25 19 L25 23 M25 19 Q27.5 19 27.5 21 Q27.5 23 25 23"
          stroke="white"
          strokeWidth="0.8"
          fill="none"
        />
      </g>
    </svg>
  );
};

export default HiggsBosonLogoSimple;
