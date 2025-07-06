import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: 'center', marginTop: 60 }}>
      <h1>404</h1>
      <p>{t('404-NotFound')}</p>
    </div>
  );
};

export default NotFound;