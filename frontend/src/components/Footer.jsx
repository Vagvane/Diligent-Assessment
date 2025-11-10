function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p>&copy; {year} ShopSphere. All rights reserved.</p>
        <div className="footer__links">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#support">Support</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

