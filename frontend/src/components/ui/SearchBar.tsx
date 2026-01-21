import { Search } from 'lucide-react'
import React from 'react'

const SearchBar = () => {
  return (
    <div className='px-3 w-full '>
        <div className="w-full h-10 flex px-2 items-center rounded-xl gap-2  bg-[#F0F0F5] border-[#999999] border-1">
            <input type="text" placeholder="Search for fruits and vegetables" className="rounded-md w-full h-full p-2 outline-0 text-sm placeholder-[#999999]"/>
            <Search className='h-5 w-5 text-[#0A5445] mr-1'/>
    </div>
    </div>
  )
}

export default SearchBar