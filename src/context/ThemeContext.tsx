import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types';

const themes: Theme[] = [
  {
    id: 'dark',
    name: 'Dark',
    bgGradient: 'bg-slate-900 bg-gradient-dark',
    cardBg: 'bg-slate-800',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    navBg: 'bg-slate-800/95',
    buttonBg: 'bg-slate-700',
  },
  {
    id: 'light',
    name: 'Light',
    bgGradient: 'bg-slate-50 bg-gradient-light',
    cardBg: 'bg-white',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    navBg: 'bg-white/95',
    buttonBg: 'bg-white',
  },
  {
    id: 'purple',
    name: 'Purple Dream',
    bgGradient: 'bg-purple-950 bg-gradient-purple',
    cardBg: 'bg-purple-900',
    textPrimary: 'text-purple-50',
    textSecondary: 'text-purple-200',
    navBg: 'bg-purple-900/95',
    buttonBg: 'bg-purple-800',
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    bgGradient: 'bg-cyan-950 bg-gradient-ocean',
    cardBg: 'bg-cyan-900',
    textPrimary: 'text-cyan-50',
    textSecondary: 'text-cyan-200',
    navBg: 'bg-cyan-900/95',
    buttonBg: 'bg-cyan-800',
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    bgGradient: 'bg-emerald-950 bg-gradient-emerald',
    cardBg: 'bg-emerald-900',
    textPrimary: 'text-emerald-50',
    textSecondary: 'text-emerald-200',
    navBg: 'bg-emerald-900/95',
    buttonBg: 'bg-emerald-800',
  },
  {
    id: 'rose',
    name: 'Rose Garden',
    bgGradient: 'bg-rose-950 bg-gradient-rose',
    cardBg: 'bg-rose-900',
    textPrimary: 'text-rose-50',
    textSecondary: 'text-rose-200',
    navBg: 'bg-rose-900/95',
    buttonBg: 'bg-rose-800',
  },
  {
    id: 'amber',
    name: 'Amber Sunset',
    bgGradient: 'bg-amber-950 bg-gradient-amber',
    cardBg: 'bg-amber-900',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-amber-200',
    navBg: 'bg-amber-900/95',
    buttonBg: 'bg-amber-800',
  },
];

interface ThemeContextType {
  theme: Theme;
  setThemeById: (id: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(themes[0]); // Dark theme is now first in the array

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const found = themes.find(t => t.id === savedTheme);
      if (found) setTheme(found);
    }
  }, []);

  const setThemeById = (id: string) => {
    const newTheme = themes.find(t => t.id === id);
    if (newTheme) {
      setTheme(newTheme);
      localStorage.setItem('theme', id);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemeById, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}