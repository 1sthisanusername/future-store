// Payment Configuration
const paymentConfig = {
  // PayPal Configuration
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || 'AW0bhj2niAFuo6OUQAGzgqw-x60RqKRQzpVGuGRUY2cUTWe93M6nt8fsd-yw59367t7zjpmnKKktqtoW',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'your_paypal_client_secret_here',
    mode: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
    currency: 'USD'
  },

  // Stripe Configuration (alternative payment method)
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'your_stripe_publishable_key_here',
    secretKey: process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key_here',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'your_stripe_webhook_secret_here'
  },

  // Currency settings
  currency: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US'
  },

  // Tax and shipping rates
  rates: {
    tax: 0.05, // 5% tax
    shipping: {
      standard: 100, // $1.00 in cents
      express: 200   // $2.00 in cents
    }
  }
};

module.exports = paymentConfig;