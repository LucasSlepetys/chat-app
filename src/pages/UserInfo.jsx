import { ref, uploadBytes } from 'firebase/storage';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { storage } from '../firebase/FirebaseConfig';
import { nanoid } from 'nanoid';

const UserInfo = () => {
  const navigate = useNavigate();
  const { user, error, signInUser } = useAuthContext();
  console.log(user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //gets all data from from using their name attribute
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const imageID = data.file.name + nanoid();
      const imageRef = ref(storage, `usersImgs/${imageID}`);

      const res = await uploadBytes(imageRef, data.file);

      const userInfo = {
        name: data.name,
        email: data.email,
        uid: user.uid,
        photoID: imageID,
      };

      await signInUser()(userInfo);

      if (!error) {
        navigate('/home');
      } else {
        console.log(error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='py-16 w-2/3 mx-auto max-w-sm'>
      <div className='md:flex md:items-center mb-6'>
        <div className='md:w-1/3'>
          <label
            className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
            htmlFor='name'
          >
            Name
          </label>
        </div>
        <div className='md:w-2/3'>
          <input
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
            type='text'
            placeholder='Your Name'
            required
            id='name'
            name='name'
          />
        </div>
      </div>
      <div className='md:flex md:items-center mb-6'>
        <div className='md:w-1/3'>
          <label
            className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
            htmlFor='email'
          >
            Your Email
          </label>
        </div>
        <div className='md:w-2/3'>
          <input
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
            type='text'
            id='email'
            name='email'
            placeholder='Your Email'
            defaultValue={user?.email || ''}
            required
          />
        </div>
      </div>
      <div className='mb-3 text-center'>
        <label htmlFor='file' className='mb-2 inline-block text-slate-700 '>
          Please upload a picture of your face
        </label>
        <input
          className='relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary'
          type='file'
          id='file'
          name='file'
          required
        />
      </div>
      <div className=''>
        <button
          className='shadow w-full bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded'
          type='submit'
        >
          Start Chatting
        </button>
      </div>
    </form>
  );
};

export default UserInfo;
