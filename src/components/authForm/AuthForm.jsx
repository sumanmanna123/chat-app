import React from 'react';


import InputField from '../inputField/InputField';
import FormToggleMessage from '../toggleMessage/ToggleMessage';

const AuthForm = ({ currState, setCurrState }) => {
  const isSignup = currState === "Create your account";

  return (
    <form className="space-y-4 md:space-y-6" action="#">
      {isSignup && (
        <InputField
          label="Username"
          type="text"
          placeholder="Enter your username"
        />
      )}

      <InputField
        label="Your email"
        type="email"
        placeholder="Enter your email"
      />

      <InputField
        label="Password"
        type="password"
        placeholder="••••••••"
      />
      

      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <input id="remember" type="checkbox" className="w-4 h-4 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
          <label htmlFor="remember" className="ml-3 text-sm text-gray-500 dark:text-gray-300">Remember me</label>
        </div>
        <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
      </div>

      <div className="w-full">
        <button type="submit" className="min-w-full bg-blue-500 shadow-lg hover:bg-blue-600 focus:ring-1/2 focus:outline-none font-medium border rounded-lg text-white text-sm px-5 py-2.5 text-center">
          {isSignup ? "Sign up" : "Login"}
        </button>
      </div>

      <FormToggleMessage currState={currState} setCurrState={setCurrState} />
      
    </form>
  );
};

export default AuthForm;
