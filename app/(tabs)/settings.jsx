import React, { useEffect, useState } from 'react';
import { View, Text, Switch, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../../src/constants/theme';
import GlassCard from '../../src/components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { getBiometricsEnabled, setBiometricsEnabled, getPIN, setPIN } from '../../src/services/auth';
import { useRouter } from 'expo-router';

export default function Settings() {
  const { colors } = useTheme();
  const router = useRouter();
  const [bioEnabled, setBioEnabledState] = useState(false);
  const [pin, setPinState] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    (async () => {
      const b = await getBiometricsEnabled();
      setBioEnabledState(!!b);
      const p = await getPIN();
      setPinState(p || '');
    })();
  }, []);

  const savePIN = async () => {
    if (!pin || pin.length !== 4) return;
    await setPIN(pin);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: colors.text, fontSize: 22, fontFamily: 'Orbitron' }}>Settings</Text>
      </View>

      <GlassCard style={{ marginHorizontal: 16 }}>
        <Text style={{ color: colors.subtext }}>Security</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: colors.text }}>Biometrics</Text>
          <Switch
            value={bioEnabled}
            onValueChange={async (v) => {
              setBioEnabledState(v);
              await setBiometricsEnabled(v);
            }}
            thumbColor={bioEnabled ? colors.accent : '#fff'}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TextInput
            placeholder="Change PIN (4 digits)"
            placeholderTextColor={colors.subtext}
            value={pin}
            onChangeText={setPinState}
            keyboardType="number-pad"
            maxLength={4}
            style={{
              flex: 1, color: colors.text, backgroundColor: colors.card, borderColor: colors.border,
              borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8
            }}
          />
          <TouchableOpacity
            onPress={savePIN}
            style={{
              backgroundColor: 'rgba(0,224,255,0.12)', borderColor: colors.accent, borderWidth: 1, borderRadius: 10,
              paddingHorizontal: 12, justifyContent: 'center'
            }}
          >
            <Text style={{ color: colors.accent }}>Save</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>

      <GlassCard style={{ marginHorizontal: 16, marginTop: 16 }}>
        <Text style={{ color: colors.subtext }}>Cloud Sync</Text>
        <TextInput
          placeholder="Base URL (REST) or 'firebase'"
          placeholderTextColor={colors.subtext}
          value={baseUrl}
          onChangeText={setBaseUrl}
          style={{
            marginTop: 8, color: colors.text, backgroundColor: colors.card, borderColor: colors.border,
            borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8
          }}
        />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10,
              paddingHorizontal: 12, justifyContent: 'center'
            }}
          >
            <Text style={{ color: colors.text }}>Init</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10,
              paddingHorizontal: 12, justifyContent: 'center'
            }}
          >
            <Text style={{ color: colors.text }}>Push</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10,
              paddingHorizontal: 12, justifyContent: 'center'
            }}
          >
            <Text style={{ color: colors.text }}>Pull</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>

      <GlassCard style={{ marginHorizontal: 16, marginTop: 16 }}>
        <Text style={{ color: colors.subtext }}>Notifications</Text>
        <TouchableOpacity
          onPress={() => router.push('/notifications')}
          style={{
            marginTop: 8,
            backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10,
            paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center'
          }}
        >
          <Text style={{ color: colors.text }}>Open Notifications Center</Text>
        </TouchableOpacity>
      </GlassCard>
    </View>
  );
}