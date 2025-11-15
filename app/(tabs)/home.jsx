import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/constants/theme';
import GlassCard from '../../src/components/GlassCard';
import { getTodayStats } from '../../src/services/data';
import * as Haptics from 'expo-haptics';

export default function Home() {
  const { colors } = useTheme();
  const [stats, setStats] = useState({ goals: 0, entries: 0, expenses: 0, xpLevel: { xp: 0, level: 1 } });

  useEffect(() => {
    (async () => {
      const s = await getTodayStats();
      setStats(s);
    })();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ color: colors.text, fontSize: 22, fontFamily: 'Orbitron', marginBottom: 12 }}>
        Today
      </Text>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <GlassCard>
          <Text style={{ color: colors.subtext }}>Goals</Text>
          <Text style={{ color: colors.text, fontSize: 20 }}>{stats.goals}</Text>
        </GlassCard>
        <GlassCard>
          <Text style={{ color: colors.subtext }}>Entries</Text>
          <Text style={{ color: colors.text, fontSize: 20 }}>{stats.entries}</Text>
        </GlassCard>
        <GlassCard>
          <Text style={{ color: colors.subtext }}>Expenses</Text>
          <Text style={{ color: colors.text, fontSize: 20 }}>{stats.expenses}</Text>
        </GlassCard>
      </View>

      <GlassCard style={{ marginTop: 16 }}>
        <Text style={{ color: colors.subtext }}>XP</Text>
        <Text style={{ color: colors.text, fontSize: 20 }}>Level {stats.xpLevel.level} — {stats.xpLevel.xp} XP</Text>
      </GlassCard>

      <GlassCard style={{ marginTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="bulb" color={colors.accent} size={18} />
          <Text style={{ color: colors.text, fontFamily: 'Rajdhani', fontSize: 16 }}>
            Smart Insight
          </Text>
        </View>
        <Text style={{ color: colors.subtext, marginTop: 8 }}>
          Try a 4–7–8 breathing session after logging a high expense to reduce stress.
        </Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={{
            marginTop: 10, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
            backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignSelf: 'flex-start'
          }}
        >
          <Text style={{ color: colors.text }}>Schedule Mindfulness</Text>
        </TouchableOpacity>
      </GlassCard>
    </ScrollView>
  );
}