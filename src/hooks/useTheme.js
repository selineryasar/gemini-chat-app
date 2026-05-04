// src/hooks/useTheme.js
import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(true);

  // Sayfa yüklendiğinde temayı belirler
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      setDarkMode(false);
    } else if (theme === "dark") {
      setDarkMode(true);
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(systemDark);
    }
  }, []);

  // `darkMode` değiştiğinde localStorage'ı ve body sınıfını günceller
  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return { darkMode, toggleTheme };
};
