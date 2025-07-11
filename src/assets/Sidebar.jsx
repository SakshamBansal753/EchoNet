import React from 'react'

const Sidebar = () => {
  return (
    <div className='text-white text-5xl p-10'>
        <h1 className='fonticon mb-5 flex '>
            <img src='Echo.PNG' className='w-[320px]'/>
        </h1>
        <nav className='nav flex flex-col py-7 gap-6 text-3xl '>
            <div className='hover:bg-gray-900 p-3'>
            <i class="ri-home-4-fill text-3xl mr-4"></i>Home
            </div>
            <div className='hover:bg-gray-900 p-3'>
                 <i class="ri-search-2-line text-3xl mr-4"></i>Search
            </div>
             
        </nav>

    </div>
  )
}

export default Sidebar