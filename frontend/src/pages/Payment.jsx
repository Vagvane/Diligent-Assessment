import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmPayment } from '../services/api.js';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ cardNumber: '', nameOnCard: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentData = location.state;

  useEffect(() => {
    if (!paymentData?.orderId) {
      navigate('/cart', { replace: true });
    }
  }, [paymentData, navigate]);

  if (!paymentData?.orderId) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await confirmPayment(paymentData.orderId, {
        paymentStatus: 'success',
        paymentPayload: {
          cardNumber: form.cardNumber,
          nameOnCard: form.nameOnCard
        }
      });
      navigate(`/order-confirmation/${paymentData.orderId}`);
    } catch (err) {
      setError(err?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page payment">
      <h1>Payment</h1>
      <p className="muted">Order Total: {paymentData.currency || 'USD'} {paymentData.totalAmount?.toFixed?.(2) || paymentData.totalAmount}</p>
      <form className="payment__form" onSubmit={handleSubmit}>
        <label>
          Name on Card
          <input
            type="text"
            name="nameOnCard"
            value={form.nameOnCard}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Card Number
          <input
            type="text"
            name="cardNumber"
            value={form.cardNumber}
            onChange={handleChange}
            placeholder="4242 4242 4242 4242"
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="button button--primary" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
        <button type="button" className="button payment__secondary" onClick={() => navigate('/cart')}>
          Cancel & Return to Cart
        </button>
      </form>
    </section>
  );
}

export default Payment;

