import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '../src/constants/theme';
import { getPIN, setPIN, getBiometricsEnabled, setBiometricsEnabled } from '../src/services/auth';
import Keypad from '../src/components/Keypad';
import * as Haptics from 'expo-haptics';

export default function PinEntry() {
  const router = useRouter();
  const { colors } = useTheme();
  const [storedPin, setStoredPinState] = useState(null);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('enter'); // 'enter' or 'create'
  const [bioAvailable, setBioAvailable] = useState(false);
  const [bioEnabled, setBioEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const pin = await getPIN();
      setStoredPinState(pin);
      setMode(pin ? 'enter' : 'create');

      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBioAvailable(compatible && enrolled);

      const enabled = await getBiometricsEnabled();
      if (enabled === null) {
        // default: enable biometrics when available
        await setBiometricsEnabled(compatible && enrolled);
        setBioEnabled(compatible && enrolled);
      } else {
        setBioEnabled(Boolean(enabled));
      }

      // Auto prompt biometrics on enter mode
      if (pin && compatible && enrolled && (enabled ?? true)) {
        try {
          const res = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Unlock with Biometrics',
          });
          if (res.success) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.replace('/(tabs)/home');
          }
        } catch (e) {
          // ignore
        }
      }
    })();
  }, [router]);

  useEffect(() => {
    if (input.length === 4) {
      if (mode === 'create') {
        (async () => {
          await setPIN(input);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert('PIN Set', 'Your PIN has been created.');
          router.replace('/(tabs)/home');
        })();
      } else if (mode === 'enter') {
        if (storedPin && input === storedPin) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.replace('/(tabs)/home');
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert('Incorrect PIN', 'Please try again.');
          setInput('');
        }
      }
    }
  }, [input, mode, storedPin, router]);

  const onDigit = (d) => {
    if (d === 'del') {
      setInput((s) => s.slice(0, -1));
    } else if (input.length < 4) {
      setInput((s) => s + d);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="shield-checkmark" size={56} color={colors.accent} />
      <Text style={{ color: colors.text, marginTop: 12, fontSize: 18, fontFamily: 'Orbitron' }}>
        {mode === 'create' ? 'Create 4-digit PIN' : 'Enter PIN'}
      </Text>

      <View style={{ flexDirection: 'row', marginTop: 24, gap: 12 }}>
        {[0,1,2,3].map((i) => (
          <View key={i} style={{
            width: 16, height: 16, borderRadius: 8,
            backgroundColor: input.length > i ? colors.accent : 'rgba(255,255,255,0.15)'
          }} />
        ))}
      </View>

      <Keypad onPress={onDigit} style={{ marginTop: 28 }} />

      {bioAvailable && (
        <TouchableOpacity
          onPress={async () => {
            try {
              const res = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock with Biometrics',
              });
              if (res.success) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.replace('/(tabs)/home');
              }
            } catch (e) {}
          }}
          style={{
            marginTop: 18,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Ionicons name="finger-print" size={20} color={colors.accent} />
          <Text style={{ color: colors.text }}>
            Unlock with Biometrics
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}