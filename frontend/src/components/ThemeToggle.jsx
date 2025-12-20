import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="elegant-theme-toggle"
      aria-label="Toggle theme"
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="toggle-icon-wrapper">
        {isDarkMode ? (
          <Moon className="toggle-icon" size={18} />
        ) : (
          <Sun className="toggle-icon" size={18} />
        )}
      </div>
      
      <style jsx>{`
        .elegant-theme-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border: 1px solid var(--border-primary);
          border-radius: 12px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .elegant-theme-toggle:hover {
          background: var(--bg-hover);
          transform: translateY(-2px) scale(1.05);
          box-shadow: var(--shadow-hover);
          border-color: var(--border-hover);
        }

        .elegant-theme-toggle:active {
          transform: translateY(0);
        }

        .toggle-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .elegant-theme-toggle:hover .toggle-icon-wrapper {
          transform: rotate(15deg) scale(1.1);
        }

        .toggle-icon {
          color: var(--accent-primary);
          transition: all 0.3s ease;
        }

        .elegant-theme-toggle:hover .toggle-icon {
          filter: drop-shadow(0 0 8px var(--accent-primary));
        }

        .elegant-theme-toggle::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), transparent);
          transition: left 0.6s ease;
        }

        .elegant-theme-toggle:hover::before {
          left: 100%;
        }

        .elegant-theme-toggle::after {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 13px;
          background: var(--gradient-primary);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .elegant-theme-toggle:hover::after {
          opacity: 0.1;
        }

        @media (max-width: 768px) {
          .elegant-theme-toggle {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </button>
  );
};

export default ThemeToggle;