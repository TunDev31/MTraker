import {Bell, Search, X} from 'lucide-react'
import {  useRef } from 'react'
import React from 'react'
const SearchBar = () => {
  // const inputRef = useRef(null); // 1. Khởi tạo ref

  // const handleFocus = () => {
  //   inputRef.current.focus(); 
  // };
  return (
    <div className='flex gap-1 w-full bg-white p-1 rounded-2xl justify-between items-center'>
      <Search />
      <input
        // ref={inputRef}
        autoFocus
        type='search'
        placeholder='Search...'
        className='bg-transparent focus:outline-none md:block w-full'
      />
      
    </div>
  )
    
}

export default SearchBar