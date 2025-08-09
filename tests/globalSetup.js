// Global setup for Jest tests
// This file runs once before all tests

module.exports = async () => {
  // Set global test environment variables
  process.env.NODE_ENV = 'test';
  process.env.SESSION_SECRET = 'test-secret-key-global';
  process.env.PORT = '0';
  process.env.UPLOAD_PATH = './tests/temp-uploads';
  
  // Create temporary directories for testing
  const fs = require('fs');
  const path = require('path');
  
  const tempDirs = [
    './tests/temp-uploads',
    './tests/temp-data'
  ];
  
  for (const dir of tempDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  
  console.log('🧪 Global test setup completed');
};