import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../constants/theme';

/**
 * ThemedText: applies consistent fonts across the app.
 * - variant: 'body' (Rajdhani), 'heading' (Orbitron), 'mono' (ShareTechMono)
 */
export default function ThemedText({ children, style, variant = 'body', ...props }) {
  const fontFamily =
    variant === 'heading'
      ? 'Orbitron'
      : variant === 'mono'
      ? 'ShareTechMono'
      : 'Rajdhani';

  return (
    <Text {...props} style={[{ fontFamily }, style]}>
      {children}
    </Text>
  );
}