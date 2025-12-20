import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import VerifiedShieldLogo from './VerifiedShieldLogo';
import Button from './Button';

const Header = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="secure-header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo-section">
            <VerifiedShieldLogo size={48} />
            <div className="logo-text">
              <h1 className="main-heading">Secure Document Verification</h1>
              <p className="subtitle">Advanced Cryptographic Authentication System</p>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <User size={16} />
            <span>{user?.email}</span>
          </div>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            icon={LogOut}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>

      <style jsx>{`
        .secure-header {
          background: var(--bg-glass);
          border-bottom: 1px solid var(--border-primary);
          padding: 1.5rem 0;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: var(--shadow-sm);
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          color: var(--accent-primary);
          filter: drop-shadow(0 0 12px rgba(99, 102, 241, 0.4));
          transition: all 0.3s ease;
        }

        .logo-section:hover .logo-icon {
          transform: scale(1.05) rotate(5deg);
          filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.6));
        }

        .main-heading {
          font-size: 2rem;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fadeInSlide 0.8s ease-out;
          letter-spacing: -0.03em;
          position: relative;
          text-shadow: 0 0 30px rgba(99, 102, 241, 0.2);
        }

        .main-heading::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%);
          transition: width 0.6s ease;
        }

        .logo-section:hover .main-heading::after {
          width: 100%;
        }

        .subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
          font-weight: 600;
          opacity: 0.9;
          animation: fadeInSlide 0.8s ease-out 0.2s both;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.75rem 1.25rem;
          background: var(--bg-glass);
          border-radius: 16px;
          border: 1px solid var(--border-primary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .user-info::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .user-info:hover::before {
          left: 100%;
        }

        .user-info:hover {
          background: var(--bg-hover);
          color: var(--accent-primary);
          border-color: var(--border-hover);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15), 0 0 20px rgba(99, 102, 241, 0.2);
        }

        .user-info svg {
          transition: all 0.3s ease;
        }

        .user-info:hover svg {
          transform: scale(1.1) rotate(5deg);
          filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4));
        }

        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1024px) {
          .header-container {
            padding: 0 1rem;
          }
          
          .main-heading {
            font-size: 1.6rem;
          }
          
          .header-right {
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .secure-header {
            padding: 1rem 0;
          }
          
          .header-container {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }

          .main-heading {
            font-size: 1.4rem;
          }
          
          .subtitle {
            font-size: 0.8rem;
          }

          .header-right {
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
          }
          
          .user-info {
            padding: 0.6rem 1rem;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .header-container {
            padding: 0 0.75rem;
          }
          
          .main-heading {
            font-size: 1.2rem;
          }
          
          .subtitle {
            font-size: 0.75rem;
          }
          
          .logo-section {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .logo-icon {
            padding: 0.4rem;
          }
          
          .header-right {
            flex-direction: column;
            width: 100%;
            gap: 0.75rem;
          }
          
          .user-info {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;