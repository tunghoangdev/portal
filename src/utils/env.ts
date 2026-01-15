/**
 * Environment Configuration
 * Centralized configuration for environment variables
 */

interface EnvConfig {
  APP_ENV: string;
  API_URL: string;
  APP_NAME: string;
  isDevelopment: boolean;
  isBeta: boolean;
  isProd: boolean;
}

// Get environment variables from Vite
const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (value === undefined) {
    console.warn(`Environment variable ${key} is not defined`);
    return '';
  }
  return value;
};

// Environment configuration
export const env: EnvConfig = {
  APP_ENV: getEnvVar('VITE_APP_ENV') || 'development',
  API_URL: getEnvVar('VITE_API_URL') || 'http://localhost:8000/api',
  APP_NAME: getEnvVar('VITE_APP_NAME') || 'Portal',
  
  // Helper flags
  get isDevelopment() {
    return this.APP_ENV === 'development';
  },
  get isBeta() {
    return this.APP_ENV === 'beta';
  },
  get isProd() {
    return this.APP_ENV === 'prod';
  },
};

// Log current environment in development
if (env.isDevelopment) {
  console.log('🚀 Current Environment:', {
    env: env.APP_ENV,
    apiUrl: env.API_URL,
    appName: env.APP_NAME,
  });
}

export default env;
