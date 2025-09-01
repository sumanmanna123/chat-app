import React, { useState } from 'react';
import AuthForm from '../../components/authForm/AuthForm';


const LoginPage = () => {
  const [currState, setCurrState] = useState("Login in to your account");

  return (
    <div className="bg-[url('src/assets/bg.jpg')] bg-no-repeat bg-cover bg-center h-screen flex items-center justify-center">
      <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            {currState}
          </h1>
          <AuthForm currState={currState} setCurrState={setCurrState}/>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
