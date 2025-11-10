import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';

function OrderConfirmation() {
  const { orderId } = useParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasClearedCartRef = useRef(false);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      setError('');
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
        if (!hasClearedCartRef.current) {
          clearCart();
          hasClearedCartRef.current = true;
        }
      } catch (err) {
        setError(err?.message || 'Unable to retrieve order.');
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <section className="page page--centered">
        <h1>Processing your order...</h1>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="page page--centered">
        <h1>Order Confirmation</h1>
        <p>{error || 'Order not found.'}</p>
        <Link to="/products" className="button button--primary">
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="page order-confirmation">
      <h1>Thank you for your purchase!</h1>
      <p className="muted">Order ID: {order._id}</p>
      <p className={`status-badge status-badge--${order.status.toLowerCase()}`}>
        Status: {order.status}
      </p>

      <div className="order-confirmation__summary">
        <h2>Order Summary</h2>
        <ul>
          {order.items?.map((item) => (
            <li key={item.productId}>
              <span>{item.name} &times; {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="order-confirmation__totals">
          <div>
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div>
            <span>Tax</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="order-confirmation__total">
            <span>Total Paid</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="page__actions">
        <Link to="/products" className="button button--primary">
          Continue Shopping
        </Link>
        <Link to="/cart" className="button">
          View Cart
        </Link>
      </div>
    </section>
  );
}

export default OrderConfirmation;

