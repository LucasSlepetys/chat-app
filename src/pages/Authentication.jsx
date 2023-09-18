import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebase/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Authentication = () => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const { signInUser, loginUser, error } = useAuthContext();

  const signInWithGoogle = async () => {
    try {
      //sign in user with google
      const result = await signInWithPopup(auth, provider);

      // The signed-in user info:
      const userUID = result.user.uid;
      console.log(userUID);
      const userEmail = result.user.email;
      //-------------------------

      const userRef = doc(db, 'users', userUID);
      const docSnapshot = await getDoc(userRef);

      //checks if document exits and logins or signin user accordinly
      if (docSnapshot.exists()) {
        await loginUser()(userUID);
        if (!error) {
          navigate('/', { replace: true });
        } else {
          console.log(error);
        }
      } else {
        await signInUser()({ email: userEmail, uid: userUID });
        if (!error) {
          navigate('/userInfo');
        } else {
          console.log(error);
        }
      }
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-sky-950 text-white'>
      <p className='font-bold mb-10 text-4xl sm:text-6xl'>
        Ready to chat? With a twist...
      </p>
      <p className='text-3xl font-medium tracking-wider m-6'>Login to start!</p>
      <button
        type='button'
        onClick={signInWithGoogle}
        className='text-sky-950 shadow-3xl tracking-widest font-bold w-10/12 max-w-sm bg-white hover:bg-sky-200 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 rounded-lg text-lg sm:text-xl md:text-2xl px-10 sm:px-8 py-3 text-center inline-flex items-center justify-between'
      >
        <div className='bg-white rounded-full p-1'>
          <FcGoogle className='h-7 w-7' />
        </div>
        Sign in with Google
      </button>
    </div>
  );
};

export default Authentication;
