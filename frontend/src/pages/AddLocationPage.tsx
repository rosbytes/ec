import React from 'react'
import { ArrowLeft } from 'lucide-react';
import location from './location.svg';
import { MapPinPlus } from 'lucide-react';
import Button from '../components/ui/Button';
const AddLocationPage = () => {
  return (
    <div className='p-4 items-center justify-center flex flex-col  h-full '>
      <div className='h-10 items-center flex  w-full '>
        <ArrowLeft/>
      </div>
      <div className='items-center flex flex-col gap-5 justify-center mt-15'>
        <img src={location} alt="" className="aspect-square" />
        <h1 className='text-xl font-bold text-[#232323] '>Add Your Location</h1>
      </div>
      <div className='w-full mt-3'>
        <input type="text" placeholder='Search for area, street name ...' className='w-full mt-3 border rounded-xl h-10 px-3 border-border placeholder-border' />
      </div>
      <div className='h-10 flex gap-1 mt-1 text-accent-01 items-center w-full'>
        <MapPinPlus size={15}/>
        <h1>Use my current location</h1>
      </div>
      <div className='text-balance text-text-1 flex items-end justify-center text-center mx-3 min-h-50 mb-20 text-[#444444]'>
        <p>
        Let us check your location to see if our veggies can make it to your doorstep. Fingers crossed!
      </p>
      </div>
      <div className='fixed bottom-0  bg-secondary w-full py-5'>
        <Button label={"Continue"} bgcolor={"secondary"} textColor={"accent-01"} />
      </div>
    </div>
  )
}

export default AddLocationPage