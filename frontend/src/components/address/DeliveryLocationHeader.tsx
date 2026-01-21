import React from 'react'
import { ArrowBigDown, ChevronDown, MapPin } from 'lucide-react'
import AddressModal from './AddressModal'   

interface DeliveryLocationHeaderProps {
    time : string,
    meridian : string,
    addressZone : string,
    city : string,  
    Zipcode : number,
}



const DeliveryLocationHeader: React.FC<DeliveryLocationHeaderProps> = (props) => {
  return (
    <div className='p-3 w-full '>
        <div className='h-10 flex items-center' >
        <div className='h-6 w-5'>
            <MapPin className='text-accent-01 stroke-3'/>
        </div>
        <div className='px-2  h-full items-center'>
            <p className='font-semibold text-sm flex'>Delivery : Tomorrow by 10 AM{props.time}{props.meridian}<ChevronDown size={20}/></p>
            <p className='text-[#444444] text-sm'>
                {props.addressZone} {props.city} {props.Zipcode}
                Pratap Nagar, Jaipur 302033
            </p>
        </div>
    </div>
    
    <AddressModal />
    </div>
  )
}

export default DeliveryLocationHeader