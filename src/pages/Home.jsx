import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { FaArrowCircleRight, FaBars } from 'react-icons/fa';
import { Navigate, useLoaderData, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase/FirebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';
import { BsPersonCircle } from 'react-icons/bs';
import { doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import RoomsPopUpDisplay from '../components/RoomsPopUpDisplay';

export const loader = (photoID) => {
  return async () => {
    try {
      const imgRef = ref(storage, `usersImgs/${photoID}`);
      const img = await getDownloadURL(imgRef);
      return { img };
    } catch (error) {
      console.log(error);
      console.log(error.message);
      return { error: error.message };
    }
  };
};

const Home = () => {
  const [showRooms, setShowRooms] = useState(true);
  const { img, error } = useLoaderData();
  const { logOut } = useAuthContext();
  const { user, addNewRoom } = useAuthContext();
  const navigate = useNavigate();

  const toggleShowRooms = () => {
    setShowRooms(!showRooms);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const roomNum = data.roomNum;
    navigate(`room/${roomNum}`);
  };

  const createPrivateRoom = async () => {
    try {
      const roomID = await addNewRoom()();
      navigate(`room/${roomID}`);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className='h-screen bg-sky-950 relative flex flex-col justify-center items-center gap-20'>
      <RoomsPopUpDisplay showRooms={showRooms} />
      <div
        // onClick={logOut}
        className='absolute top-0 left-0 w-full inline-flex items-center justify-between gap-4 p-4'
      >
        <div className='flex gap-6 items-center'>
          <div className=' relative rounded-full shadow-2xl'>
            {error ? (
              <BsPersonCircle className='object-cover w-10 h-10 rounded-full custom-position shadow-2xl' />
            ) : (
              <img
                src={img}
                alt=''
                className='object-cover w-14 h-14 rounded-full custom-position shadow-2xl'
              />
            )}
          </div>
          <p className='text-white text-2xl tracking-widest capitalize'>
            Hello {user.name}!
          </p>
        </div>
        <div>
          <FaBars onClick={toggleShowRooms} className='text-white text-2xl' />
        </div>
      </div>
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
        <label htmlFor='roomNum' className='text-white text-2xl'>
          Enter in a private room
        </label>
        <div className='flex justify-center items-center gap-2 bg-sky-300 p-4 mt-4'>
          <p className='text-sky-950 text-xl text-left '>Room #</p>
          <input
            type='text'
            name='roomNum'
            id='roomNum'
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
