import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import './userCollection.css';
import { AuthContext } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';
import { confirmToast, infoToast, errorToast } from '../../Services/alertHandler/alertHandler';
import { useTranslation } from 'react-i18next';

const UserCollection = ({ user }) => {
  const { token } = useContext(AuthContext);
  const [userGames, setUserGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();
  const { t } = useTranslation();

  const isAdminView = !!user;
  const userId = user ? user._id : null;
  const userName = user ? user.pseudo : '';

  useEffect(() => {
    const fetchUserGames = async () => {
      setLoading(true);
      try {
        let res;
        if (isAdminView) {
          res = await axios.get(`http://localhost:3001/api/getUserFullGames/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserGames(res.data.games || res.data);
        } else {
          res = await axios.get('http://localhost:3001/api/getUserFullGames', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserGames(res.data);
        }
      } catch (error) {
        setUserGames([]);
        console.error('Erreur lors de la récupération de la collection utilisateur :', error);
        errorToast(t('Collection-RetrieveError'));
      }
      setLoading(false);
    };
    if (token) fetchUserGames();
  }, [token, userId, isAdminView]);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');
    socketRef.current.on('userGameDeleted', ({ userId: deletedUserId, userGameId, gameId }) => {
      try {
        if (
          (!isAdminView && token && JSON.parse(atob(token.split('.')[1])).id === deletedUserId) ||
          (isAdminView && userId === deletedUserId)
        ) {
          // Remove the game by matching either the UserGame ID or the Game ID
          setUserGames(prev => prev.filter(userGame => 
            userGame._id !== userGameId && userGame.gameId.idJeux !== gameId
          ));
        }
      } catch (e) {
        console.error('Error processing socket event:', e);
      }
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [token, userId, isAdminView]);

  const handleDeleteGame = async (objectId, nomJeux) => {
    try {
      await axios.delete('http://localhost:3001/api/deleteUserGame', {
        headers: { Authorization: `Bearer ${token}` },
        data: { gameId: objectId }
      });
      infoToast(`${nomJeux}${t('Collection-Removed')}`);
    } catch (error) {
      infoToast(t('Collection-DeleteError'));
      console.error(error);
    }
  };

  if (loading) {
    return <div className="liste-jeux"><p>{t('Loading-Games')}</p></div>;
  }

  return (
    <div className="liste-jeux">
      <h2 style={{ marginBottom: 20 }}>
        {isAdminView
          ? `${t('Collection-Of')} ${userName || t('Users')}`
          : t('Collection-Mine')}
      </h2>
      <div className="game-grid">
        {userGames.length === 0 ? (
          <p>
            {isAdminView
              ? `${userName}${t('Collection-EmptyAdmin')}`
              : t('Collection-EmptyUser')}
          </p>
        ) : (
          userGames.map((userGame) => (
            <div key={userGame._id} className="game-card">
              <a href={userGame.gameId.siteJeux} target="_blank" rel="noopener noreferrer" className="game-link">
                <div className="image-container">
                  <img src={userGame.gameId.imageJeux} alt={userGame.gameId.nomJeux} className="jaquette" />
                </div>
              </a>
              <div className="game-info">
                <p className="game-title">{userGame.gameId.nomJeux}</p>
                <p>
                  <span className="game-console">{userGame.gameId.nomConsole}</span>
                </p>
                {!isAdminView && (
                  <button
                    className="delete-game-btn"
                    style={{ marginTop: 8, background: "#e53e3e", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}
                    onClick={() => confirmToast({
                      title: `${t('Collection-RemoveConfirm')}${userGame.gameId.nomJeux}${t('Collection-FromCollection')}`,
                      onConfirm: () => handleDeleteGame(userGame._id, userGame.gameId.nomJeux),
                      confirmLabel: t('Collection-YesRemove'),
                      cancelLabel: t('Cancel'),
                      confirmArgs: [userGame._id, userGame.gameId.nomJeux]
                    })}
                  >
                    {t('Collection-RemoveFrom')}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserCollection;