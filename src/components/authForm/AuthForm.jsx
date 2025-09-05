import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' 
import InputField from '../inputField/InputField'
import FormToggleMessage from '../toggleMessage/ToggleMessage'

const AuthForm = ({ currState, setCurrState }) => {
  const isSignup = currState === 'Create your account'

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate() // useNavigate hook

  const handleSubmit = (e) => {
    e.preventDefault()

    const users = JSON.parse(localStorage.getItem('users')) || []

    if (isSignup) {
      const userExists = users.find((user) => user.email === email)
      if (userExists) {
        setMessage('User already exists. Please login.')
        return
      }

      const newUser = { username, email, password }
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      localStorage.setItem('currentUser', JSON.stringify(newUser)) // Optional session
      setMessage('Signup successful! Redirecting...')
      navigate('/chat') 
    } else {
      const existingUser = users.find(
        (user) => user.email === email && user.password === password
      )
      if (!existingUser) {
        setMessage('Invalid credentials. Please try again.')
        return
      }

      localStorage.setItem('currentUser', JSON.stringify(existingUser))
      setMessage('Login successful! Redirecting...')
      navigate('/chat') 
    }

    setUsername('')
    setEmail('')
    setPassword('')
  }

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
            className="w-4 h-4 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
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
          className="min-w-full bg-blue-500 shadow-lg hover:bg-blue-600 focus:ring-1/2 focus:outline-none font-medium border rounded-lg text-white text-sm px-5 py-2.5 text-center"
        >
          {isSignup ? 'Sign up' : 'Login'}
        </button>
      </div>

      <FormToggleMessage currState={currState} setCurrState={setCurrState} />
    </form>
  )
}

export default AuthForm
