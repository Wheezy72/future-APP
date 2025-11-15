import React, { useEffect, useState } from 'react';
import { View, Switch, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useTheme } from '../../src/constants/theme';
import GlassCard from '../../src/components/GlassCard';
import ThemedText from '../../src/components/ThemedText';
import { getBiometricsEnabled, setBiometricsEnabled, getPIN, setPIN } from '../../src/services/auth';
import { useRouter } from 'expo-router';
import { getSettings, saveSettings } from '../../src/services/settings';
import { syncNow } from '../../src/services/sync';
import { exportBackup, importBackupFromPath, listBackups } from '../../src/services/backup';

export default function Settings() {
  const { colors } = useTheme();
  const router = useRouter();
  const [bioEnabled, setBioEnabledState] = useState(false);
  const [pin, setPinState] = useState('');
  const [cloudEnabled, setCloudEnabled] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [backups, setBackups] = useState([]);

  useEffect(() => {
    (async () => {
      const b = await getBiometricsEnabled();
      setBioEnabledState(!!b);
      const p = await getPIN();
      setPinState(p || '');
      const s = await getSettings();
      setCloudEnabled(!!s.cloudEnabled);
      setBaseUrl(s.cloudBaseUrl || '');
      setBackups(await listBackups());
    })();
  }, []);

  const savePIN = async () => {
    if (!pin || pin.length !== 4) return;
    await setPIN(pin);
    Alert.alert('PIN', 'PIN updated.');
  };

  const saveCloud = async () => {
    const provider = baseUrl === 'firebase' ? 'firebase' : 'rest';
    await saveSettings({ cloudEnabled, cloudBaseUrl: baseUrl, cloudProvider: provider });
    Alert.alert('Cloud', 'Settings saved.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ padding: 16 }}>
       <<ThemedText variant="heading" style={{ color: colors.text, fontSize: 22 }}>Settin</</ThemedText>
    </>
V_codeieneww</>

      <GlassCard style={{ marginHorizontal: 16 }}>
        <Text style={{ color: colors.subtext, fontFamily: 'Rajdhani' }}>Security</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: colors.text, fontFamily: 'Rajdhani' }}>Biometrics</Text>
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
            <ThemedText style={{ color: colors.accent }}>Save</ThemedText>
          </TouchableOpacity>
        </View>
      </GlassCard>

      <GlassCard style={{ marginHorizontal: 16, marginTop: 16 }}>
        <Text style={{ color: colors.subtext, fontFamily: 'Rajdhani' }}>Cloud Sync</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: colors.text, fontFamily: 'Rajdhani' }}>Enabled</Text>
          <Switch
            value={cloudEnabled}
            onValueChange={(v) => setCloudEnabled(v)}
            thumbColor={cloudEnabled ? colors.accent : '#fff'}
          />
        </View>
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
            onPress={saveCloud}
            style={{
              backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10,
              paddingHorizontal: 12, justifyContent: 'center'
            }}
          >
            <ThemedText style={{ color: colors.text }}>Save Cloud</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const res = await syncNow();
              Alert.alert('Sync', res.ok ? 'Sync completed.' : ('Could not sync: ' + (res.error || res.reason)));
            }}
            style={{
              backgroundColor: 'rgba(0,224,255,0.12)', borderColor: colors.accent, borderWidth: 1, borderRadius: 10,
              paddingHorizontal: 12, justifyContent: 'center'
            }}
          >
            <ThemedText style={{ color: colors.accent }}>Sync Now</ThemedText>
          </TouchableOpacity>
        </View>
      </GlassCard>

      <GlassCard style={{ marginHorizontal: 16, marginTop: 16 }}>
        <ThemedText style={{ color: colors.subtext }}>Backup</ThemedText>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TouchableOpacity
            onPress={async () => {
              const { path, name } = await exportBackup();
              setBackups(await listBackups());
              Alert.alert('Backup', `Exported to:\n${path}`);
            }}
            style={{
              backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10,
              paddingHorizontal: 12, justifyContent: 'center'
            }}
          >
            <ThemedText style={{ color: colors.text }}>Export JSON</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const files = await listBackups();
              if (!files.length) {
                Alert.alert('Backup', 'No backups found.');
                return;
              }
              const latest = files.sort().pop();
              const path = `${require('expo-file-system').documentDirectory}${latest}`;
              await importBackupFromPath(path);
              Alert.alert('Backup', 'Imported latest backup.');
            }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)', borderColor: colors.border, borderWidth: 1, borderRadius: 10,
              paddingHorizontal: 12, justifyContent: 'center'
            }}
          >
            <ThemedText style={{ color: colors.text }}>Import Latest</ThemedText>
          </TouchableOpacity>
        </View>
        {backups.length > 0 && (
          <ThemedText style={{ color: colors.subtext, marginTop: 8 }}>
            Backups: {backups.length} files in app documents.
          </ThemedText>
        )}
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