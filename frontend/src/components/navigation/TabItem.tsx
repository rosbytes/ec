import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface NavTabProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

const TabItem: React.FC<NavTabProps> = ({ label, icon: Icon, isActive, onClick }) => {
  return (
    <button onClick={onClick} className="w-[100px] h-[50px] bg-green-600">
      <div className="h-[50px] w-[100px] flex flex-col items-center justify-center">
            <Icon className={`transition-colors duration-200 ${isActive ? 'text-[#0A5445] stroke-4' : `text-black`}`}/>
            <span className={`font-semibold ${isActive ? `text-[#0A5445]` : `text-black`}`}>
                {label}
            </span>
      </div>
    </button>
  );
};

export default TabItem;