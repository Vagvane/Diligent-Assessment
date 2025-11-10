import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

function formatPrice(value, currency = 'USD') {
  if (typeof value !== 'number') return value;
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

function Cart() {
  const { items, subtotal, totalItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleQuantityChange = (id, quantity) => {
    if (!quantity) return;
    updateQuantity(id, Math.max(1, Math.min(99, Number(quantity))));
  };

  if (items.length === 0) {
    return (
      <section className="page page--centered">
        <h1>Your Cart</h1>
        <p>Your cart is currently empty.</p>
        <div className="page__actions">
          <Link to="/products" className="button button--primary">
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page cart">
      <header className="cart__header">
        <h1>Your Cart</h1>
        <button type="button" className="button" onClick={clearCart}>
          Clear Cart
        </button>
      </header>

      <div className="cart__content">
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <div className="cart-item__media">
                {item.image ? (
                  <img src={item.image} alt={item.name} loading="lazy" />
                ) : (
                  <div className="cart-item__placeholder" />
                )}
              </div>
              <div className="cart-item__body">
                <h2>{item.name}</h2>
                <span className="cart-item__price">{formatPrice(item.price, item.currency)}</span>
                <div className="quantity-control">
                  <button type="button" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={item.quantity}
                    onChange={(event) => handleQuantityChange(item.id, Number(event.target.value))}
                    aria-label={`Quantity for ${item.name}`}
                  />
                  <button type="button" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item__actions">
                <span className="cart-item__total">
                  {formatPrice(item.price * item.quantity, item.currency)}
                </span>
                <button
                  type="button"
                  className="button cart-item__remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <h2>Summary</h2>
          <div className="cart-summary__row">
            <span>Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="cart-summary__note">Shipping and taxes calculated at checkout.</p>
          <Link to="/checkout" className="button button--primary cart-summary__cta">
            Proceed to Checkout
          </Link>
          <Link to="/products" className="button cart-summary__continue">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default Cart;

