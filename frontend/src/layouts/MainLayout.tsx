import { Outlet } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import BottomNav from './BottomNav';


 
const MainLayout = () => {
  return (
    <div className='' >
      <HomePage />
      <Outlet />
      <BottomNav />
    </div>
  )
}

export default MainLayout