import React, { createContext, useContext } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext({
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
  },
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const scheme = Appearance.getColorScheme();
  // Could extend to light; for now keep cyberpunk-dark
  return <ThemeContext.Provider value={ThemeContext._currentValue}>{children}</ThemeContext.Provider>;
}