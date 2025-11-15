import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/constants/theme';
import Finance from './finance';
import GoalsJournal from './goals-journal';
import Wellness from './wellness';

const segments = ['Finance', 'Goals & Journal', 'Wellness'];

export default function Manage() {
  const { colors } = useTheme();
  const [seg, setSeg] = useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', marginTop: 12, paddingHorizontal: 12, gap: 8 }}>
        {segments.map((s, i) => (
          <TouchableOpacity
            key={s}
            onPress={() => setSeg(i)}
            style={{
              paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12,
              backgroundColor: i === seg ? 'rgba(0,224,255,0.12)' : 'rgba(255,255,255,0.06)',
              borderWidth: 1,
              borderColor: i === seg ? colors.accent : colors.border
            }}
          >
            <Text style={{ color: i === seg ? colors.accent : colors.text, fontFamily: 'Rajdhani' }}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flex: 1 }}>
        {seg === 0 && <Finance />}
        {seg === 1 && <GoalsJournal />}
        {seg === 2 && <Wellness />}
      </View>
    </View>
  );
}