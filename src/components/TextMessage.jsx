import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import svgg from '../assets/react.svg';
import { storage } from '../firebase/FirebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';

export function TextMessage({ text, sentAt, provided, sentBy }) {
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
      className={sentBy.userUID === user.uid ? 'text-right m-5' : 'm-5'}
    >
      {sentBy.userUID === user.uid ? (
        <div className=''>
          <p className='capitalize mb-2 italic inline-block text-left text-base text-white -translate-y-2/3'>
            You
          </p>
          <div className='inline-block relative rounded-full shadow-2xl'>
            <img
              src={userImg}
              alt=''
              className='object-cover w-10 h-10 rounded-full custom-position shadow-2xl ml-2 '
            />
          </div>
        </div>
      ) : (
        <div className=''>
          <div className='inline-block relative rounded-full shadow-2xl'>
            <img
              src={userImg}
              alt=''
              className='object-cover w-10 h-10 rounded-full custom-position shadow-2xl mr-2 '
            />
          </div>
          <p className='capitalize mb-2 italic inline-block text-left text-base text-white -translate-y-2/3'>
            {sentBy.name}
          </p>
        </div>
      )}

      <div className='rounded-full p-2 inline-block gap-2 max-w-90 bg-white text-black '>
        <p className='inline mr-2'>{text}</p>
        <p className='inline text-slate-400'>{sentAt}</p>
      </div>
    </div>
  );
}
