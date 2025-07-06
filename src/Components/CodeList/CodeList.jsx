import { useState, useEffect , useContext } from 'react';
import axios from 'axios';
import './CodeList.css';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../Loading/Loading';
import { useTranslation } from 'react-i18next';

const ListeCodes = () => {
  const [lesCodes, setLesCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/codesAmis', { headers: { Authorization: `Bearer ${token}` } });
        setLesCodes(res.data);
      } catch (error) {
        console.error('Erreur Axios :', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [token]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert(t('Codes-Copied', 'Code copié !')))
      .catch((err) => alert(t('Codes-Error', 'Erreur : ') + err));
  };

  if (loading) return <Loading message={t('Codes-Loading', 'Chargement des codes...')} />;

  return (
    <div className="codes-ami-container">
      {lesCodes.map(code => (
        <div key={code.id} className="code-ami-card">
          <div className="code-ami-header">
            {code.jeuAmi}
          </div>
          <div className="code-ami-content">
            <div className="code-ami-info">
              <span className="code-ami-label">{t('Pseudo')} : </span>
              <span className="code-ami-value">{code.nomAmi}</span>
              {code.iconeAmi && <img src={code.iconeAmi} className="icone" alt="Icône" title={code.jeuAmi} />}
            </div>
            <div className="code-ami-info">
              <span className="code-ami-label">
                {t(code.particuleAmi)} :
              </span>
              <button onClick={() => handleCopy(code.codeAmi)} className="code-ami-value code-ami-important">
                {code.codeAmi}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListeCodes;