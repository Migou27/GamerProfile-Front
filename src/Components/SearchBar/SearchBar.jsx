import { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ onSelect }) => {
  const { token } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const debounceRef = useRef();
  const { t } = useTranslation();

  const fetchSuggestions = (value) => {
    clearTimeout(debounceRef.current);
    if (value.length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/searchGames?q=${encodeURIComponent(value)}&limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults(res.data);
      } catch {
        setResults([]);
      }
    }, 250);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSelect = async (game) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/gamesByName/${encodeURIComponent(game.nomJeux)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSelect && onSelect(res.data);
      setQuery(game.nomJeux);
      setResults([]);
    } catch {
      setResults([]);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && query.length > 1) {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/gamesByName/${encodeURIComponent(query)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onSelect && onSelect(res.data);
        setResults([]);
      } catch {
        setResults([]);
      }
    }
  };

  return (
    <div className="search-bar-container" style={{ position: 'relative', marginBottom: 12 }}>
      <input
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={t('Games-Search')}
        className="search-bar-input"
        style={{ width: 300, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        autoComplete="off"
      />
      {results.length > 0 && (
        <ul className="search-preview-list" style={{
          position: 'absolute', top: 38, left: 0, width: 300, background: '#fff', border: '1px solid #ccc', borderRadius: 6, zIndex: 10, maxHeight: 180, overflowY: 'auto', margin: 0, padding: 0
        }}>
          {results.map(game => (
            <li
              key={game._id}
              style={{ padding: 8, cursor: 'pointer', listStyle: 'none' }}
              onClick={() => handleSelect(game)}
            >
              {game.nomJeux}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;