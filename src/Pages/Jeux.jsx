import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import GameList from '../Components/GameList/GameList';
import NotConnected from '../Components/NotConnected/NotConnected';

const Jeux = () => {
  const { token } = useContext(AuthContext);

  return (
    <div>
      {token ? <GameList /> : <NotConnected />}
    </div>
  );
};

export default Jeux;