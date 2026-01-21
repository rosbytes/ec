import React from 'react'
import PageHeader from '../components/navigation/PageHeader'
import { ChevronRight, CircleCheck, IndianRupee } from 'lucide-react'
import OrderCard from '../components/order/OrderCard'

const OrderHistoryPage = () => {
  return (
    <div className='px-4'>
      <PageHeader label={"Your Orders"} />
      <OrderCard />
    </div>
  )
}

export default OrderHistoryPage