import React, { useState } from 'react';
import { Home, ShoppingBag, User } from 'lucide-react';
import TabItem from '../components/navigation/TabItem';

type Tab = 'home' | 'cart' | 'profile';

const BottomNav: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <nav className="fixed bottom- bg-[#F0F0F5] h-[50px] w-full flex justify-between items-center pl-[20px] pr-[20px]">
      <TabItem 
        label="Home" 
        icon={Home} 
        isActive={activeTab === 'home'} 
        onClick={() => setActiveTab('home')} 
      />
      <TabItem 
        label="Cart" 
        icon={ShoppingBag} 
        isActive={activeTab === 'cart'} 
        onClick={() => setActiveTab('cart')} 
      />
      <TabItem 
        label="Profile" 
        icon={User} 
        isActive={activeTab === 'profile'} 
        onClick={() => setActiveTab('profile')} 
      />
    </nav>
  );
};

export default BottomNav;