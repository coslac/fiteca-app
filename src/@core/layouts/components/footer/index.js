import "@src/assets/scss/footer.scss";

// ** Config
import themeConfig from "@configs/themeConfig";

const Footer = () => {
  return (
    <div className="container-footer-total">
      <div tag="footer" id="footer-container">
        <div className="footer-links">
          <div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-logo"
          >
            <img
              width={133}
              alt="brand-name"
              src={themeConfig.app.appLogoFooter}
            />
          </a>
          </div>
          <div>
          <a href="#" className="footer-link">
            Suporte
          </a>
          <span className="footer-separator">.</span>
          <a href="#" className="footer-link">
            Termos de uso
          </a>
          <span className="footer-separator">.</span>
          <a href="#" className="footer-link">
            Política de privacidade
          </a>
          </div>
        </div>
        <div />
      </div>
    </div>
  );
};

export default Footer;
