import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/constants/theme';
import GlassCard from '../../src/components/GlassCard';
import ThemedText from '../../src/components/ThemedText';
import { getTodayStats } from '../../src/services/data';
import * as Haptics from 'expo-haptics';
import { syncNow } from '../../src/services/sync';

export default function Home() {
  const { colors } = useTheme();
  const [stats, setStats] = useState({ goals: 0, entries: 0, expenses: 0, xpLevel: { xp: 0, level: 1 } });

  useEffect(() => {
    (async () => {
      const s = await getTodayStats();
      setStats(s);
      const res = await syncNow();
      if (!res.ok && res.reason !== 'disabled') {
      }
    })();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <ThemedText variant="heading" style={{ color: colors.text, fontSize: 22, marginBottom: 12 }}>
        Today
      </ThemedText>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <GlassCard>
          <ThemedText style={{ color: colors.subtext }}>Goals</ThemedText>
          <ThemedText variant="mono" style={{ color: colors.text, fontSize: 20 }}>{stats.goals}</ThemedText>
        </GlassCard>
        <GlassCard>
          <ThemedText style={{ color: colors.subtext }}>Entries</ThemedText>
          <ThemedText variant="mono" style={{ color: colors.text, fontSize: 20 }}>{stats.entries}</ThemedText>
        </GlassCard>
        <GlassCard>
          <ThemedText style={{ color: colors.subtext }}>Expenses</ThemedText>
          <ThemedText variant="mono" style={{ color: colors.text, fontSize: 20 }}>{stats.expenses}</ThemedText>
        </GlassCard>
      </View>

      <GlassCard style={{ marginTop: 16 }}>
        <ThemedText style={{ color: colors.subtext }}>XP</ThemedText>
        <ThemedText style={{ color: colors.text, fontSize: 20 }}>
          Level {stats.xpLevel.level} — {stats.xpLevel.xp} XP
        </ThemedText>
      </GlassCard>

      <GlassCard style={{ marginTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="bulb" color={colors.accent} size={18} />
          <ThemedText style={{ color: colors.text, fontSize: 16 }}>
            Smart Insight
          </ThemedText>
        </View>
        <ThemedText style={{ color: colors.subtext, marginTop: 8 }}>
          Try a 4–7–8 breathing session after logging a high expense to reduce stress.
        </ThemedText>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={{
            marginTop: 10, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
            backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignSelf: 'flex-start'
          }}
        >
          <ThemedText style={{ color: colors.text }}>Schedule Mindfulness</ThemedText>
        </TouchableOpacity>
      </GlassCard>

      <GlassCard style={{ marginTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="cloud-upload" color={colors.accent} size={18} />
          <ThemedText style={{ color: colors.text, fontSize: 16 }}>
            Cloud Sync
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={async () => {
            const res = await syncNow();
            Alert.alert('Sync', res.ok ? 'Sync completed.' : 'Could not sync: ' + (res.error || res.reason));
          }}
          style={{
            marginTop: 8,
            backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10,
            paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center', alignSelf: 'flex-start'
          }}
        >
          <ThemedText style={{ color: colors.text }}>Sync Now</ThemedText>
        </TouchableOpacity>
      </GlassCard>
    </ScrollView>
  );
}