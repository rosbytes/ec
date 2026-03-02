import { ArrowLeft, Delete, MapPin, MapPinned, MapPinPen, MapPinPlus, SquarePen, Trash2 } from 'lucide-react'
import React from 'react'
import Button from '../components/ui/Button'
import PageHeader from '../components/navigation/PageHeader'

const AddressPage = () => {
  return (
    <div className='px-4'>
      <div className='h-16 flex justify-between'>
        <PageHeader to="/profile" label={"Addresses"} />
        <div className='w-1/4  flex justify-end items-center'>
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