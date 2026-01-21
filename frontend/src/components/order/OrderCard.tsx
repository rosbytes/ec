import React from 'react'
import { ChevronRight, CircleCheck, IndianRupee } from 'lucide-react'

const OrderCard = () => {
  return (
    <div>
      <div className='h-31 w-full bg-[#EFE2DD] rounded-xl flex flex-col p-3 gap-2'>
        <div className='flex items-center gap-2 justify-between'>
         <div className='flex gap-2 items-center'>
          <CircleCheck size={16} />
         <h1 className='font-semibold
         '>Arriving Tomorrow</h1>
         </div>
         <button><ChevronRight /></button>
        </div>
       <div className='flex items-center justify-start gap-3 '>
         <div className='h-10 w-10'>
            <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className='aspect-square rounded-md'/>
        </div>
         <div className='h-10 w-10'>
            <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className='aspect-square rounded-md'/>
        </div>
         <div className='h-10 w-10'>
            <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className='aspect-square rounded-md'/>
        </div>
       </div>
        <div className='flex items-center gap-2 justify-between text-[#444444] text-text-3'>
          Placed on 04 Feb, 09:04 PM
          <p className='flex items-center gap-0.5'><IndianRupee size={10}/> 439.00</p>
        </div>
      </div>
    </div>
  )
}

export default OrderCard