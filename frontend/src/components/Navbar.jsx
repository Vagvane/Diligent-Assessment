import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          ShopSphere
        </Link>
        <nav className="navbar__nav">
          <NavLink to="/" end className="navbar__link">
            Home
          </NavLink>
          <NavLink to="/products" className="navbar__link">
            Shop
          </NavLink>
          <NavLink to="/cart" className="navbar__link navbar__link--cart">
            Cart
            <span className="navbar__cart-badge" aria-label="cart items">
              {totalItems}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

