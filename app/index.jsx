import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ThemedText from '../src/components/ThemedText';

export default function Startup() {
  const router = useRouter();

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const t = setTimeout(() => {
      router.replace('/pin-entry');
    }, 1200);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f14', alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="planet" size={64} color="#00e0ff" />
      <ThemedText variant="heading" style={{ color: '#cde0ff', marginTop: 12, fontSize: 20 }}>
        Future
      </ThemedText>
      <ActivityIndicator color="#00e0ff" style={{ marginTop: 16 }} />
    </View>
  );
}