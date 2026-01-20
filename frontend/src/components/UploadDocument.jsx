import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { uploadDocument } from '../services/api';
import Button from './Button';
import StatusBadge from './StatusBadge';

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      } else {
        setError('Please select a valid file (PDF, JPG, PNG, DOC, DOCX)');
        setFile(null);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('📎 Starting upload process...');
      console.log('📎 API URL:', process.env.REACT_APP_API_URL);
      
      const formData = new FormData();
      formData.append('document', file);
      
      console.log('📎 FormData created, calling uploadDocument...');
      const response = await uploadDocument(formData);
      console.log('✅ Upload successful:', response);
      setResult(response);
    } catch (err) {
      console.error('❌ Upload error details:', {
        message: err.message,
        code: err.code,
        status: err.response?.status,
        statusText: err.response?.statusText,
        stack: err.stack
      });
      
      let errorMessage = 'Upload failed';
      
      if (err.message === 'Network Error' || err.message.includes('fetch')) {
        errorMessage = 'Network error - Check if backend is running and CORS is configured';
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to backend server';
      } else if (err.response?.status === 413) {
        errorMessage = 'File too large (max 10MB)';
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.error || 'Invalid file or request';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error - Please try again later';
      } else {
        errorMessage = err.response?.data?.error || err.message || 'Upload failed';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-container">
      <div className="document-header">
        <div className="header-icon">
          <Upload size={32} />
        </div>
        <h2>Upload Document</h2>
        <p className="header-description">
          Upload your document to generate a cryptographic hash for <span className="highlight">secure</span> integrity verification
        </p>
      </div>

      <form className="document-form" onSubmit={handleUpload}>
        <div
          className={`file-drop-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={(e) => handleFileChange(e.target.files[0])}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="file-input"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="file-label">
            <div className="upload-icon">
              <FileText size={48} />
            </div>
            <h3>Drop your file here or click to browse</h3>
            <p>Supported formats: PDF, DOC, DOCX, JPG, PNG (Max: 10MB)</p>
            <div className="supported-formats">
              <span className="format-badge">PDF</span>
              <span className="format-badge">DOC</span>
              <span className="format-badge">DOCX</span>
              <span className="format-badge">JPG</span>
              <span className="format-badge">PNG</span>
            </div>
          </label>
        </div>

        {file && (
          <div className="file-info">
            <div className="file-details">
              <FileText className="file-icon" size={20} />
              <div className="file-meta">
                <p className="file-name">{file.name}</p>
                <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <StatusBadge status="secure" text="Ready to Upload" />
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={!file}
          icon={loading ? undefined : Upload}
          className="upload-btn"
        >
          {loading ? 'Generating Hash...' : 'Upload & Generate Hash'}
        </Button>
      </form>

      {error && (
        <div className="result-container error" style={{ marginTop: '2rem' }}>
          <AlertCircle className="result-icon" size={24} />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result-container success" style={{ marginTop: '2rem' }}>
          <div className="result-header">
            <div>
              <CheckCircle className="result-icon" size={32} />
            </div>
            <div>
              <h3>Upload Successful!</h3>
              <div>
                <StatusBadge status="verified" text="Secure" />
              </div>
            </div>
            <div>
              <Sparkles size={20} className="text-yellow-500" />
            </div>
          </div>
          
          <div className="result-details">
            <div className="detail-item">
              <label>Document ID:</label>
              <code>{result.documentId}</code>
            </div>
            <div className="detail-item">
              <label>SHA-256 Hash:</label>
              <code className="hash-value">{result.hash}</code>
            </div>
            <div className="detail-item">
              <label>Upload Time:</label>
              <span>{new Date(result.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .file-drop-zone {
          border: 2px dashed var(--border-primary);
          border-radius: 16px;
          padding: 3rem 2rem;
          text-align: center;
          transition: all 0.3s ease;
          background: var(--bg-secondary);
          position: relative;
          overflow: hidden;
        }

        .file-drop-zone:hover,
        .file-drop-zone.drag-active {
          border-color: var(--accent-primary);
          background: var(--bg-accent);
          transform: translateY(-2px);
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .file-label {
          cursor: pointer;
          display: block;
        }

        .upload-icon {
          color: var(--accent-primary);
          margin-bottom: 1rem;
          transition: transform 0.3s ease;
        }

        .file-drop-zone:hover .upload-icon {
          transform: scale(1.1);
        }

        .file-drop-zone h3 {
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
        }

        .file-drop-zone p {
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .supported-formats {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .format-badge {
          background: var(--bg-accent);
          color: var(--accent-primary);
          padding: 0.25rem 0.75rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .file-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--bg-secondary);
          border-radius: 12px;
          border: 1px solid var(--border-primary);
        }

        .file-details {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .file-icon {
          color: var(--accent-primary);
        }

        .file-name {
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .file-size {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .result-container {
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid var(--border-primary);
        }

        .result-container.success {
          background: rgba(16, 185, 129, 0.05);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .result-container.error {
          background: rgba(239, 68, 68, 0.05);
          border-color: rgba(239, 68, 68, 0.2);
        }

        .result-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .result-icon {
          color: var(--success);
        }

        .result-container.error .result-icon {
          color: var(--error);
        }

        .result-header h3 {
          margin: 0 0 0.5rem 0;
          color: var(--text-primary);
        }

        .result-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: var(--bg-tertiary);
          border-radius: 8px;
        }

        .detail-item label {
          font-weight: 600;
          color: var(--text-primary);
        }

        .detail-item code {
          background: var(--bg-primary);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          color: var(--accent-primary);
          word-break: break-all;
        }

        @media (max-width: 768px) {
          .file-drop-zone {
            padding: 2rem 1rem;
          }

          .result-header {
            flex-direction: column;
            text-align: center;
          }

          .detail-item {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default UploadDocument;