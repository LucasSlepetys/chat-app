import React from 'react';
import { useRouteError } from 'react-router-dom';

const Error = () => {
  const error = useRouteError();
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <h1>Opps something went wrong: {error.message}</h1>
    </div>
  );
};

export default Error;
