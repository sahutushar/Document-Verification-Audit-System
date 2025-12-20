import React, { useState } from 'react';
import { Upload, Search, FileText, Lock, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import VerifiedShieldLogo from '../components/VerifiedShieldLogo';
import UploadDocument from '../components/UploadDocument';
import VerifyDocument from '../components/VerifyDocument';
import AuditLogs from '../components/AuditLogs';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');

  const tabs = [
    { 
      id: 'upload', 
      label: 'Upload Document', 
      icon: Upload, 
      component: UploadDocument,
      description: 'Secure document upload with cryptographic hashing'
    },
    { 
      id: 'verify', 
      label: 'Verify Document', 
      icon: Search, 
      component: VerifyDocument,
      description: 'Verify document authenticity and integrity'
    },
    { 
      id: 'audit', 
      label: 'Audit Logs', 
      icon: FileText, 
      component: AuditLogs,
      description: 'Complete audit trail and verification history'
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="dashboard">
      <Header />

      <nav className="elegant-nav">
        <div className="nav-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`elegant-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.description}
            >
              <div className="nav-tab-content">
                <tab.icon className="nav-icon" size={20} />
                <span className="nav-label">{tab.label}</span>
              </div>
              {activeTab === tab.id && <div className="nav-indicator" />}
            </button>
          ))}
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="content-wrapper">
          <div className="content-section" key={activeTab}>
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      </main>

      <footer className="elegant-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <VerifiedShieldLogo size={24} />
            <span>Document Verification & Audit System</span>
          </div>
          <div className="footer-features">
            <div className="feature-item">
              <Lock size={16} />
              <span>Secure</span>
            </div>
            <div className="feature-item">
              <CheckCircle size={16} />
              <span>Reliable</span>
            </div>
            <div className="feature-item">
              <FileText size={16} />
              <span>Auditable</span>
            </div>
          </div>
          <p className="footer-tech">Powered by Microsoft Azure Cloud Services</p>
        </div>
      </footer>

      <style jsx>{`
        .elegant-nav {
          background: var(--bg-glass);
          border-bottom: 1px solid var(--border-primary);
          padding: 1rem 0;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          gap: 2rem;
          justify-content: center;
        }

        .elegant-nav-tab {
          position: relative;
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 16px;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          overflow: hidden;
          border: 1px solid transparent;
        }

        .elegant-nav-tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .elegant-nav-tab:hover::before {
          left: 100%;
        }

        .elegant-nav-tab:hover {
          background: var(--bg-hover);
          color: var(--accent-primary);
          transform: translateY(-4px) scale(1.02);
          box-shadow: var(--shadow-lg), 0 0 20px rgba(99, 102, 241, 0.2);
          border-color: var(--border-hover);
        }

        .elegant-nav-tab.active {
          background: var(--gradient-primary);
          color: var(--text-inverse);
          box-shadow: var(--shadow-glow), var(--shadow-lg);
          transform: translateY(-2px) scale(1.02);
          border-color: rgba(255, 255, 255, 0.2);
          animation: activeGlow 2s ease-in-out infinite alternate;
        }

        @keyframes activeGlow {
          from {
            box-shadow: var(--shadow-glow), var(--shadow-lg);
          }
          to {
            box-shadow: var(--shadow-glow), var(--shadow-lg), 0 0 30px rgba(99, 102, 241, 0.3);
          }
        }

        .nav-tab-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          position: relative;
          z-index: 1;
        }

        .nav-icon {
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .elegant-nav-tab:hover .nav-icon {
          transform: scale(1.15) rotate(8deg);
          filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4));
        }

        .elegant-nav-tab.active .nav-icon {
          transform: scale(1.1);
          animation: iconBounce 1.5s ease-in-out infinite;
        }

        @keyframes iconBounce {
          0%, 100% {
            transform: scale(1.1) translateY(0);
          }
          50% {
            transform: scale(1.15) translateY(-2px);
          }
        }

        .nav-indicator {
          position: absolute;
          bottom: -1rem;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          background: var(--accent-primary);
          border-radius: 50%;
          box-shadow: 0 0 15px var(--accent-primary), 0 0 25px var(--accent-primary);
          animation: indicatorPulse 1.5s ease-in-out infinite;
        }

        @keyframes indicatorPulse {
          0%, 100% {
            transform: translateX(-50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateX(-50%) scale(1.3);
            opacity: 0.7;
          }
        }

        .content-section {
          animation: fadeInUp 0.5s ease-out;
        }

        .elegant-footer {
          background: rgba(255, 255, 255, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding: 2rem 0;
          margin-top: auto;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          text-align: center;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .footer-brand:hover {
          color: rgba(255, 255, 255, 1);
          transform: translateY(-1px);
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        }

        .footer-features {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 1rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.25rem 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 1);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .footer-tech {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          margin: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .content-section {
          animation: fadeInUp 0.5s ease-out;
        }

        .elegant-footer {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-primary);
          padding: 2rem 0;
          margin-top: auto;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          text-align: center;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .footer-brand:hover {
          color: var(--accent-primary);
          transform: translateY(-1px);
        }

        .footer-features {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 1rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.25rem 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          background: var(--bg-hover);
          color: var(--accent-primary);
          transform: translateY(-1px);
        }

        .footer-tech {
          color: var(--text-muted);
          font-size: 0.75rem;
          margin: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1024px) {
          .nav-container {
            gap: 1.5rem;
          }
          
          .elegant-nav-tab {
            padding: 0.875rem 1.25rem;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 768px) {
          .elegant-nav {
            padding: 0.75rem 0;
          }
          
          .nav-container {
            padding: 0 1rem;
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
          }

          .elegant-nav-tab {
            padding: 0.75rem 1rem;
            font-size: 0.75rem;
            min-width: 120px;
            flex: 1;
            max-width: 150px;
          }

          .footer-features {
            gap: 1rem;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .elegant-nav-tab {
            width: 100%;
            max-width: none;
            justify-content: center;
          }
          
          .footer-features {
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;