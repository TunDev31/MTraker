import React from 'react'

const Footer = () => {
  return (
    <footer className='w-full shrink-0 bg-(--bg-secondary) p-1 text-center text-sm text-gray-500 gap-1 flex justify-center items-center'>
      &copy; 2026 MoneyM. All rights reserved.
      <span>Dev by</span>
      <a href="https://github.com/TunDev31" target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>
        TunDev31
      </a>
    </footer>
  )
}

export default Footer