import { RoomBtn } from './RoomBtn';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/FirebaseConfig';

const RoomsPopUpDisplay = ({ showRooms }) => {
  const { user, logOut } = useAuthContext();

  return (
    <div
      className={`absolute max-h-screen w-full sm:w-10/12 max-w-xl flex top-0 sm:top-14 transition-all duration-100 sm:right-12 bg-slate-900 flex-col justify-center items-center gap-4  sm:rounded-tl-full sm:rounded-bl-full sm:rounded-br-full overflow-hidden ${
        showRooms ? 'h-full sm:h-auto p-10 sm:pb-20' : 'h-0'
      }`}
    >
      <p className='text-white tracking-widest font-bold sm:text-lg'>
        Your private rooms:
      </p>

      <div className='flex flex-col justify-center items-center sm:w-10/12 gap-4'>
        {user.allowedRooms?.map((room) => {
          return <RoomBtn key={room} room={room} />;
        })}
      </div>
      <button
        onClick={logOut}
        type='button'
        className='absolute bottom-5 pointer text-white bg-red-700 px-2 py-1 rounded-full'
      >
        Log Out
      </button>
    </div>
  );
};

export default RoomsPopUpDisplay;
