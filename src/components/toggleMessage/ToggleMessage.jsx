import React from 'react';

const FormToggleMessage = ({ currState, setCurrState }) => {
  const isLogin = currState === "Login in to your account";

  return (
    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
      {isLogin ? (
        <>
          Don’t have an account yet?{" "}
          <span
            onClick={() => setCurrState("Create your account")}
            className="hover:underline text-gray-800 font-medium cursor-pointer"
          >
            Sign up
          </span>
        </>
      ) : (
        <>
          Already have an account?{" "}
          <span
            onClick={() => setCurrState("Login in to your account")}
            className="hover:underline text-gray-800 font-medium cursor-pointer"
          >
            Login
          </span>
        </>
      )}
    </p>
  );
};

export default FormToggleMessage;
