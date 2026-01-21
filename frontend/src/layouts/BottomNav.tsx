import React, { useState } from 'react';
import { Home, ShoppingBag, User } from 'lucide-react';
import TabItem from '../components/navigation/TabItem';

type Tab = 'home' | 'cart' | 'profile'; 

const BottomNav: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <nav className="fixed bottom-0 bg-secondary h-13 w-full flex justify-around items-center gap-2 ">
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