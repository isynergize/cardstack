import type { APIConfig } from '../types';

/**
 * API Configuration
 * For local development, data is served from /public/data
 * For production, update BASE_URL to your self-hosted domain
 */
const config: APIConfig = {
  // Placeholder for self-hosted domain
  // Replace with your domain when deploying: 'https://your-domain.com/data'
  BASE_URL: '/data',

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export default config;
