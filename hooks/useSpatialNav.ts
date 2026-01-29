
import { useState, useEffect, useCallback } from 'react';

export const useSpatialNav = (totalItems: number, onSelect: (index: number) => void, onBack?: () => void) => {
  const [index, setIndex] = useState(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        setIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'ArrowDown':
        setIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
        break;
      case 'Enter':
        onSelect(index);
        break;
      case 'Backspace':
      case 'SoftRight':
      case 'F2':
        if (onBack) {
          e.preventDefault();
          onBack();
        }
        break;
      default:
        break;
    }
  }, [index, totalItems, onSelect, onBack]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { index, setIndex };
};
