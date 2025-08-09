// Global teardown for Jest tests
// This file runs once after all tests

module.exports = async () => {
  // Clean up temporary directories
  const fs = require('fs');
  const path = require('path');
  
  const tempDirs = [
    './tests/temp-uploads',
    './tests/temp-data'
  ];
  
  for (const dir of tempDirs) {
    if (fs.existsSync(dir)) {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch (error) {
        console.warn(`Warning: Could not remove ${dir}:`, error.message);
      }
    }
  }
  
  // Close any open handles
  if (global.__SERVER__) {
    await new Promise((resolve) => {
      global.__SERVER__.close(resolve);
    });
  }
  
  console.log('🧹 Global test teardown completed');
};