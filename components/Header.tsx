
import React from 'react';
import { Theme } from '../types';
import { IconButton } from './IconButton';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="flex justify-between items-center py-4">
      <h1 className="text-3xl font-bold text-[--primary] dark:text-[--primary-dark]">
        Fare Calc Pro
      </h1>
      <IconButton onClick={toggleTheme} aria-label="Toggle theme">
        <span className="material-symbols-outlined">
          {theme === 'light' ? 'dark_mode' : 'light_mode'}
        </span>
      </IconButton>
    </header>
  );
};
