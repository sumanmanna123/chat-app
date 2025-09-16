import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../inputField/InputField';
import FormToggleMessage from '../toggleMessage/ToggleMessage';

const AuthForm = ({ currState, setCurrState }) => {
  const isSignup = currState === 'Create your account';
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? '/signup' : '/login';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('currentUser', JSON.stringify({ username, email }));
        setMessage(`${isSignup ? 'Signup' : 'Login'} successful! Redirecting...`);
        navigate('/chat');
      } else {
        setMessage(data.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please check your connection and try again.');
    }
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
      {isSignup && (
        <InputField
          label="Username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      )}
      <InputField
        label="Your email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {message && <p className="text-sm text-red-600 dark:text-red-400">{message}</p>}
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-primary-600 dark:focus:ring-primary-500 focus:ring-2"
          />
          <label htmlFor="remember" className="ml-3 text-sm text-gray-500 dark:text-gray-300">
            Remember me
          </label>
        </div>
        <a
          href="#"
          className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Forgot password?
        </a>
      </div>
      <div className="w-full">
        <button
          type="submit"
          className="min-w-full bg-blue-500 shadow-lg hover:bg-blue-600 focus:ring-1/2 focus:outline-none font-medium border rounded-lg text-white text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:border-blue-500"
        >
          {isSignup ? 'Sign up' : 'Login'}
        </button>
      </div>
      <FormToggleMessage currState={currState} setCurrState={setCurrState} />
    </form>
  );
};

export default AuthForm;