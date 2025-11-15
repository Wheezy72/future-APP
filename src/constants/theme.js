import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEMES = {
  dark: {
    name: 'dark',
    colors: {
      bg: '#0b0f14',
      card: 'rgba(20,26,33,0.75)',
      text: '#cde0ff',
      subtext: '#8ea0b4',
      accent: '#00e0ff',
      border: 'rgba(255,255,255,0.06)',
      success: '#4ade80',
      warning: '#f59e0b',
      danger: '#ef4444',
      blob1: '#0ea5e9',
      blob2: '#22d3ee',
      blob3: '#7c3aed',
    },
  },
  calm: {
    name: 'calm',
    colors: {
      bg: '#0f172a',
      card: 'rgba(30,41,59,0.75)',
      text: '#e2e8f0',
      subtext: '#94a3b8',
      accent: '#34d399',
      border: 'rgba(255,255,255,0.08)',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
      blob1: '#34d399',
      blob2: '#60a5fa',
      blob3: '#22d3ee',
    },
  },
};

const ThemeContext = createContext({
  ...THEMES.dark,
  toggleTheme: () => {},
  setTheme: (_name) => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const system = Appearance.getColorScheme();
  const defaultTheme = 'dark';
  const [name, setName] = useState(defaultTheme);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('app:theme');
      if (saved && THEMES[saved]) setName(saved);
    })();
  }, []);

  const setTheme = async (n) => {
    const key = THEMES[n] ? n : defaultTheme;
    setName(key);
    await AsyncStorage.setItem('app:theme', key);
  };

  const toggleTheme = async () => {
    const next = name === 'dark' ? 'calm' : 'dark';
    await setTheme(next);
  };

  const value = useMemo(
    () => ({
      ...THEMES[name],
      toggleTheme,
      setTheme,
    }),
    [name]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}