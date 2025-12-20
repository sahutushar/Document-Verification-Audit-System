# 🔐 Document Verification & Audit System

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Azure](https://img.shields.io/badge/Azure-Cloud-blue.svg)](https://azure.microsoft.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-yellow.svg)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-green.svg)](https://supabase.com/)

A secure, enterprise-grade document verification system built with **React.js**, **Node.js**, and **Microsoft Azure** that uses SHA-256 cryptographic hashing to ensure document integrity and maintain complete audit trails for tamper detection.

## 🎯 Project Overview

This system provides a comprehensive solution for document integrity verification using blockchain-inspired cryptographic techniques. Organizations can upload documents, generate unique digital fingerprints, and later verify if documents have been tampered with or remain authentic.

## ✨ Key Features

- 🔒 **Secure Document Upload** - Azure Blob Storage with enterprise security
- 🔍 **Document Verification** - SHA-256 hash comparison for tamper detection
- 📊 **Complete Audit Trail** - Immutable operation history with timestamps
- 🎨 **Modern UI/UX** - Responsive React interface with dark/light themes
- ☁️ **Cloud-Native Architecture** - Built for Azure scalability
- 🔐 **User Authentication** - Secure Supabase integration
- 🐳 **Containerized Deployment** - Docker & Docker Compose support
- 📱 **Mobile Responsive** - Works on all devices
- 🛡️ **Enterprise Security** - Rate limiting, CORS, input validation
- 📈 **Real-time Monitoring** - Health checks and performance metrics

## 🏗️ System Architecture

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│     Frontend        │    │      Backend        │    │   Azure Services    │
│    (React.js)       │◄──►│    (Node.js)        │◄──►│                     │
│                     │    │                     │    │                     │
│ • Upload Interface  │    │ • SHA-256 Hashing  │    │ • Blob Storage      │
│ • Verify Interface  │    │ • File Processing   │    │ • Cosmos DB         │
│ • Audit Dashboard   │    │ • API Routes        │    │ • Security Features │
│ • Authentication    │    │ • Middleware        │    │ • Monitoring        │
│ • Theme System      │    │ • Error Handling    │    │ • Backup & Recovery │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

## 🛠️ Technology Stack

### Frontend Technologies
- **React.js 18.2.0** - Modern UI framework
- **React Router DOM 7.11.0** - Client-side routing
- **Framer Motion 11.11.17** - Smooth animations
- **Lucide React 0.561.0** - Beautiful icons
- **Styled JSX 5.1.7** - Component styling
- **Axios 1.6.0** - HTTP client
- **Supabase JS 2.89.0** - Authentication

### Backend Technologies
- **Node.js** - JavaScript runtime
- **Express.js 4.18.2** - Web framework
- **Multer 1.4.5** - File upload handling
- **UUID 9.0.1** - Unique identifier generation
- **CORS 2.8.5** - Cross-origin resource sharing
- **Crypto (Built-in)** - SHA-256 hash generation

### Azure Cloud Services
- **Azure Blob Storage 12.17.0** - Secure document storage
- **Azure Cosmos DB 4.0.0** - NoSQL database for metadata
- **Azure App Service** - Application hosting
- **Azure Monitor** - Performance monitoring

### DevOps & Deployment
- **Docker & Docker Compose** - Containerization
- **NGINX** - Reverse proxy and load balancing
- **GitHub Actions** - CI/CD pipeline
- **Azure CLI** - Cloud deployment

## 📁 Detailed Project Structure

```
document-verification-system/
├── 📁 frontend/                    # React.js Application
│   ├── 📁 public/
│   │   └── index.html             # Main HTML template
│   ├── 📁 src/
│   │   ├── 📁 components/         # Reusable React components
│   │   │   ├── AuditLogs.jsx      # Audit trail display
│   │   │   ├── BubbleBackground.jsx # Animated background
│   │   │   ├── Button.jsx         # Custom button component
│   │   │   ├── Header.jsx         # Application header
│   │   │   ├── ProtectedRoute.jsx # Route protection
│   │   │   ├── StatusBadge.jsx    # Status indicators
│   │   │   ├── ThemeToggle.jsx    # Dark/light mode toggle
│   │   │   ├── UploadDocument.jsx # Document upload interface
│   │   │   ├── VerifyDocument.jsx # Document verification
│   │   │   └── VerifiedShieldLogo.jsx # Brand logo
│   │   ├── 📁 context/            # React Context providers
│   │   │   ├── AuthContext.js     # Authentication state
│   │   │   └── ThemeContext.js    # Theme management
│   │   ├── 📁 lib/                # External libraries
│   │   │   └── supabase.js        # Supabase configuration
│   │   ├── 📁 pages/              # Main application pages
│   │   │   ├── Dashboard.jsx      # Main dashboard
│   │   │   ├── Login.jsx          # User login
│   │   │   └── Register.jsx       # User registration
│   │   ├── 📁 services/           # API services
│   │   │   └── api.js             # Backend API calls
│   │   ├── App.css                # Global styles
│   │   ├── App.js                 # Main app component
│   │   ├── index.css              # Base styles
│   │   └── index.js               # Application entry point
│   ├── .env.example               # Environment variables template
│   ├── Dockerfile                 # Frontend container config
│   └── package.json               # Dependencies and scripts
├── 📁 backend/                     # Node.js API Server
│   ├── 📁 src/
│   │   ├── 📁 controllers/        # Request handlers
│   │   ├── 📁 routes/             # API route definitions
│   │   ├── 📁 services/           # Business logic services
│   │   │   ├── auditService.js    # Audit logging
│   │   │   ├── blobService.js     # Azure Blob operations
│   │   │   ├── cosmosService.js   # Cosmos DB operations
│   │   │   └── hashService.js     # SHA-256 hashing
│   │   ├── app.js                 # Express app configuration
│   │   └── server.js              # Server entry point
│   ├── .env.example               # Environment variables template
│   ├── Dockerfile                 # Backend container config
│   ├── diagnose.js                # System diagnostics
│   ├── start-debug.js             # Debug mode starter
│   └── package.json               # Dependencies and scripts
├── 📁 nginx/                       # Reverse Proxy Configuration
│   └── nginx.conf                 # NGINX configuration
├── 📁 .github/workflows/           # CI/CD Pipeline
│   └── ci-cd.yml                  # GitHub Actions workflow
├── .env.example                   # Root environment template
├── .gitignore                     # Git ignore rules
├── docker-compose.yml             # Multi-container setup
├── LICENSE                        # MIT License
├── README.md                      # Project documentation
├── SECURITY.md                    # Security policy
└── DEPLOYMENT.md                  # Deployment guide
```

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js 18+** and npm
- **Azure Account** with active subscription
- **Supabase Account** for authentication
- **Git** for version control
- **Docker** (optional, for containerized deployment)

### Step 1: Clone Repository
```bash
git clone https://github.com/YOURUSERNAME/document-verification-system.git
cd document-verification-system
```

### Step 2: Azure Services Setup

#### Create Azure Blob Storage
```bash
# Create resource group
az group create --name doc-verify-rg --location eastus

# Create storage account
az storage account create \
  --name docverifyshivam123 \
  --resource-group doc-verify-rg \
  --location eastus \
  --sku Standard_LRS

# Create container
az storage container create \
  --name documents \
  --account-name docverifyshivam123
```

#### Create Azure Cosmos DB
```bash
# Create Cosmos DB account
az cosmosdb create \
  --name doc-verify-cosmos \
  --resource-group doc-verify-rg \
  --default-consistency-level Session

# Create database and container
az cosmosdb sql database create \
  --account-name doc-verify-cosmos \
  --resource-group doc-verify-rg \
  --name DocumentVerification
```

### Step 3: Environment Configuration

#### Backend Environment (backend/.env)
```env
# Server Configuration
PORT=5003
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Azure Blob Storage
AZURE_STORAGE_ACCOUNT_NAME=docverifyshivam123
AZURE_STORAGE_ACCOUNT_KEY=your_storage_key
AZURE_STORAGE_CONTAINER_NAME=documents

# Azure Cosmos DB
AZURE_COSMOSDB_ENDPOINT=https://your-account.documents.azure.com:443/
AZURE_COSMOSDB_KEY=your_cosmos_key
AZURE_COSMOSDB_DATABASE_NAME=DocumentVerification
AZURE_COSMOSDB_CONTAINER_NAME=Documents
```

#### Frontend Environment (frontend/.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5003

# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Installation & Startup

#### Option A: Manual Setup
```bash
# Install backend dependencies
cd backend
npm install
npm start

# Install frontend dependencies (new terminal)
cd frontend
npm install
npm start
```

#### Option B: Docker Compose (Recommended)
```bash
# Build and start all services
docker-compose up --build

# Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5003
# NGINX Proxy: http://localhost
```

## 🔒 Security Implementation

### File Security
- **File Type Validation**: Only PDF, DOC, DOCX, JPG, PNG allowed
- **File Size Limits**: Maximum 10MB per document
- **Virus Scanning**: Integration ready for antivirus services
- **Secure Upload**: Direct Azure Blob Storage integration

### Cryptographic Security
- **SHA-256 Hashing**: Industry-standard cryptographic hashing
- **Hash Comparison**: Byte-level document integrity verification
- **Tamper Detection**: Immediate identification of document modifications

### Application Security
- **Rate Limiting**: API request throttling (100 requests/15 minutes)
- **CORS Protection**: Cross-origin request security
- **Input Sanitization**: SQL injection and XSS prevention
- **Secure Headers**: Helmet.js security headers
- **Authentication**: JWT-based user authentication via Supabase
- **Authorization**: Role-based access control

## 📊 System Workflow

### Document Upload Workflow
```
1. User Authentication → Supabase JWT verification
2. File Selection → Client-side validation
3. File Upload → Multer middleware processing
4. Security Checks → File type, size, content validation
5. Hash Generation → SHA-256 cryptographic hash creation
6. Azure Storage → Secure blob storage upload
7. Metadata Storage → Cosmos DB document creation
8. Audit Logging → Operation tracking and timestamping
9. Response → Document ID and hash returned to client
```

### Document Verification Workflow
```
1. User Authentication → JWT token validation
2. File Upload → Temporary file processing
3. Hash Generation → SHA-256 hash of uploaded file
4. Database Query → Original hash retrieval from Cosmos DB
5. Hash Comparison → Cryptographic comparison
6. Result Determination → VERIFIED or TAMPERED status
7. Audit Logging → Verification attempt recording
8. Response → Detailed verification result with timestamps
```

## 🚀 Deployment Options

### Local Development
```bash
# Development mode with hot reload
npm run dev  # Backend
npm start    # Frontend
```

### Docker Deployment
```bash
# Production build
docker-compose -f docker-compose.prod.yml up --build
```

### Azure App Service Deployment
```bash
# Build and deploy to Azure
az webapp up --name doc-verify-app --resource-group doc-verify-rg
```

### GitHub Actions CI/CD
Automated deployment pipeline included with:
- Automated testing
- Security scanning
- Docker image building
- Azure deployment

## 📚 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/logout` | User logout | Yes |

### Document Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/documents/upload` | Upload document | Yes |
| POST | `/api/documents/verify` | Verify document | Yes |
| GET | `/api/documents/audit-logs` | Get audit logs | Yes |
| GET | `/api/documents/:id` | Get document details | Yes |
| DELETE | `/api/documents/:id` | Delete document | Yes |

### System Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Health check | No |
| GET | `/api/status` | System status | Yes |

### API Response Examples

#### Successful Upload Response
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "documentId": "550e8400-e29b-41d4-a716-446655440000",
    "fileName": "contract.pdf",
    "fileSize": 2048576,
    "mimeType": "application/pdf",
    "hash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
    "uploadedAt": "2024-01-15T10:30:00.000Z",
    "blobUrl": "https://docverifyshivam123.blob.core.windows.net/documents/550e8400-e29b-41d4-a716-446655440000"
  }
}
```

#### Verification Response
```json
{
  "success": true,
  "message": "Document verification completed",
  "data": {
    "isVerified": true,
    "status": "VERIFIED",
    "documentId": "550e8400-e29b-41d4-a716-446655440000",
    "originalHash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
    "currentHash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
    "originalTimestamp": "2024-01-15T10:30:00.000Z",
    "verificationTimestamp": "2024-01-15T14:45:00.000Z",
    "matchPercentage": 100
  }
}
```

## 🧪 Testing & Quality Assurance

### Unit Testing
```bash
# Backend unit tests
cd backend
npm test

# Frontend unit tests
cd frontend
npm test

# Run tests with coverage
npm run test:coverage
```

### Integration Testing
```bash
# API integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e
```

### Manual Testing
```bash
# Health check
curl http://localhost:5003/api/health

# Upload test document
curl -X POST -F "document=@test.pdf" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5003/api/documents/upload

# Verify document
curl -X POST -F "document=@test.pdf" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5003/api/documents/verify
```

## 📈 Monitoring & Analytics

### Performance Metrics
- Response time monitoring
- Error rate tracking
- Upload/verification success rates
- User activity analytics

### Health Monitoring
- Azure Application Insights integration
- Custom health check endpoints
- Real-time error logging
- Performance bottleneck identification

## 🔧 Troubleshooting Guide

### Common Issues

#### Azure Connection Issues
```bash
# Check Azure credentials
az account show

# Test storage connection
az storage blob list --container-name documents --account-name docverifyshivam123

# Test Cosmos DB connection
az cosmosdb show --name doc-verify-cosmos --resource-group doc-verify-rg
```

#### File Upload Problems
- Verify file size (max 10MB)
- Check supported file types
- Ensure Azure storage quota
- Validate network connectivity

#### Authentication Issues
- Check Supabase configuration
- Verify JWT token validity
- Confirm user permissions

## 🤝 Contributing Guidelines

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow coding standards (ESLint + Prettier)
4. Write comprehensive tests
5. Update documentation
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open Pull Request with detailed description

### Code Standards
- Follow ESLint configuration
- Use Prettier for code formatting
- Write JSDoc comments for functions
- Maintain test coverage above 80%
- Follow semantic versioning

## 📄 License & Legal

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

### Third-Party Licenses
- React.js - MIT License
- Node.js - MIT License
- Express.js - MIT License
- Azure SDK - MIT License
- Supabase - Apache 2.0 License

## 🎓 Academic & Educational Use

### Learning Objectives
This project demonstrates mastery of:
- **Full-Stack Development**: React.js + Node.js integration
- **Cloud Computing**: Azure services implementation
- **Security Engineering**: Cryptographic hashing and verification
- **Database Design**: NoSQL document storage patterns
- **DevOps Practices**: Containerization and CI/CD
- **API Development**: RESTful web services
- **Authentication Systems**: JWT and OAuth integration
- **Modern UI/UX**: Responsive design and accessibility

### Technical Skills Showcased
- Cryptographic hash functions (SHA-256)
- Cloud storage and database integration
- Real-time web applications
- Security best practices
- Performance optimization
- Error handling and logging
- Testing methodologies

## 📞 Support & Contact

### Getting Help
1. **Documentation**: Check this README and inline code comments
2. **Issues**: Create GitHub issue with detailed description
3. **Discussions**: Use GitHub Discussions for questions
4. **Security**: Report security issues via [SECURITY.md](SECURITY.md)

### Maintainers
- **Primary Developer**: [Your Name]
- **Project Supervisor**: [Supervisor Name]
- **Institution**: [Your College/University]

---

<div align="center">

**🔐 Built with ❤️ for Secure Document Management**

*Ensuring Document Integrity Through Cryptographic Innovation*

[![GitHub Stars](https://img.shields.io/github/stars/yourusername/document-verification-system?style=social)](https://github.com/yourusername/document-verification-system)
[![GitHub Forks](https://img.shields.io/github/forks/yourusername/document-verification-system?style=social)](https://github.com/yourusername/document-verification-system)
[![GitHub Issues](https://img.shields.io/github/issues/yourusername/document-verification-system)](https://github.com/yourusername/document-verification-system/issues)

</div>

