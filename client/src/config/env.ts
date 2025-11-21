/**
 * Environment configuration for Belkhair E-Commerce Platform
 * 
 * To configure:
 * 1. Copy .env.example to .env.local
 * 2. Fill in your actual API keys and credentials
 * 3. Never commit .env.local to version control
 */

export const env = {
  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz',
  },

  // Email Service Configuration (SendGrid, AWS SES, or SMTP)
  email: {
    provider: import.meta.env.VITE_EMAIL_PROVIDER || 'sendgrid', // 'sendgrid' | 'ses' | 'smtp'
    apiKey: import.meta.env.VITE_EMAIL_API_KEY || '',
    fromEmail: import.meta.env.VITE_EMAIL_FROM || 'noreply@belkhair.com',
    fromName: import.meta.env.VITE_EMAIL_FROM_NAME || 'Belkhair E-Commerce',
  },

  // Backend API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://8000-i1gsqlojk4l922n82631o-c4e07aaa.manusvm.computer/api/v1',
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Belkhair',
    url: import.meta.env.VITE_APP_URL || 'https://belkhair.com',
  },
};

// Validation: Check if required environment variables are set
export function validateEnv() {
  const warnings: string[] = [];

  if (env.stripe.publishableKey.startsWith('pk_test_')) {
    warnings.push('⚠️  Using Stripe test key. Replace with production key before going live.');
  }

  if (!env.email.apiKey) {
    warnings.push('⚠️  Email API key not configured. Email notifications will not be sent.');
  }

  if (warnings.length > 0) {
    console.warn('Environment Configuration Warnings:');
    warnings.forEach(warning => console.warn(warning));
  }

  return warnings.length === 0;
}

// Run validation on module load
if (import.meta.env.DEV) {
  validateEnv();
}
