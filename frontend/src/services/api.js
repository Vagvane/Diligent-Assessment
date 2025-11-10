const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function buildUrl(path) {
  return `${BASE_URL.replace(/\/+$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(buildUrl(path), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {
      // swallow json parse errors
    }
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function getProducts(params = {}) {
  const url = new URL(buildUrl('/api/products'));
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    const message = `Failed to load products (${res.status})`;
    throw new Error(message);
  }
  return res.json();
}

export async function getProductById(productId) {
  if (!productId) throw new Error('Product ID is required');
  const res = await fetch(buildUrl(`/api/products/${productId}`), {
    headers: { 'Content-Type': 'application/json' }
  });
  if (res.status === 404) {
    const err = new Error('Product not found');
    err.code = 404;
    throw err;
  }
  if (!res.ok) {
    const message = `Failed to load product (${res.status})`;
    throw new Error(message);
  }
  return res.json();
}

export function createOrder(payload) {
  return request('/api/checkout/create-order', { method: 'POST', body: payload });
}

export function confirmPayment(orderId, payload) {
  return request('/api/checkout/confirm', {
    method: 'POST',
    body: { orderId, ...payload }
  });
}

export function getOrderById(orderId) {
  return request(`/api/orders/${orderId}`);
}
