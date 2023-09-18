import { RoomBtn } from './RoomBtn';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/FirebaseConfig';

const RoomsPopUpDisplay = ({ showRooms }) => {
  const [listOfRooms, setListOfRooms] = useState([]);
  const { user } = useAuthContext();
  const getAllRooms = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const docData = await getDoc(userDocRef);
      const listOfRooms = await docData.data().allowedRooms;
      console.log(listOfRooms);
      setListOfRooms(listOfRooms);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getAllRooms();
  }, []);

  return (
    <div
      className={`absolute w-full sm:w-10/12 max-w-xl top-14 transition-all ease-in-out duration-700 right-12 bg-slate-900 flex flex-col justify-center items-center gap-4 p-10 rounded-tl-full rounded-bl-full rounded-br-full overflow-hidden ${
        showRooms === true ? 'max-h-0 max-w-0 p-0 m-0' : 'h-auto'
      }`}
    >
      <p className='text-white tracking-widest font-bold sm:text-lg'>
        Your private rooms:
      </p>
      <div className='flex flex-col justify-center items-center w-8/12 gap-4'>
        {listOfRooms?.map((room) => {
          return <RoomBtn key={room} room={room} />;
        })}
      </div>
    </div>
  );
};

export default RoomsPopUpDisplay;
