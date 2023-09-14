import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { db } from '../firebase/FirebaseConfig';

const GlobalContext = createContext();

//function to get all global values from context
export const useAuthContext = () => {
  return useContext(GlobalContext);
};

const AuthContext = ({ children }) => {
  //if local storage does not contain key of user return null
  const userStorage = JSON.parse(localStorage.getItem('user') || null);
  const [user, setUser] = useState(userStorage);
  const [error, setError] = useState(null);

  const loginUser = useCallback(
    () => async (uid) => {
      try {
        const userRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userRef);
        const userData = { ...docSnap.data(), allowedRooms: [] };
        //updates user data in local useState
        setUser(userData);
        //updates user data in local storage
        localStorage.setItem('user', JSON.stringify(userData));
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    },
    []
  );

  const signInUser = useCallback(
    () => async (userInfo) => {
      const { name = null, email = null, uid = null } = userInfo;
      try {
        //gets all values from userInfo
        //if a value isn't pass on userInfo it becomes null as default
        const newUserInfo = {
          name: name,
          email: email,
          uid: uid,
          allowedRooms: [],
        };
        const userRef = doc(db, 'users', uid);
        //updates userRef's data in firestore
        await setDoc(userRef, newUserInfo);
        //updates user data in local useState
        setUser(newUserInfo);
        //updates user data in local storage
        localStorage.setItem('user', JSON.stringify(newUserInfo));
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    },
    []
  );

  const logOut = () => {
    try {
      setUser(null);
      localStorage.clear();
    } catch (err) {
      setError(err.message);
    }
  };

  const values = {
    user,
    error,
    loginUser,
    signInUser,
    logOut,
  };

  return (
    <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>
  );
};

export default AuthContext;
