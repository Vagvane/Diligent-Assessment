import { Link } from 'react-router-dom';

function formatPrice(value, currency = 'USD') {
  if (typeof value !== 'number') return value;
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

function ProductCard({ product }) {
  const {
    _id,
    name,
    price,
    currency = 'USD',
    shortDescription,
    description,
    images = [],
    stock,
    slug
  } = product || {};

  const imageUrl = images?.[0] || 'https://via.placeholder.com/600x400?text=Product';
  const productLink = _id ? `/products/${_id}` : slug ? `/products/${slug}` : '#';
  const isOutOfStock = typeof stock === 'number' ? stock <= 0 : false;

  return (
    <article className="product-card">
      <Link to={productLink} className="product-card__image-wrap" aria-label={`View ${name}`}>
        <img src={imageUrl} alt={name} className="product-card__image" loading="lazy" />
      </Link>
      <div className="product-card__body">
        <Link to={productLink} className="product-card__title">
          {name}
        </Link>
        <p className="product-card__desc">
          {shortDescription || description || 'No description available.'}
        </p>
        <div className="product-card__meta">
          <span className="product-card__price">{formatPrice(price, currency)}</span>
          <span className={`product-card__stock ${isOutOfStock ? 'is-out' : 'is-in'}`}>
            {isOutOfStock ? 'Out of stock' : 'In stock'}
          </span>
        </div>
        <button className="button button--primary product-card__cta" disabled={isOutOfStock}>
          {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;

