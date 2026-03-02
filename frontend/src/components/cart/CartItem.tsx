import React from 'react'

import { IndianRupee, ChevronDown } from 'lucide-react'
import QuantitySelector from '../product/QuantitySelector'
import OfferCouponsAndPromo from './OfferCouponsAndPromo'

const CartItem = () => {
  return (
    <div className="flex flex-col gap-2 mt-3">
        <div className="w-full h-10 rounded-md flex items-center">
          <div className="w-1/2 h-full flex gap-2">
            <img src="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt='' className="h-full  aspect-square rounded-md"/>
            <div className="">
              <div className="flex items-center ">
                <h1 className="
              text-text-2">Mango/ आम</h1>
              </div>
              <div className="flex gap-2">
                <h1 className="text-text-1 flex items-center text-primary"><IndianRupee size={12}/>40</h1>
                <button className="text-[#999999] text-text-1 flex items-center" >
                  500 gm <ChevronDown size={15}/>
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center w-1/2 h-full justify-end">
            <QuantitySelector />
          </div>
          <div/>
        </div>
        
      </div>
  )
}

export default CartItem