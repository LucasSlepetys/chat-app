import React from 'react';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export function NavBar({ roomName, roomID }) {
  const navigate = useNavigate();

  return (
    <div className='w-full bg-sky-100 p-6 flex items-center gap-4 text-sky-950 shadow-xl'>
      <FaArrowAltCircleLeft
        className='w-10 h-10 '
        onClick={() => navigate(-1)}
      />
      <p className='text-lg tracking-wider'>{roomName}</p>
      <p className='text-lg tracking-wider'>
        {roomID !== 'c15Gg1C7BqnHls37RsXI' ? `| ID: ${roomID}` : ''}
      </p>
    </div>
  );
}
