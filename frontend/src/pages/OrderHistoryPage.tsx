import PageHeader from '../components/navigation/PageHeader'
import OrderCard from '../components/order/OrderCard'
import OrderDetailsPage from './OrderDetailsPage'

const OrderHistoryPage = () => {
  return (
    <div className='px-4'>
      <PageHeader to={"/profile"} label={"Your Orders"} />
      <div className=' flex flex-col h gap-3'>
      <OrderCard />
      <OrderCard />
      <OrderCard />
      </div>
    </div>
  )
}

export default OrderHistoryPage