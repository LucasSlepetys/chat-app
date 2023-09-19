import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Navigate, Outlet, useNavigation } from 'react-router-dom';
import LoaderAnimation from '../components/LoaderAnimation';

const PrivateRouter = () => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading';
  if (isPageLoading) return <LoaderAnimation />;

  const { user } = useAuthContext();

  return user !== null ? <Outlet /> : <Navigate to='/authentication' />;
};

export default PrivateRouter;
