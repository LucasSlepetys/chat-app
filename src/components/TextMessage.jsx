import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import defaultUserIcon from '../assets/userIcon.png';
import { storage } from '../firebase/FirebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';
import { RiDraggable } from 'react-icons/ri';

export function TextMessage({ text, provided, sentBy }) {
  const [userImg, setUserImg] = useState(defaultUserIcon);
  const { user } = useAuthContext();

  const getImgFromFirebase = async () => {
    try {
      const imgRef = ref(storage, `usersImgs/${sentBy.photoID}`);
      const img = await getDownloadURL(imgRef);
      setUserImg(img);
    } catch (error) {
      console.log('Error in TextMessage.jsx' + error.message);
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
          className={`inline text-2xl  ${
            sentBy.userUID === user.uid ? 'order-1 ml-4' : 'mr-4'
          }`}
        />
        <p className='inline text-left sm:text-lg md:text-xl mx-4'>{text}</p>
      </div>
    </div>
  );
}
