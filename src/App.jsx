import React, { useEffect } from 'react';
import { useAuthContext } from './context/AuthContext';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import Authentication from './pages/Authentication';
import Home from './pages/Home';
import UserInfo from './pages/userInfo';
import PrivateRouter from './privateRouter/PrivateRouter';

const App = () => {
  const { user } = useAuthContext();

  const router = createBrowserRouter([
    {
      path: 'authentication',
      element: user ? <Navigate to='/home' /> : <Authentication />,
    },
    {
      path: 'userInfo',
      element: user?.name ? <Navigate to='/authentication' /> : <UserInfo />,
    },
    {
      element: <PrivateRouter />,
      path: '/',
      children: [
        {
          path: 'home',
          element: user?.name ? <Home /> : <UserInfo />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
