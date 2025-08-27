import React, { useState } from 'react'

const LeftSidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(true)
  return (
    <>
      <div className='h-screen w-1/5'>
        <nav className='h-full flex flex-col bg-white border-r shadow-sm'>
          <div className='p-4 pb-2 flex justify-between items-center'>
            

          </div>
        </nav>
      </div>
    </>
  )
}

export default LeftSidebar