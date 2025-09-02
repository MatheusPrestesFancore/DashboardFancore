// src/context/ThemeContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';

// Cria o Contexto
const ThemeContext = createContext();

// Cria o Provedor do Contexto
export const ThemeProvider = ({ children }) => {
  // Estado para o tema, buscando do localStorage ou definindo 'light' como padrão
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // useEffect para aplicar a classe no HTML e salvar no localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Função para alternar o tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook customizado para usar o contexto mais facilmente
export const useTheme = () => useContext(ThemeContext);