import { Link } from 'react-router-dom';

function Home() {
  return (
    <section className="home">
      <div className="home__hero">
        <h1>Discover products you&apos;ll love</h1>
        <p>
          Browse curated collections, explore detailed product insights, and keep your cart in sync across your session.
        </p>
        <Link to="/products" className="button button--primary">
          Explore Products
        </Link>
      </div>

      <div className="home__preview">
        <article className="home__card">
          <h2>Handpicked Collections</h2>
          <p>Filter and sort to find exactly what you need in seconds.</p>
        </article>
        <article className="home__card">
          <h2>Smart Cart</h2>
          <p>Manage your cart effortlessly with real-time updates.</p>
        </article>
        <article className="home__card">
          <h2>Seamless Experience</h2>
          <p>Responsive design ensures everything looks sharp on any device.</p>
        </article>
      </div>
    </section>
  );
}

export default Home;

