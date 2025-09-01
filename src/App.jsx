import React from 'react'
import { Route, Routes } from 'react-router'
import Login from './pages/Login/LoginPage'
import Chat from './pages/Chat/Chat'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/chat' element={<Chat/>}/>
      </Routes>
    </>
  )
}

export default App