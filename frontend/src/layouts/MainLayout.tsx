import React from 'react'
import BottomNav from './BottomNav'
import ProductsListingPage from '../pages/ProductListingPage'
import SearchBar from '../components/ui/SearchBar'
import Header from './Header';
import AdBanner from '../components/ui/AdBanner';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import AddLocationPage from '../pages/AddLocationPage';
import WelcomePage from '../pages/WelComePage';
import AuthPage from '../pages/AuthPage';
import ProfileHomePage from '../pages/ProfileHomePage';
import AddressPage from '../pages/AddressPage';
import OrderHistoryPage from '../pages/OrderHistoryPage';
import OrderDetailsPage from '../pages/OrderDetailsPage';

 
const MainLayout = () => {
  return (
    <div className='' >
      <OrderDetailsPage />
      {/* <OrderHistoryPage /> */}
      {/* <AddressPage /> */}
      {/* <ProfileHomePage /> */}
      {/* <AuthPage /> */}
      {/* <WelcomePage /> */}
    {/* <AddLocationPage /> */}
      {/* <CartPage/>
      <Header/>
      <SearchBar/>
      <AdBanner/>
      <ProductsListingPage/>
      <BottomNav /> */}
      
    </div>
  )
}

export default MainLayout