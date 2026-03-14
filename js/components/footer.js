import "./currency-selector.js";

const footerStyles = `
  footer {
    background-color: #f4f4f4;
    padding: 60px 5% 20px;
    font-family: system-ui, sans-serif;
    color: #2d2a29;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin-bottom: 60px;
  }

  @media (min-width: 768px) {
    .footer-grid {
      grid-template-columns: 1.5fr 1fr;
    }
  }

  .footer-section h4 {
    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 1.5px;
    margin-bottom: 20px;
    color: #888;
  }

  .social-icons {
    display: flex;
    gap: 20px;
  }

  .social-icons a img {
    width: 20px;
    height: 20px;
    opacity: 0.8;
  }

  .info-links {
    list-style: none;
    padding: 0;
  }

  .info-links li {
    margin-bottom: 12px;
  }

  .info-links a {
    text-decoration: none;
    color: #2d2a29;
    font-size: 15px;
    transition: opacity 0.2s;
  }

  .info-links a:hover {
    opacity: 0.6;
  }

  .footer-bottom {
    border-top: 1px solid #ddd;
    padding-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .currency-selector-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    cursor: pointer;
  }

  .copyright {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #888;
  }

  #currency-selector {
    background: transparent;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 6px 8px;
    font-size: 0.8rem;
    width: fit-content;
  }
`;

class ZyraFooter extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <style>${footerStyles}</style>
      <footer>
        <div class="footer-grid">
          <div class="footer-section">
            <h4>Follow @ZYRA_FASHIONHOUSE</h4>
            <div class="social-icons">
              <a href="https://tiktok.com/@zyrafashionhouse1"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z'%3E%3C/path%3E%3C/svg%3E" alt="Tiktok" /></a>
              <a href="https://instagram.com/zyra_fashionhouse"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='2' width='20' height='20' rx='5' ry='5'%3E%3C/rect%3E%3Cpath d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z'%3E%3C/path%3E%3Cline x1='17.5' y1='6.5' x2='17.51' y2='6.5'%3E%3C/line%3E%3C/svg%3E" alt="Instagram" /></a>
            </div>
          </div>

          <div class="footer-section">
            <h4>Info</h4>
            <ul class="info-links">
              <li><a href="/html/products.html">Ready To Wear</a></li>
              <li><a href="/html/about.html">About Us</a></li>
              <li><a href="/html/privacy.html">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <currency-selector></currency-selector>
          <div class="copyright">
            © Zyra 2024. All rights reserved.
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("zyra-footer", ZyraFooter);
