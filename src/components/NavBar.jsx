import { doc, updateDoc } from 'firebase/firestore';
import React, { useRef } from 'react';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/FirebaseConfig';

export function NavBar({ roomName, roomID }) {
  const navigate = useNavigate();
  const privateRoomNameRef = useRef(null);
  const isPrivate = roomID !== 'c15Gg1C7BqnHls37RsXI' ? true : false;

  const handleChange = async () => {
    const roomDoc = doc(db, 'rooms', roomID);
    if (
      privateRoomNameRef.current.value === '' ||
      privateRoomNameRef.current.value === ' '
    ) {
      privateRoomNameRef.current.value = 'Private Room';
    }
    await updateDoc(roomDoc, {
      roomName: privateRoomNameRef.current.value,
    });
  };

  return (
    <div className='w-full bg-sky-100 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sky-950 shadow-xl'>
      <div>
        <FaArrowAltCircleLeft
          className='w-10 h-10 inline mr-8'
          onClick={() => navigate(-1)}
        />
        <input
          type='text'
          className='text-lg tracking-wider bg-transparent w-2/4'
          defaultValue={roomName}
          ref={privateRoomNameRef}
          onMouseLeave={handleChange}
          disabled={!isPrivate}
        />
      </div>
      {isPrivate && (
        <p className='text-sm sm:text-lg tracking-wider font-bold'>
          ID: {roomID}
          <span
            onClick={() => {
              navigator.clipboard.writeText(roomID);
            }}
            className='bg-green-300 w-fit font-normal cursor-pointer p-2 m-2 rounded-full hidden sm:inline-block'
          >
            {' '}
            Copy
          </span>
        </p>
      )}
    </div>
  );
}
