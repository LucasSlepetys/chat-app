import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { auth, db } from '../firebase/FirebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { nanoid } from 'nanoid';

const GlobalContext = createContext();

//function to get all global values from context
export const useAuthContext = () => {
  return useContext(GlobalContext);
};

const userStorage = JSON.parse(localStorage.getItem('user') || null);

const AuthContext = ({ children }) => {
  console.log('user Storage');
  console.log(userStorage);
  //if local storage does not contain key of user return null
  const [user, setUser] = useState(userStorage);
  const [error, setError] = useState(null);

  const loginUser = useCallback(
    () => async (uid) => {
      try {
        const userRef = doc(db, 'users', uid);
        const docSnapshot = onSnapshot(userRef, (snapshot) => {
          const userData = snapshot.data();
          console.log('user data:');
          console.log(userData);
          //updates user data in local useState
          setUser(userData);
          //updates user data in local storage
          localStorage.setItem('user', JSON.stringify(userData));
          setError(null);
          console.log('update has happened');
        });
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
      console.log(user);
      try {
        //new room's id:
        const roomID = nanoid();
        const newRoomDoc = doc(db, 'rooms', roomID);
        await setDoc(newRoomDoc, {
          roomID: roomID,
          roomName: 'Private Room',
        });

        const userDoc = doc(db, 'users', user.uid);
        //Adds new roomID to allowedRooms array in firebase
        //What must also do:
        //Add same information to local storage and to user state
        await updateDoc(userDoc, {
          allowedRooms: arrayUnion(roomID),
        });
        //New Data for the local storage and user state:
        const newAllowedRoom = user.allowedRooms;
        newAllowedRoom.push(roomID);
        const newLocalData = {
          ...user,
          allowedRooms: newAllowedRoom,
        };
        //updates user data in local useState
        setUser(newLocalData);
        //updates user data in local storage
        localStorage.setItem('user', JSON.stringify(newLocalData));
        return roomID;
      } catch (err) {
        console.log(err.message);
        return '';
      }
    },
    []
  );

  const joinPrivateRoom = useCallback(
    () => async (roomID) => {
      try {
        const userDoc = doc(db, 'users', user.uid);
        await updateDoc(userDoc, {
          allowedRooms: arrayUnion(roomID),
        });
        return null;
      } catch (error) {
        console.log(err.message);
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
    joinPrivateRoom,
  };

  return (
    <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>
  );
};

export default AuthContext;
