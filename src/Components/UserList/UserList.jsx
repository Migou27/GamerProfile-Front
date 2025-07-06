import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import UserCollection from '../UserCollection/UserCollection';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading/Loading';

const UserList = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    axios.get('http://localhost:3001/api/getAllUsers', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Loading message={t('Loading-Users')} />;

  if (selectedUser) {
    return (
      <div>
        <button onClick={() => setSelectedUser(null)} style={{ marginBottom: 16 }}>
          {t('Users-ReturnList')}
        </button>
        <UserCollection user={selectedUser} />
      </div>
    );
  }

  return (
    <div>
      <h2 className='welcome'>{t('Users-List')}</h2>
      <ul>
        {users.map(user => (
          <li key={user._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>{user.pseudo}</span>
            <button onClick={() => setSelectedUser(user)}>{t('Seen', 'Voir')}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;