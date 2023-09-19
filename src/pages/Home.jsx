import { HomeNavBar } from './../components/HomeNavBar';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { FaArrowCircleRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import RoomsPopUpDisplay from '../components/RoomsPopUpDisplay';

const Home = () => {
  const [showRooms, setShowRooms] = useState(false);
  const { addNewRoom, joinPrivateRoom, setUserLocal } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    setUserLocal();
  }, []);

  const toggleShowRooms = () => {
    setShowRooms(!showRooms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const roomID = data.roomID;
    joinPrivateRoom()(roomID).then(() => {
      navigate(`room/${roomID}`);
    });
  };

  const createPrivateRoom = async () => {
    try {
      const roomID = await addNewRoom()();
      console.log(roomID);
      navigate(`room/${roomID}`);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className='h-screen bg-sky-950 relative flex flex-col justify-center items-center gap-20'>
      <RoomsPopUpDisplay showRooms={showRooms} />
      <HomeNavBar toggleShowRooms={toggleShowRooms} showRooms={showRooms} />
      <div className='flex flex-col gap-4'>
        <button
          type='button'
          onClick={() => navigate('/room/c15Gg1C7BqnHls37RsXI')}
          className='text-white font-bold text-2xl shadow-3xl bg-sky-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-lg  px-5 py-2.5 text-center inline-flex justify-center items-center '
        >
          Go to public room
          <FaArrowCircleRight className='text-3xl ml-6' />
        </button>
        <button
          type='button'
          onClick={createPrivateRoom}
          className='text-sky-950 font-bold shadow-3xl bg-sky-300 hover:bg-sky-200 focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-lg text-2xl px-5 py-2.5 text-center '
        >
          Create private room
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor='roomID' className='text-white text-2xl'>
          Enter in a private room
        </label>
        <div className='flex justify-center items-center gap-2 bg-sky-300 p-4 mt-4'>
          <p className='text-sky-950 text-xl text-left '>Room #</p>
          <input
            type='text'
            name='roomID'
            id='roomID'
            placeholder='Enter room number'
            className='text-xl outline-none text-slate-700 tracking-wider	bg-transparent remove-arrow'
            required
          />
        </div>
        <button
          type='submit'
          className='text-white inline-flex tracking-wider justify-between w-full items-center my-10 text-xl rounded-3xl bg-green-800 py-3 px-6 shadow-2xl font-bold'
        >
          Enter Room <FaArrowCircleRight className='text-4xl ml-2' />
        </button>
      </form>
    </div>
  );
};

export default Home;
