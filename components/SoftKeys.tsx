
import React from 'react';

interface SoftKeysProps {
  left?: string;
  center?: string;
  right?: string;
}

const SoftKeys: React.FC<SoftKeysProps> = ({ left = "Options", center = "SELECT", right = "Back" }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-zinc-900 text-white flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-wider z-50">
      <div className="w-1/3 text-left overflow-hidden whitespace-nowrap">{left}</div>
      <div className="w-1/3 text-center overflow-hidden whitespace-nowrap">{center}</div>
      <div className="w-1/3 text-right overflow-hidden whitespace-nowrap">{right}</div>
    </div>
  );
};

export default SoftKeys;
