import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/constants/theme';
import GlassCard from '../../src/components/GlassCard';
import * as Haptics from 'expo-haptics';
import { logMood, listMoods } from '../../src/services/wellness';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withDelay } from 'react-native-reanimated';

export default function Wellness() {
  const { colors } = useTheme();
  const [mood, setMood] = useState('🙂');
  const [moods, setMoods] = useState([]);
  const [pattern, setPattern] = useState('box'); // box, 478, custom
  const [running, setRunning] = useState(false);

  const pulse = useSharedValue(1);

  useEffect(() => {
    (async () => setMoods(await listMoods()))();
  }, []);

  const onLogMood = async () => {
    await logMood(mood);
    setMoods(await listMoods());
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const cycle = () => {
    const p = pattern === 'box'
      ? { inhale: 4, hold1: 4, exhale: 4, hold2: 4 }
      : pattern === '478'
      ? { inhale: 4, hold1: 7, exhale: 8, hold2: 0 }
      : { inhale: 4, hold1: 4, exhale: 4, hold2: 4 };

    const s = 1000; // ms multiplier
    pulse.value = withSequence(
      withTiming(1.2, { duration: p.inhale * s }),
      withDelay(p.hold1 * s, withTiming(0.85, { duration: p.exhale * s })),
      withDelay(p.hold2 * s, withTiming(1, { duration: 600 }))
    );
  };

  useEffect(() => {
    let t;
    if (running) {
      cycle();
      t = setInterval(() => {
        Haptics.selectionAsync();
        cycle();
      }, 4000 + 4000); // rough cycle, not exact to pattern sum — visual only
    }
    return () => t && clearInterval(t);
  }, [running, pattern]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.8,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: colors.text, fontSize: 22, fontFamily: 'Orbitron' }}>Wellness</Text>
      </View>
      <GlassCard style={{ marginHorizontal: 16 }}>
        <Text style={{ color: colors.subtext }}>Mood</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          {['🙂', '😌', '😔', '😡', '😴'].map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMood(m)}
              style={{
                paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10,
                backgroundColor: mood === m ? 'rgba(0,224,255,0.12)' : 'rgba(255,255,255,0.06)',
                borderWidth: 1, borderColor: mood === m ? colors.accent : colors.border
              }}
            >
              <Text style={{ color: mood === m ? colors.accent : colors.text }}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          onPress={onLogMood}
          style={{
            marginTop: 8, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10,
            paddingVertical: 10, alignItems: 'center'
          }}
        >
          <Text style={{ color: colors.text }}>Log Mood</Text>
        </TouchableOpacity>
      </GlassCard>

      <GlassCard style={{ marginHorizontal: 16, marginTop: 16, alignItems: 'center' }}>
        <Text style={{ color: colors.subtext }}>Mindfulness Timer (Visual)</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          {[
            { id: 'box', label: 'Box 4-4-4-4' },
            { id: '478', label: '4-7-8' },
            { id: 'custom', label: 'Custom' },
          ].map((p) => (
            <TouchableOpacity
              key={p.id}
              onPress={() => setPattern(p.id)}
              style={{
                paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10,
                backgroundColor: pattern === p.id ? 'rgba(0,224,255,0.12)' : 'rgba(255,255,255,0.06)',
                borderWidth: 1, borderColor: pattern === p.id ? colors.accent : colors.border
              }}
            >
              <Text style={{ color: pattern === p.id ? colors.accent : colors.text }}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ marginTop: 12, alignItems: 'center' }}>
          <Animated.View style={[{
            width: 160, height: 160, borderRadius: 80,
            backgroundColor: 'rgba(0,224,255,0.15)',
            borderWidth: 2, borderColor: colors.accent,
            shadowColor: colors.accent, shadowOpacity: 0.7, shadowRadius: 24,
          }, style]} />
          {!running ? (
            <TouchableOpacity
              onPress={() => setRunning(true)}
              style={{
                marginTop: 12,
                backgroundColor: 'rgba(0,224,255,0.12)', borderColor: colors.accent, borderWidth: 1, borderRadius: 10,
                paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center'
              }}
            >
              <Text style={{ color: colors.accent }}>Start Session</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setRunning(false)}
              style={{
                marginTop: 12,
                backgroundColor: 'rgba(255,255,255,0.06)', borderColor: colors.border, borderWidth: 1, borderRadius: 10,
                paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center'
              }}
            >
              <Text style={{ color: colors.text }}>Stop Session</Text>
            </TouchableOpacity>
          )}
        </View>
      </GlassCard>

      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <Text style={{ color: colors.text, fontSize: 20, fontFamily: 'Rajdhani' }}>Recent Moods</Text>
      </View>
      {moods.map((m) => (
        <GlassCard key={m.id} style={{ marginHorizontal: 16, marginTop: 8 }}>
          <Text style={{ color: colors.text }}>{m.mood} — {new Date(m.date).toLocaleString()}</Text>
        </GlassCard>
      ))}
    </View>
  );
}}>Stop Session</Text>
            </TouchableOpacity>
          )}
        </View>
      </GlassCard>

      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <Text style={{ color: colors.text, fontSize: 20, fontFamily: 'Rajdhani' }}>Recent Moods</Text>
      </View>
      {moods.map((m) => (
        <GlassCard key={m.id} style={{ marginHorizontal: 16, marginTop: 8 }}>
          <Text style={{ color: colors.text }}>{m.mood} — {new Date(m.date).toLocaleString()}</Text>
        </GlassCard>
      ))}
    </View>
  );
}