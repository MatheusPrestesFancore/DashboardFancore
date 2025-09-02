// src/components/ThemeToggle.jsx

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-6 w-6" /> // Se o tema é light, mostra o ícone de LUA para mudar para dark
      ) : (
        <SunIcon className="h-6 w-6" /> // Se o tema é dark, mostra o ícone de SOL para mudar para light
      )}
    </button>
  );
};

export default ThemeToggle;