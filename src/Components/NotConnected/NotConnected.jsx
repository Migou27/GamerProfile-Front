import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotConnected = () => {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: 'center', marginTop: 60 }}>
      <h1>{t('403-ConnectionRequired')}</h1>
      <p>{t('403-Message')}</p>
      <Link to="/register" style={{ textDecoration: 'none', color: '#007bff', marginRight: 10 }}>
        {t('403-CreateAccount')}
      </Link>
      <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>
        {t('403-Login')}
      </Link>
    </div>
  );
};

export default NotConnected;