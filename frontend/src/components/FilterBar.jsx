import { Funnel, Search, SlidersHorizontal } from 'lucide-react'
import React from 'react'

import SearchBar from './SearchBar';

const FilterBar = () => {
    

      
  return (
    <div className='flex justify-between items-center gap-2 px-1 py-2 rounded-2xl'>
       
         <div className='flex gap-2 w-[88%] bg-white p-1 rounded-2xl justify-between items-center'>
             <SearchBar />
         </div>
       
        <button className='flex rounded-2xl p-1.5 w-[12%] justify-center border  bg-white gap-1 items-center hover:text-(--Green-color)'>  
        <SlidersHorizontal className='text-black rounded-xs  m-1' />
           
        </button>
        
    </div>
  )
}

export default FilterBar