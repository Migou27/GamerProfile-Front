import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { AuthContext } from '../../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import { confirmToast, infoToast } from '../../Services/alertHandler/alertHandler';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../context/ThemeContext';

import moonImg from '../../assets/images/Moon.png';
import sunImg from '../../assets/images/Sun.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { token, setToken } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    infoToast(t('Auth-Deconnected'));
    navigate('/');
  };

  let userName = null;
  let userRole = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userName = payload.pseudo;
      userRole = payload.role;
    } catch (e) {
      userName = null;
    }
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Gamer Profile</span>
        </Link>

        <div className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`toggle-icon ${menuOpen ? 'open' : ''}`}></span>
        </div>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <ul className="navbar-items">
            <li className="navbar-item">
              <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
                {t('Home')}
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/jeux" className={`navbar-link ${isActive('/jeux') ? 'active' : ''}`}>
                {t('Games')}
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/codes" className={`navbar-link ${isActive('/codes') ? 'active' : ''}`}>
                {t('FriendCode')}
              </Link>
            </li>
          </ul>
          
          <ul className="navbar-items">
            <div className="navbar-buttons">
              {token && userRole === 'user' ? (
                <li className="navbar-item">
                  <Link to="/userCollection" className={`navbar-link ${isActive('/userCollection') ? 'active' : ''}`}>
                    {t('Collection-Mine')}
                  </Link>
                </li>
              ) : null}
              {token && userRole === 'admin' ? (
                <li className="navbar-item">
                  <Link to="/allUsers" className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}>
                    {t('Users')}
                  </Link>
                </li>
              ) : null}
              <div style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
                {/* Langue */}
                {i18n.language === 'fr' ? (
                  <button onClick={() => i18n.changeLanguage('en')} style={{ fontSize: '20px', padding: '2px 8px', background: 'none', border: 'none' }}>
                    🇺🇸
                  </button>
                ) : (
                  <button onClick={() => i18n.changeLanguage('fr')} style={{ fontSize: '20px', padding: '2px 8px', background: 'none', border: 'none' }}>
                    🇫🇷
                  </button>
                )}
                {/* Thème */}
                {theme === 'light' ? (
                  <button
                    onClick={toggleTheme}
                    style={{ fontSize: '20px', padding: '2px 8px', background: 'none', border: 'none' }}
                    title="Mode sombre"
                  >
                    <img src={moonImg} alt="Mode sombre" style={{ width: 30, height: 30, verticalAlign: 'middle' }} />
                  </button>
                ) : (
                  <button
                    onClick={toggleTheme}
                    style={{ fontSize: '20px', padding: '2px 8px', background: 'none', border: 'none' }}
                    title="Mode clair"
                  >
                    <img src={sunImg} alt="Mode clair" style={{ width: 30, height: 30, verticalAlign: 'middle' }} />
                  </button>
                )}
              </div>
              {!token ? (
                <>
                  <Link to="/login" className="navbar-button">
                    {t('Connection')}
                  </Link>
                  <Link to="/register" className="navbar-button navbar-button-highlight">
                    {t('Registration')}
                  </Link>
                </>
              ) : (
                <>
                  <span className='account' style={{ fontWeight: 600 }}>
                    <FaUserCircle style={{ marginRight: 7, fontSize: 20 }} />
                    {userName}
                  </span>
                  <div>
                    <button className="navbar-button navbar-button-highlight"
                      onClick={() =>
                        confirmToast({
                          title: t('Auth-DeconnectionAlert'),
                          confirmLabel: t('Deconnection'),
                          cancelLabel: t('Cancel'),
                          onConfirm: handleLogout,
                        })
                      }
                    >
                      {t('Deconnection')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;