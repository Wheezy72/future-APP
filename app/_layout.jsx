import React from 'react';
import { Tabs, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AnimatedBackground from '../src/components/AnimatedBackground';
import useFonts from '../src/hooks/useFonts';
import { ThemeProvider } from '../src/constants/theme';
import { View } from 'react-native';

export default function RootLayout() {
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0b0f14' }} />
    );
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
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'rgba(10,14,20,0.85)',
            borderTopColor: 'rgba(255,255,255,0.06)',
          },
          tabBarActiveTintColor: '#00e0ff',
          tabBarInactiveTintColor: '#8ea0b4',
        }}
      >
        <Tabs.Screen
          name="(tabs)/home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/manage"
          options={{
            title: 'Manage',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}