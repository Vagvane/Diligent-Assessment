import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductById } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    async function fetchDetails() {
      setLoading(true);
      setError('');
      try {
        const data = await getProductById(productId);
        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to load product');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  useEffect(() => {
    setQuantity(1);
  }, [productId]);

  const handleQuantityChange = (next) => {
    if (Number.isNaN(next)) return;
    setQuantity(Math.max(1, Math.min(99, next)));
  };

  const decrement = () => handleQuantityChange(quantity - 1);
  const increment = () => handleQuantityChange(quantity + 1);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <section className="page">
        <div className="details details--skeleton">
          <div className="skeleton skeleton--image lg" />
          <div className="details__panel">
            <div className="skeleton skeleton--text" />
            <div className="skeleton skeleton--text short" />
            <div className="skeleton skeleton--price" />
            <div className="skeleton skeleton--text" />
            <div className="skeleton skeleton--button" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page page--centered">
        <h1>Product Details</h1>
        <p>{error}</p>
        <div className="page__actions">
          <Link to="/products" className="button">Back to Products</Link>
          <button className="button button--primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="page page--centered">
        <h1>Product not found</h1>
        <Link to="/products" className="button button--primary">Back to Products</Link>
      </section>
    );
  }

  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/800x600?text=Product';
  const isOutOfStock = typeof product.stock === 'number' ? product.stock <= 0 : false;

  return (
    <section className="page">
      <div className="details">
        <div className="details__media">
          <img src={imageUrl} alt={product.name} className="details__image" />
        </div>
        <div className="details__panel">
          <h1 className="details__title">{product.name}</h1>
          <p className="details__price">
            {new Intl.NumberFormat(undefined, { style: 'currency', currency: product.currency || 'USD' }).format(product.price || 0)}
          </p>
          <p className={`details__stock ${isOutOfStock ? 'is-out' : 'is-in'}`}>
            {isOutOfStock ? 'Out of stock' : 'In stock'}
          </p>
          <p className="details__desc">{product.description || 'No description available.'}</p>
          <div className="quantity-control" aria-label="Quantity selector">
            <button type="button" onClick={decrement} disabled={quantity <= 1}>
              −
            </button>
            <input
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={(event) => handleQuantityChange(Number(event.target.value))}
              aria-label="Quantity"
            />
            <button type="button" onClick={increment} disabled={isOutOfStock}>
              +
            </button>
          </div>
          <div className="page__actions">
            <Link to="/products" className="button">Back to Products</Link>
            <button
              className="button button--primary"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;

