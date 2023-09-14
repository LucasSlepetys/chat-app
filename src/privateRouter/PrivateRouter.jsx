import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRouter = () => {
  const { user } = useAuthContext();

  return user !== null ? <Outlet /> : <Navigate to='/authentication' />;
};

export default PrivateRouter;
