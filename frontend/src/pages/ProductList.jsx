import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { getProducts } from '../services/api.js';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        // Expect API to return either { items: [...] } or an array directly
        const data = await getProducts({ page: 1, limit: 12 });
        const items = Array.isArray(data) ? data : data.items || [];
        if (isMounted) {
          setProducts(items);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to load products');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="page">
      <div className="page__header">
        <h1>Products</h1>
        <div className="page__header-actions">
          <Link to="/" className="button">Home</Link>
        </div>
      </div>

      {loading && (
        <div className="grid grid--products" aria-busy="true">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="product-card product-card--skeleton">
              <div className="skeleton skeleton--image" />
              <div className="product-card__body">
                <div className="skeleton skeleton--text" />
                <div className="skeleton skeleton--text short" />
                <div className="skeleton skeleton--price" />
                <div className="skeleton skeleton--button" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="alert alert--error">
          <span>{error}</span>
          <button className="button" onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="empty-state">
          <p>No products found.</p>
          <Link to="/" className="button button--primary">Back to Home</Link>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid--products">
          {products.map((p) => (
            <ProductCard key={p._id || p.slug} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;

