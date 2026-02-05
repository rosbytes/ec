import React, { useState } from 'react';
import { Home, ShoppingBag, User } from 'lucide-react';
import TabItem from '../components/navigation/TabItem';
import { useNavigate } from 'react-router-dom';

type Tab = 'home' | 'cart' | 'profile'; 

const BottomNav: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 bg-secondary h-13 w-full flex justify-around items-center gap-2 ">
      <TabItem 
        label="Home" 
        icon={Home} 
        isActive={activeTab === 'home'} 
        onClick={() => {setActiveTab('home');
          navigate("/home")
        }} 
      />
      <TabItem 
        label="Cart" 
        icon={ShoppingBag} 
        isActive={activeTab === 'cart'} 
        onClick={() => {setActiveTab('cart');
          navigate("/cart");
          }
        } 
      />
      <TabItem 
        label="Profile" 
        icon={User} 
        isActive={activeTab === 'profile'} 
        onClick={() => {
          setActiveTab('profile');
          navigate("/profile");
        }
        } 
      />
    </nav>
  );
};

export default BottomNav;