import React from 'react';
import { CheckCircle, XCircle, Shield, AlertTriangle, Info } from 'lucide-react';

const StatusBadge = ({ status, text, className = '' }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'success':
      case 'verified':
        return {
          className: 'status-badge-success',
          icon: CheckCircle,
          text: text || 'Verified'
        };
      case 'error':
      case 'tampered':
        return {
          className: 'status-badge-error',
          icon: XCircle,
          text: text || 'Error'
        };
      case 'secure':
        return {
          className: 'status-badge-secure',
          icon: Shield,
          text: text || 'Secure'
        };
      case 'warning':
        return {
          className: 'status-badge-warning',
          icon: AlertTriangle,
          text: text || 'Warning'
        };
      default:
        return {
          className: 'status-badge-default',
          icon: Info,
          text: text || 'Info'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`status-badge ${status} ${className}`}>
      <div className="status-badge-icon">
        <Icon size={14} />
      </div>
      <span>{config.text}</span>
      
      <style jsx>{`
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .status-badge.success,
        .status-badge.verified {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-badge.error,
        .status-badge.tampered {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .status-badge.secure {
          background: rgba(99, 102, 241, 0.1);
          color: var(--accent-primary);
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .status-badge.warning {
          background: rgba(245, 158, 11, 0.1);
          color: var(--warning);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .status-badge-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </span>
  );
};

export default StatusBadge;