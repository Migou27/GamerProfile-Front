import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column">
            <div className="footer-logo">
              <Link to="/">
                <span className="footer-logo-text">Gamer Profile</span>
              </Link>
            </div>
            <p className="footer-description">
              {t('Footer-Description')}
            </p>
          </div>
        </div>
        
        <div className="footer-divider"></div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} GamerProfile. {t('Footer-Rights')}</p>
            <p className="footer-disclaimer">
              {t('Footer-Disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;