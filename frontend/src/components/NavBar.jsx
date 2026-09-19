import { Plus } from 'lucide-react'
import React from 'react'

const NavBar = ({ setIsOpenForm }) => {
  return (
    <div className='fixed z-100 bottom-0 h-20 w-full bg-white '>
          <div onClick={() => setIsOpenForm(true)}
          className='flex justify-center items-center absolute top-0 left-[50%] transform -translate-x-1/2  bg-(--Green-color) h-16 w-16 rounded-full border-2 border-(--Green-color) shadow-lg'>
             <button  className='bg-(--Green-color) rounded-full'>
              <Plus  className='text-white' />
             </button>
          </div>
        </div>
  )
}

export default NavBar