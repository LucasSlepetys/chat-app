import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { FaArrowCircleRight } from 'react-icons/fa';
import { Navigate, useLoaderData, useNavigate } from 'react-router-dom';
import { storage } from '../firebase/FirebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';
import { BsPersonCircle } from 'react-icons/bs';

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
  const { img, error } = useLoaderData();
  const { logOut } = useAuthContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const roomNum = data.roomNum;
    console.log(roomNum);
  };

  return (
    <div className='h-screen relative flex flex-col justify-center items-center gap-20'>
      <div
        onClick={logOut}
        className='absolute top-5 left-5 inline-flex justify-center items-center gap-4'
      >
        <div className='block relative rounded-full shadow-2xl'>
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
        <p className='text-slate-800 text-2xl tracking-widest'>
          Hello {user.name}!
        </p>
      </div>
      <div className='flex flex-col gap-4'>
        <button
          type='button'
          onClick={() => navigate('/room/c15Gg1C7BqnHls37RsXI')}
          className='text-white shadow-md bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center '
        >
          Go to public room
          <FaArrowCircleRight className='text-2xl ml-2' />
        </button>
        <button
          type='button'
          className='text-white shadow-md bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center '
        >
          Create private room
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <button
          type='submit'
          className='inline-flex justify-between w-full items-center my-8 text-xl rounded-full bg-green-200 py-2 px-4'
        >
          Enter Private Room <FaArrowCircleRight className='text-4xl ml-2' />
        </button>
        <div className='flex justify-center items-center gap-2 border-b-2 border-black'>
          <p className='text-black text-xl text-left '>Room #</p>
          <input
            type='number'
            name='roomNum'
            placeholder='Enter room number'
            className='text-xl outline-none text-slate-700 tracking-wider	'
            required
          />
        </div>
      </form>
    </div>
  );
};

export default Home;
