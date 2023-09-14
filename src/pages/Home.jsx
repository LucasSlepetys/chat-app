import React from 'react';
import { useAuthContext } from '../context/AuthContext';

const Home = () => {
  const { logOut } = useAuthContext();
  return <div onClick={logOut}>Home</div>;
};

export default Home;
