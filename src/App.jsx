import React, { useEffect } from 'react';
import { useAuthContext } from './context/AuthContext';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import Authentication from './pages/Authentication';
import Home, { loader as homeLoader } from './pages/Home';
import UserInfo from './pages/userInfo';
import PrivateRouter from './privateRouter/PrivateRouter';
import Room, { loader as roomLoader } from './pages/Room';

const App = () => {
  const { user } = useAuthContext();

  const router = createBrowserRouter([
    {
      path: 'authentication',
      element: user ? <Navigate to='/' /> : <Authentication />,
    },
    {
      path: 'userInfo',
      element: user?.name ? <Navigate to='/authentication' /> : <UserInfo />,
    },
    {
      element: <PrivateRouter />,
      children: [
        {
          index: true,
          element: user?.name ? <Home /> : <UserInfo />,
          loader: homeLoader(user?.photoID),
        },
        {
          path: 'room/:id',
          element: <Room />,
          loader: roomLoader,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
