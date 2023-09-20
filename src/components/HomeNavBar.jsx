import React, { useEffect, useState } from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { useAuthContext } from '../context/AuthContext';
import { FaBars } from 'react-icons/fa';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase/FirebaseConfig';

export function HomeNavBar({ toggleShowRooms, showRooms }) {
  const [userImg, setUserImg] = useState(null);
  const { user } = useAuthContext();

  const getImg = async () => {
    try {
      const imgRef = ref(storage, `usersImgs/${user.photoID}`);
      const img = await getDownloadURL(imgRef);
      console.log(img);
      setUserImg(img);
    } catch (error) {
      console.log('Error in HomeNavBar.jsx: ' + error.message);
    }
  };

  useEffect(() => {
    getImg();
  }, []);

  return (
    <div className='absolute top-0 left-0 w-full inline-flex items-center justify-between gap-4 p-4'>
      <div className='flex gap-6 items-center'>
        <div className=' relative rounded-full shadow-2xl'>
          {!userImg ? (
            <BsPersonCircle className='object-cover w-10 h-10 rounded-full custom-position shadow-2xl' />
          ) : (
            <img
              src={userImg}
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
        <FaBars
          onClick={toggleShowRooms}
          className={`text-white text-2xl sm:text-3xl ${
            showRooms ? '' : 'animate-bounce'
          } temporary-bounce`}
        />
      </div>
    </div>
  );
}
