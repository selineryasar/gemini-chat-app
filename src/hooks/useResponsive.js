// src/hooks/useResponsive.js
import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Bileşen yüklendiğinde başlangıç durumunu ayarla

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return { sidebarOpen, toggleSidebar };
};
