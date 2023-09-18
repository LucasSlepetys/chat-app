import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { auth, db } from '../firebase/FirebaseConfig';
import { signOut } from 'firebase/auth';
import { nanoid } from 'nanoid';

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
      const {
        name = null,
        email = null,
        uid = null,
        photoID = null,
      } = userInfo;
      try {
        //gets all values from userInfo
        //if a value isn't pass on userInfo it becomes null as default
        const newUserInfo = {
          name: name,
          email: email,
          uid: uid,
          photoID: photoID,
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
      signOut(auth);
      setUser(null);
      localStorage.clear();
    } catch (err) {
      setError(err.message);
    }
  };

  const addNewRoom = useCallback(
    () => async () => {
      try {
        const roomID = nanoid();
        const newRoomDoc = doc(db, 'rooms', roomID);
        await setDoc(newRoomDoc, {
          roomID: roomID,
          roomName: 'Private Room',
        });

        const userDoc = doc(db, 'users', user.uid);
        await updateDoc(userDoc, {
          allowedRooms: arrayUnion(roomID),
        });

        return roomID;
      } catch (err) {
        console.log(err.message);
        return '';
      }
    },
    []
  );

  const values = {
    user,
    error,
    loginUser,
    signInUser,
    logOut,
    addNewRoom,
  };

  return (
    <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>
  );
};

export default AuthContext;
