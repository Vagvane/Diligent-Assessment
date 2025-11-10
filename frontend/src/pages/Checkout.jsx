import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { createOrder } from '../services/api.js';

function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal } = useCart();
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [items, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError('');
    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity
        })),
        customer: {
          name: form.name,
          email: form.email,
          address: form.address
        }
      };

      const response = await createOrder(payload);
      navigate('/payment', {
        state: {
          orderId: response.orderId,
          clientSecret: response.clientSecret,
          totalAmount: response.totalAmount,
          currency: response.currency
        }
      });
    } catch (err) {
      setError(err?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="page checkout">
      <h1>Checkout</h1>
      <div className="checkout__grid">
        <form className="checkout__form" onSubmit={handleSubmit}>
          <h2>Customer Information</h2>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Address
            <textarea
              name="address"
              rows="3"
              value={form.address}
              onChange={handleChange}
              placeholder="Street, City, ZIP"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="button button--primary" disabled={loading}>
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </form>

        <aside className="checkout__summary">
          <h2>Order Summary</h2>
          <ul className="checkout__items">
            {items.map((item) => (
              <li key={item.id}>
                <div>
                  <span>{item.name}</span>
                  <span className="muted">Qty: {item.quantity}</span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="checkout__totals">
            <div>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div>
              <span>Tax</span>
              <span>Calculated at payment</span>
            </div>
            <div className="checkout__total">
              <span>Estimated Total</span>
              <span>~ ${(subtotal * 1.08).toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Checkout;

