import React from 'react';
import { useTheme } from '../context/ThemeContext';

const BubbleBackground = () => {
  const { isDarkMode } = useTheme();

  // Generate bubble positions and sizes
  const bubbles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 80 + 30,
    left: Math.random() * 100,
    animationDelay: Math.random() * 25,
    animationDuration: Math.random() * 15 + 20,
    opacity: Math.random() * 0.4 + 0.2,
  }));

  return (
    <div className="bubble-background">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            animationDelay: `${bubble.animationDelay}s`,
            animationDuration: `${bubble.animationDuration}s`,
            background: isDarkMode 
              ? `radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(236, 72, 153, 0.05) 100%)`
              : `radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(236, 72, 153, 0.03) 100%)`,
            opacity: bubble.opacity,
          }}
        />
      ))}
      
      <style jsx>{`
        .bubble-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
          pointer-events: none;
        }

        .bubble {
          position: absolute;
          bottom: -100px;
          border-radius: 50%;
          animation: float-up linear infinite;
          backdrop-filter: blur(3px);
          border: 1px solid rgba(99, 102, 241, 0.1);
          box-shadow: 
            0 0 20px rgba(99, 102, 241, 0.1),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
        }

        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          5% {
            opacity: 1;
            transform: translateY(-5vh) rotate(18deg) scale(1);
          }
          25% {
            transform: translateY(-25vh) rotate(90deg) scale(1.1);
          }
          50% {
            transform: translateY(-50vh) rotate(180deg) scale(0.9);
          }
          75% {
            transform: translateY(-75vh) rotate(270deg) scale(1.05);
          }
          95% {
            opacity: 1;
            transform: translateY(-95vh) rotate(342deg) scale(0.8);
          }
          100% {
            transform: translateY(-100vh) rotate(360deg) scale(0.6);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .bubble {
            opacity: 0.4;
            backdrop-filter: blur(2px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bubble {
            animation: none;
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default BubbleBackground;