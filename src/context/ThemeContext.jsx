import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    console.log('🎨 Thème initial:', savedTheme || 'light');
    return savedTheme || 'light';
  });

  useEffect(() => {
    console.log('🎨 Thème changé vers:', theme);
    localStorage.setItem('theme', theme);
    
    // Appliquer le thème à la racine (html) au lieu du body
    document.documentElement.setAttribute('data-theme', theme);
    
    // Aussi appliquer au body pour compatibilité
    document.body.setAttribute('data-theme', theme);
    
    // Forcer le re-render en ajoutant une classe au body
    document.body.className = `theme-${theme}`;
    
  }, [theme]);

  const toggleTheme = () => {
    console.log('�� Toggle theme appelé, thème actuel:', theme);
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('🎨 Nouveau thème:', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};