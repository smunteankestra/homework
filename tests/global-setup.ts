import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Parse .env file manually (without dotenv dependency)
 */
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️ .env file not found');
    return;
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');

  lines.forEach((line) => {
    line = line.trim();
    // Skip comments and empty lines
    if (!line || line.startsWith('#')) {
      return;
    }

    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim();

    if (key && value) {
      // Set environment variable
      process.env[key] = value;
    }
  });

  console.log('✅ .env file loaded');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function globalSetup(_config: FullConfig) {
  // Load .env file before any tests run
  loadEnvFile();

  // Verify credentials are available
  if (!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD) {
    throw new Error(
      'TEST_EMAIL and TEST_PASSWORD not found in environment or .env file. ' +
      'Please create/update .env file with credentials.'
    );
  }

  console.log('✅ Global setup complete');
}

export default globalSetup;

