import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const HiggsBosonLogo: React.FC<LogoProps> = ({ 
  size = 40, 
  className = ''
}) => {
  const uniqueId = `logo-${Math.random().toString(36).substr(2, 9)}`;
  
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
        {/* Enhanced gradient with more depth */}
        <linearGradient id={`logoGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#21456f" />
          <stop offset="35%" stopColor="#2563eb" />
          <stop offset="70%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        
        {/* Radial gradient for depth effect */}
        <radialGradient id={`centerGlow-${uniqueId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
        </radialGradient>
        
        {/* Enhanced shadow with multiple layers */}
        <filter id={`shadow-${uniqueId}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="0" dy="2" result="offset1"/>
          <feFlood floodColor="#000000" floodOpacity="0.1"/>
          <feComposite in2="offset1" operator="in"/>
          <feMerge> 
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/> 
          </feMerge>
        </filter>
        
        {/* Glow effect for particles */}
        <filter id={`glow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Orbital ring gradient */}
        <linearGradient id={`ringGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.8)" />
        </linearGradient>
      </defs>
      
      {/* Main circle background with enhanced styling */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill={`url(#logoGradient-${uniqueId})`}
        filter={`url(#shadow-${uniqueId})`}
      />
      
      {/* Subtle inner ring for depth */}
      <circle
        cx="24"
        cy="24"
        r="20"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.5"
      />
      
      {/* Central core - representing the Higgs field */}
      <circle 
        cx="24" 
        cy="24" 
        r="4" 
        fill={`url(#centerGlow-${uniqueId})`}
        filter={`url(#glow-${uniqueId})`}
      />
      
      {/* Inner core */}
      <circle cx="24" cy="24" r="2.5" fill="white" opacity="0.95" />
      
      {/* Enhanced orbital rings with gradient */}
      <circle
        cx="24"
        cy="24"
        r="9"
        fill="none"
        stroke={`url(#ringGradient-${uniqueId})`}
        strokeWidth="1.8"
        opacity="0.8"
        strokeDasharray="2 1"
      />
      <circle
        cx="24"
        cy="24"
        r="15"
        fill="none"
        stroke={`url(#ringGradient-${uniqueId})`}
        strokeWidth="1.2"
        opacity="0.6"
        strokeDasharray="3 2"
      />
      <circle
        cx="24"
        cy="24"
        r="19"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.8"
        strokeDasharray="1 1"
      />
      
      {/* Primary particles with enhanced glow */}
      <circle cx="33" cy="24" r="2" fill="white" opacity="0.95" filter={`url(#glow-${uniqueId})`} />
      <circle cx="15" cy="24" r="2" fill="white" opacity="0.95" filter={`url(#glow-${uniqueId})`} />
      <circle cx="24" cy="33" r="2" fill="white" opacity="0.95" filter={`url(#glow-${uniqueId})`} />
      <circle cx="24" cy="15" r="2" fill="white" opacity="0.95" filter={`url(#glow-${uniqueId})`} />
      
      {/* Secondary particles */}
      <circle cx="30.5" cy="17.5" r="1.2" fill="white" opacity="0.8" />
      <circle cx="17.5" cy="30.5" r="1.2" fill="white" opacity="0.8" />
      <circle cx="30.5" cy="30.5" r="1.2" fill="white" opacity="0.8" />
      <circle cx="17.5" cy="17.5" r="1.2" fill="white" opacity="0.8" />
      
      {/* Micro particles for detail */}
      <circle cx="28" cy="13" r="0.8" fill="white" opacity="0.6" />
      <circle cx="20" cy="35" r="0.8" fill="white" opacity="0.6" />
      <circle cx="35" cy="20" r="0.8" fill="white" opacity="0.6" />
      <circle cx="13" cy="28" r="0.8" fill="white" opacity="0.6" />
      
      {/* Enhanced quantum field waves */}
      <path
        d="M10 24 Q16 19 24 24 Q32 29 38 24"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M10 24 Q16 29 24 24 Q32 19 38 24"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      
      {/* Additional energy field lines */}
      <path
        d="M24 10 Q19 16 24 24 Q29 32 24 38"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M24 10 Q29 16 24 24 Q19 32 24 38"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      
      {/* Subtle H and B letters integrated into the design */}
      <g opacity="0.15">
        <path
          d="M18 18 L18 22 M18 20 L22 20 M22 18 L22 22"
          stroke="white"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M26 18 L26 22 M26 18 Q29 18 29 20 Q29 22 26 22"
          stroke="white"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export default HiggsBosonLogo;
