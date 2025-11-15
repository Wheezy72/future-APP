import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AnimatedBackground from '../src/components/AnimatedBackground';
import useFonts from '../src/hooks/useFonts';
import { ThemeProvider } from '../src/constants/theme';
import { View } from 'react-native';

export default function RootLayout() {
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#0b0f14' }} />;
  }

  return (
    <ThemeProvider>
      <AnimatedBackground />
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </ThemeProvider>
  );
}