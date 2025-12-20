const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

class HashService {
  // Generate SHA-256 hash from file buffer
  static generateHash(fileBuffer) {
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  // Compare two hashes
  static compareHashes(hash1, hash2) {
    return hash1 === hash2;
  }

  // Generate document ID
  static generateDocumentId() {
    return uuidv4();
  }
}

module.exports = HashService;