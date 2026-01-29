
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="bg-[#ff6b00] text-white h-7 flex items-center px-2 shadow-md z-40">
      <h1 className="text-[12px] font-bold truncate">{title}</h1>
    </div>
  );
};

export default Header;
