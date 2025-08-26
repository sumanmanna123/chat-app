import React, { useState } from 'react'

const Login = () => {
  const [currState, setCurrState] = useState("Login in to your account");
  return (
    <>
      <div className="bg-[url('src/assets/bg.jpg')] bg-no-repeat bg-cover bg-center h-screen flex items-center justify-center">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {currState}
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">

              {
                currState === "Create your account" ? <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                  <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your username" required="" />
                </div> : null
              }

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your email" required="" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div>
                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
              </div>

              <div className='w-full'>
                <button type="submit"
                  className="min-w-full bg-blue-500 shadow-lg shadow-blue-500/50 hover:bg-blue-600 focus:ring-1/2 focus:outline-none focus:ring-black-300 font-medium border rounded-lg text-white text-sm px-5 py-2.5 text-center">
                  {currState === "Login in to your account" ? "Login" : "Sign up"}
                </button>
              </div>



              {
                currState === "Login in to your account"
                  ? <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don’t have an account yet? <span onClick={() => setCurrState("Create your account")} className='hover:underline text-gray-800 font-medium'>Sign up</span>
                  </p>
                  : <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have account? <span onClick={() => setCurrState("Login in to your account")} className='hover:underline text-gray-800 font-medium'>Login</span>
                  </p>
              }

            </form>
          </div>
        </div>
      </div>
    </>

  )
}

export default Login