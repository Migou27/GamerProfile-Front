import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './GameList.css';
import star from '../../assets/images/star-spinning.gif';
import { AuthContext } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import { successToast, errorToast } from '../../Services/alertHandler/alertHandler';
import Loading from '../Loading/Loading';
import SearchBar from '../SearchBar/SearchBar';
import { useTranslation } from 'react-i18next';

const LIMIT = 10;

const ListeJeux = () => {
  const { token } = useContext(AuthContext);
  const socketRef = useRef(null);
  const { t } = useTranslation();

  const [filteredJeux, setFilteredJeux] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [anneeOptions, setAnneeOptions] = useState([]);
  const [consoleOptions, setConsoleOptions] = useState([]);
  const [etatOptions, setEtatOptions] = useState([]);

  const [selectedAnnee, setSelectedAnnee] = useState(null);
  const [selectedConsole, setSelectedConsole] = useState(null);
  const [selectedEtat, setSelectedEtat] = useState(null);
  const [favorisOnly, setFavorisOnly] = useState(false);

  const [userGameIds, setUserGameIds] = useState([]);

  // Décodage du token une seule fois
  let userRole = null;
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
    }
  } catch {}

  // Construction des params de requête (stable)
  const buildQueryParams = useCallback(
    (offsetToUse) => {
      const params = {};
      if (selectedAnnee) params.date = selectedAnnee.value;
      if (selectedConsole) params.console = selectedConsole.value;
      if (selectedEtat) params.etat = selectedEtat.value;
      if (favorisOnly) params.favoris = true;
      params.offset = offsetToUse;
      params.limit = LIMIT;
      return params;
    },
    [selectedAnnee, selectedConsole, selectedEtat, favorisOnly]
  );

  // Socket setup une fois au montage
  useEffect(() => {
    if (!token) return;

    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('userGameAdded', ({ userId, gameId }) => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.id === userId) {
          setUserGameIds(prev =>
            prev.includes(gameId.toString()) ? prev : [...prev, gameId.toString()]
          );
        }
      } catch (e) {}
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [token]);

  // Récupération des options de filtres au montage
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [yearsRes, consolesRes, etatsRes] = await Promise.all([
          axios.get('http://localhost:3001/api/dates'),
          axios.get('http://localhost:3001/api/consoles'),
          axios.get('http://localhost:3001/api/etats'),
        ]);
        setAnneeOptions(yearsRes.data.map(v => ({ value: v, label: v })));
        setConsoleOptions(consolesRes.data.map(v => ({ value: v, label: v })));
        setEtatOptions(etatsRes.data.map(v => ({ value: v, label: v })));
      } catch {
        errorToast(t('Games-Filters') + ' : ' + t('Collection-RetrieveError'));
      }
    };
    fetchOptions();
  }, [t]);

  // Récupération des jeux favoris de l'utilisateur (au token change)
  useEffect(() => {
    if (!token) {
      setUserGameIds([]);
      return;
    }
    const fetchUserGameIds = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/getUserGameIds', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserGameIds(res.data.map(id => id.toString()));
      } catch {
        setUserGameIds([]);
      }
    };
    fetchUserGameIds();
  }, [token]);

  // Fonction stable de fetchGames (je la laisse ici, mais ne la mets PAS dans les dépendances des useEffect)
  const fetchGames = useCallback(
    async (offsetToFetch = 0, reset = false) => {
      setLoading(true);
      try {
        const params = buildQueryParams(offsetToFetch);
        const response = await axios.get('http://localhost:3001/api/games', {
          params,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (reset) {
          setFilteredJeux(response.data);
        } else {
          setFilteredJeux(prev => [...prev, ...response.data]);
        }
        setHasMore(response.data.length === LIMIT);
      } catch {
        errorToast(t('Games-Search') + ' : ' + t('Collection-RetrieveError'));
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [buildQueryParams, token, t]
  );

  // Reset et fetch des jeux quand filtres changent — ne pas inclure fetchGames dans la dépendance, on appelle directement
  useEffect(() => {
    setOffset(0);
    fetchGames(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnnee, selectedConsole, selectedEtat, favorisOnly]);

  // Fetch la suite quand offset change (sauf au reset)
  useEffect(() => {
    if (offset === 0) return; // déjà géré par l'autre useEffect
    fetchGames(offset, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  // Handler du bouton "Afficher plus"
  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    // Debug log pour vérifier que le clic est pris en compte
    console.log('Chargement plus…');
    setOffset(prev => prev + LIMIT);
  };

  // Grouper les jeux par année
  const jeuxParAnnee = (data) => {
    return data.reduce((acc, jeu) => {
      const annee = jeu.anneeSortieJeux || t('Inconnue', 'Inconnue');
      if (!acc[annee]) acc[annee] = [];
      acc[annee].push(jeu);
      return acc;
    }, {});
  };

  // Couleurs pour l'état du jeu
  const getEtatColor = (etat) => {
    if (etat === 'Fini') return '#257508';
    if (etat && etat.includes('Fini, joue encore')) return '#00D5D2';
    if (etat && etat.includes('En cours')) return '#F68512';
    return undefined;
  };

  // Sauvegarde d'un jeu dans la collection utilisateur
  const handleSaveGame = async (id, name) => {
    try {
      await axios.post(
        'http://localhost:3001/api/addUserGame',
        { gameId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      successToast(`${name}${t('Games-AddedToCollection')}`);
      setUserGameIds(prev => (prev.includes(id.toString()) ? prev : [...prev, id.toString()]));
    } catch {
      errorToast(t('Games-AddToCollection') + ' : ' + t('Collection-DeleteError'));
    }
  };

  const grouped = jeuxParAnnee(filteredJeux);

  if (loading && filteredJeux.length === 0) return <Loading message={t('Loading-Games')} />;

  return (
    <div className="liste-jeux">
      <div className="texte upRight1 middleText">
        <label>{t('Games-Favorites')}</label>
        <img src={star} className="star" alt="star" />
      </div>

      <div className="texte">
        <label>{t('Games-Filters')}</label>
        <div style={{ maxWidth: 300, marginBottom: 20 }}>
          <Select
            className="selectReact"
            options={anneeOptions}
            value={selectedAnnee}
            onChange={setSelectedAnnee}
            placeholder={t('ReleaseDate')}
            isClearable
          />
          <Select
            className="selectReact"
            options={consoleOptions}
            value={selectedConsole}
            onChange={setSelectedConsole}
            placeholder={t('Console')}
            isClearable
          />
          <Select
            className="selectReact"
            options={etatOptions.map(opt => ({
              ...opt,
              label: t(opt.value),
            }))}
            value={selectedEtat ? { ...selectedEtat, label: t(selectedEtat.value) } : null}
            onChange={setSelectedEtat}
            placeholder={t('Progression', 'Progression')}
            isClearable
          />
          <label>
            <input
              type="checkbox"
              checked={favorisOnly}
              onChange={() => setFavorisOnly(prev => !prev)}
              style={{ marginRight: 5 }}
            />
            {t('Favorites')}
          </label>
        </div>
        <div>
          <label>{t('Games-FastSearch')}</label>
          <SearchBar onSelect={(games) => setFilteredJeux(Array.isArray(games) ? games : [games])} />
        </div>
      </div>

      {Object.entries(grouped)
        .sort((a, b) => b[0] - a[0])
        .map(([annee, jeux]) => (
          <div key={annee} className="annee-section">
            <h2 className="annee-titre">{annee}</h2>
            <div className="game-grid">
              {jeux.map(unJeux => (
                <div
                  key={unJeux._id || `${unJeux.idJeux}-${unJeux.nomJeux}`}
                  className="game-card"
                >
                  <a
                    href={unJeux.siteJeux}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="game-link"
                  >
                    {unJeux.idFavoris && (
                      <img src={star} alt="SM64 star" className="star upRight" />
                    )}
                    <div className="image-container">
                      <img
                        src={unJeux.imageJeux}
                        alt={unJeux.nomJeux}
                        className="jaquette"
                      />
                    </div>
                  </a>
                  <div className="game-info">
                    <p className="game-title">{unJeux.nomJeux}</p>
                    <p>
                      <span className="game-console">{unJeux.nomConsole}</span>
                      <span
                        style={{ backgroundColor: getEtatColor(unJeux.libelleEtat) }}
                        className="game-state"
                      >
                        {t(unJeux.libelleEtat)}
                      </span>
                    </p>
                    {userRole === 'user' &&
                      (userGameIds.includes(
                        (unJeux._id || unJeux.idJeux)?.toString()
                      ) ? (
                        <span
                          className="already-added-label"
                          style={{ color: '#257508', fontWeight: 600 }}
                        >
                          {t('Games-AlreadyInCollection')}
                        </span>
                      ) : (
                        <button
                          className="save-game-btn"
                          onClick={() =>
                            handleSaveGame(unJeux._id || unJeux.idJeux, unJeux.nomJeux)
                          }
                          style={{ marginTop: 8 }}
                        >
                          {t('Games-AddToCollection')}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      {hasMore && (
        <div style={{ textAlign: 'center', margin: 20 }}>
          <button
            className="save-game-btn"
            onClick={handleLoadMore}
            disabled={loading}
            style={{ padding: '10px 24px', fontSize: 16 }}
          >
            {loading ? t('Loading-Games') : t('ShowMore', 'Afficher plus')}
          </button>
        </div>
      )}
      {!hasMore && (
        <div style={{ textAlign: 'center', margin: 20, color: '#888' }}>
          {t('NoMoreGames')}
        </div>
      )}
    </div>
  );
};

export default ListeJeux;
