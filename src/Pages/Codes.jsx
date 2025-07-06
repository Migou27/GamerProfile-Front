import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CodeList from '../Components/CodeList/CodeList';
import NotConnected from '../Components/NotConnected/NotConnected';

const Codes = () => {
  const { token } = useContext(AuthContext);

  return (
    <div>
      {token ? <CodeList /> : <NotConnected />}
    </div>
  );
};

export default Codes;