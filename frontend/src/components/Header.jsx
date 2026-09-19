import React, { useEffect, useRef } from 'react'
import SearchBar from './SearchBar'
import { Bell, CircleDollarSign, CircleUserRound, Search } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
const Header = () => {
  
  return (
    <header className='flex w-full items-center justify-between  border-b-2
     border-b-black bg-white/80  backdrop-blur-md z-50 '>
      
      
      <div className='flex items-center gap-1 group cursor-pointer'>
        <CircleDollarSign className='w-7 h-7 text-(--Green-color) transition-transform group-hover:scale-105' />
        <h1 className='text-xl font-bold tracking-tight text-black bg-clip-text group-hover:scale-105 transition-transform'>
          MTracker
        </h1>
      </div>
      
      
      
      

      {/* KHU VỰC TÌM KIẾM & THÔNG BÁO */}
      <div className='flex items-center gap-1 justify-between flex-row'>
        
        
        <button className='relative p-2 shrink-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'>
          <Bell className='w-5 h-5' />
          <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-950'></span>
        </button>
        <CircleUserRound color="black" className="w-7 h-7" />
      </div>

    </header>
  )
}

export default Header