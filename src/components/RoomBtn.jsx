import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaArrowCircleRight } from 'react-icons/fa';
import { db } from '../firebase/FirebaseConfig';
import { useNavigate } from 'react-router-dom';

export function RoomBtn({ room }) {
  const [roomName, setRoomName] = useState('...');
  const navigate = useNavigate();

  const getRoomName = async () => {
    try {
      const roomRef = doc(db, 'rooms', room);
      const docSnapshot = onSnapshot(roomRef, (snapshot) => {
        const roomName = snapshot.data().roomName;
        setRoomName(roomName);
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getRoomName();
  }, []);

  return (
    <button
      type='button'
      onClick={() => {
        navigate(`room/${room}`);
      }}
      className='relative text-white w-full font-bold text-lg shadow-3xl bg-sky-400 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-lg  px-5 py-2.5 text-center inline-flex justify-center items-center '
    >
      Go to room: {roomName}
      <FaArrowCircleRight className='sm:text-3xl ml-6 absolute right-2' />
    </button>
  );
}
