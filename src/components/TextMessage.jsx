import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import svgg from '../assets/react.svg';
import { storage } from '../firebase/FirebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';
import { RiDraggable } from 'react-icons/ri';

export function TextMessage({ text, provided, sentBy }) {
  const [userImg, setUserImg] = useState(svgg);
  const { user } = useAuthContext();

  const getImgFromFirebase = async () => {
    try {
      const imgRef = ref(storage, `usersImgs/${sentBy.photoID}`);
      const img = await getDownloadURL(imgRef);
      setUserImg(img);
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };

  useEffect(() => {
    getImgFromFirebase();
  }, []);

  return (
    <div
      {...provided.dragHandleProps}
      {...provided.draggableProps}
      ref={provided.innerRef}
      className={sentBy.userUID === user.uid ? 'text-right m-2 mr-5' : 'm-5'}
    >
      {sentBy.userUID !== user.uid && (
        <div className=''>
          <div className='inline-block relative rounded-full shadow-2xl'>
            <img
              src={userImg}
              alt=''
              className='object-cover w-10 h-10 rounded-full custom-position shadow-2xl mr-2'
            />
          </div>
          <p className='capitalize mb-2 italic inline-block text-left text-base text-white -translate-y-1/2'>
            {sentBy.name}
          </p>
        </div>
      )}

      <div
        className={`rounded-full p-4 inline-flex justify-center items-center max-w-90 shadow-xl text-black ${
          sentBy.userUID === user.uid ? 'bg-green-300' : 'bg-white'
        }`}
      >
        <RiDraggable
          className={`inline h-6 w-6  ${
            sentBy.userUID === user.uid ? 'order-1 ml-4' : 'mr-4'
          }`}
        />
        <p className='inline sm:text-lg md:text-xl'>{text}</p>
      </div>
    </div>
  );
}
