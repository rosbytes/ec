import DeliveryLocationHeader from '../components/address/DeliveryLocationHeader'
import SearchBar from '../components/ui/SearchBar'
import AdBanner from '../components/ui/AdBanner'
import ProductListingPage from './ProductListingPage'

const HomePage = () => {
  return (
    <div>
      <DeliveryLocationHeader />
      <SearchBar />
      <AdBanner />
      <ProductListingPage />
    </div>
  )
}

export default HomePage