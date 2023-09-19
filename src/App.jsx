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
import Room, { loader as roomLoader } from './pages/Room';
import ErrorPage from './pages/ErrorPage';
import Error from './components/Error';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/FirebaseConfig';

const App = () => {
  const { user } = useAuthContext();

  const router = createBrowserRouter([
    {
      path: 'authentication',
      errorElement: <Error />,
      element: user ? <Navigate to='/' /> : <Authentication />,
    },
    {
      path: 'userInfo',
      errorElement: <Error />,
      element: user?.name ? <Navigate to='/authentication' /> : <UserInfo />,
    },
    {
      element: <PrivateRouter />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: user?.name ? <Home /> : <UserInfo />,
          errorElement: <Error />,
        },
        {
          path: 'room/:id',
          element: <Room />,
          errorElement: <Error />,
          loader: roomLoader,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
