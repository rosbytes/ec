import { ArrowLeft, Delete, MapPin, MapPinned, MapPinPen, MapPinPlus, SquarePen, Trash2 } from 'lucide-react'
import React from 'react'
import Button from '../components/ui/Button'

const AddressPage = () => {
  return (
    <div className='px-4'>
      <div className='h-16 flex'>
        <div className='flex items-center gap-3 w-1/2'>
          <ArrowLeft />
        <h1 className='text-xl font-bold'>Addresses</h1>
        </div>
        <div className='w-1/2  flex justify-end items-center'>
          <button><MapPinPlus /></button>
        </div>
      </div>
      
      <div className='h-10 flex gap-3 my-2'>
        <div className='flex justify-center items-center w-1/10 '>
          <MapPinned />
        </div>
        <div className='flex flex-col justify-center w-full'>
          <h1 className='font-semibold'>Home</h1>
          <p className='text-[#999999] text-text-1'>Royal Platinum, Jagatpura, Jaipur</p>
        </div>
        <div className='flex gap-3 justify-center items-center w-2/10'>
          <button><SquarePen /></button>
          <button><Trash2 /></button>
        </div>
      </div>
      
    </div>
    
  )
}

export default AddressPage