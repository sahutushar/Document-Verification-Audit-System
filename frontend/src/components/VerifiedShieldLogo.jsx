import React from 'react';
import { useTheme } from '../context/ThemeContext';

const VerifiedShieldLogo = ({ size = 40, className = "" }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`verified-shield-logo ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shield Background */}
        <path
          d="M50 8L20 20V45C20 65 35 82 50 92C65 82 80 65 80 45V20L50 8Z"
          fill="url(#shieldGradient)"
          stroke="url(#borderGradient)"
          strokeWidth="2"
        />
        
        {/* Inner Shield Glow */}
        <path
          d="M50 12L25 22V43C25 60 37 75 50 84C63 75 75 60 75 43V22L50 12Z"
          fill="url(#innerGlow)"
          opacity="0.3"
        />
        
        {/* Checkmark */}
        <path
          d="M35 45L45 55L65 35"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Security Badge */}
        <circle
          cx="70"
          cy="30"
          r="8"
          fill="url(#badgeGradient)"
          stroke="white"
          strokeWidth="1.5"
        />
        
        {/* Lock Icon in Badge */}
        <path
          d="M67 27V25C67 23.9 67.9 23 69 23H71C72.1 23 73 23.9 73 25V27M66 29H74V35H66V29Z"
          fill="white"
          strokeWidth="0.5"
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          
          <radialGradient id="innerGlow" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          
          <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          
          {/* Glow Filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
      
      <style jsx>{`
        .verified-shield-logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 4px 12px rgba(99, 102, 241, 0.3));
          transition: all 0.3s ease;
        }

        .verified-shield-logo:hover {
          transform: scale(1.05) rotate(2deg);
          filter: drop-shadow(0 8px 20px rgba(99, 102, 241, 0.4));
        }

        .verified-shield-logo svg {
          filter: url(#glow);
        }

        @media (max-width: 768px) {
          .verified-shield-logo {
            filter: drop-shadow(0 2px 8px rgba(99, 102, 241, 0.2));
          }
        }
      `}</style>
    </div>
  );
};

export default VerifiedShieldLogo;