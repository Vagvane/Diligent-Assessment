// backend/services/paymentService.js
// Mock payment provider abstraction. Swap implementation when integrating
// a real gateway (Stripe, Razorpay, etc.).

const PROVIDER = 'mock';

export async function createPaymentIntent({ amount, currency, metadata = {} }) {
  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error('Invalid amount for payment intent.');
  }

  const paymentIntentId = `${PROVIDER}_pi_${Date.now()}`;
  const clientSecret = `${paymentIntentId}_secret`;

  // Simulate async call to gateway
  await new Promise((resolve) => setTimeout(resolve, 150));

  return {
    id: paymentIntentId,
    clientSecret,
    provider: PROVIDER,
    metadata
  };
}

export async function confirmPayment(paymentIntentId, payload = {}) {
  if (!paymentIntentId) {
    throw new Error('Missing payment intent id.');
  }

  // Simulate verifying payment result with provider. For now, rely on
  // explicit status sent from frontend or default to success.
  const status = payload.status || payload.paymentStatus || 'success';

  await new Promise((resolve) => setTimeout(resolve, 150));

  const isSuccess = status === 'success' || status === 'succeeded';

  return {
    success: isSuccess,
    provider: PROVIDER,
    raw: payload
  };
}

