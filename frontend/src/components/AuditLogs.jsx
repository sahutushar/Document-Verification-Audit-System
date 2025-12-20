import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Shield, Search, Filter, Loader2 } from 'lucide-react';
import { getAuditLogs } from '../services/api';
import StatusBadge from './StatusBadge';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await getAuditLogs();
      setLogs(response || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.action?.toLowerCase() === filter;
  });

  const getStatusBadge = (log) => {
    const status = log.result || log.status;
    switch (status?.toLowerCase()) {
      case 'success':
      case 'verified':
        return <StatusBadge status="verified" text={status.toUpperCase()} />;
      case 'tampered':
      case 'error':
      case 'not_found':
      case 'duplicate':
        return <StatusBadge status="error" text={status.toUpperCase()} />;
      default:
        return <StatusBadge status="default" text={status?.toUpperCase() || 'PENDING'} />;
    }
  };

  const getActionIcon = (action) => {
    switch (action?.toLowerCase()) {
      case 'upload':
        return <FileText size={20} />;
      case 'verify':
        return <Search size={20} />;
      default:
        return <Shield size={20} />;
    }
  };

  if (loading) {
    return (
      <motion.div
        className="document-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
          <Loader2 className="animate-spin" size={32} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Loading audit logs...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="document-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="document-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="header-icon">
          <FileText size={32} />
        </div>
        <h2>Audit Logs</h2>
        <p className="header-description">
          Complete history of all document operations and <span className="highlight">security</span> events
        </p>
      </motion.div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Filter size={20} style={{ color: 'var(--text-secondary)' }} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              color: 'var(--text-primary)',
              fontSize: '0.875rem'
            }}
          >
            <option value="all">All Actions</option>
            <option value="upload">Uploads</option>
            <option value="verify">Verifications</option>
          </select>
        </div>
        <button
          onClick={fetchAuditLogs}
          className="btn btn-secondary btn-sm"
        >
          <Shield size={16} />
          <span>Refresh</span>
        </button>
      </div>

      <div>
        {error ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <Shield size={48} style={{ color: 'var(--error)', marginBottom: '1rem' }} />
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Error Loading Logs</h3>
            <p>{error}</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Audit Logs</h3>
            <p>No operations have been recorded yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id || index}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ transform: 'translateY(-2px)', boxShadow: 'var(--shadow-md)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', background: 'var(--bg-accent)', borderRadius: '8px', color: 'var(--accent-primary)' }}>
                      {getActionIcon(log.action)}
                    </div>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                      {log.action?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  <div>
                    {getStatusBadge(log)}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {(log.documentName || log.fileName) && (
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Document</label>
                      <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.875rem' }}>{log.documentName || log.fileName}</p>
                    </div>
                  )}
                  
                  {log.documentId && (
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Document ID</label>
                      <code style={{ 
                        fontFamily: 'monospace', 
                        background: 'var(--bg-tertiary)', 
                        padding: '0.5rem', 
                        borderRadius: '6px', 
                        fontSize: '0.75rem', 
                        color: 'var(--accent-primary)',
                        display: 'block',
                        wordBreak: 'break-all'
                      }}>{log.documentId}</code>
                    </div>
                  )}
                  
                  {log.hash && (
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Hash</label>
                      <code style={{ 
                        fontFamily: 'monospace', 
                        background: 'var(--bg-tertiary)', 
                        padding: '0.5rem', 
                        borderRadius: '6px', 
                        fontSize: '0.75rem', 
                        color: 'var(--accent-primary)',
                        display: 'block',
                        wordBreak: 'break-all'
                      }}>
                        {log.hash.substring(0, 32)}...
                      </code>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Timestamp</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  {log.details && Object.keys(log.details).length > 0 && (
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>Details</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {Object.entries(log.details).map(([key, value]) => (
                          <span key={key} style={{
                            background: 'var(--bg-accent)',
                            color: 'var(--text-primary)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AuditLogs;