import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="page page--centered">
      <h1>404</h1>
      <p>The page you are looking for could not be found.</p>
      <Link to="/" className="button button--primary">
        Return Home
      </Link>
    </section>
  );
}

export default NotFound;

