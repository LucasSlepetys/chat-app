import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserInfo = () => {
  const navigate = useNavigate();
  const { user, error, signInUser } = useAuthContext();
  console.log(user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //gets all data from from using their name attribute
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    //-------------

    const userInfo = {
      name: data.name,
      email: data.email,
      uid: user.uid,
    };

    await signInUser()(userInfo);

    if (!error) {
      navigate('/home');
    } else {
      console.log(error);
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
      <div className='flex justify-center gap-2 m-2'></div>
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
