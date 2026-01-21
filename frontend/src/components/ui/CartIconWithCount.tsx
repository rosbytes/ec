import { ShoppingBag } from 'lucide-react'
import React from 'react'

const CartIconWithCount = () => {
  return (
    <div >
        <button className='border-accent-01 h-full w-full border rounded-[25px] flex justify-center items-center p-3'>
            <ShoppingBag/>
        </button>
    </div>
  )
}

export default CartIconWithCount