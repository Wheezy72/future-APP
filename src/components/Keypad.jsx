import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Keypad({ onPress, style }) {
  const { colors } = useTheme();
  const rows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['bio', '0', 'del'],
  ];
  return (
    <View style={[{ width: '100%', maxWidth: 360 }, style]}>
      {rows.map((row, idx) => (
        <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 }}>
          {row.map((k) => {
            const isAction = k === 'del' || k === 'bio';
            return (
              <TouchableOpacity
                key={k}
                onPress={() => onPress(k === 'bio' ? undefined : k)}
                style={{
                  width: 100, height: 56, borderRadius: 14,
                  backgroundColor: colors.card,
                  borderWidth: 1, borderColor: colors.border,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                {isAction ? (
                  k === 'del' ? (
                    <Ionicons name="backspace" size={20} color={colors.subtext} />
                  ) : (
                    <Ionicons name="finger-print" size={20} color={colors.subtext} />
                  )
                ) : (
                  <Text style={{ color: colors.text, fontSize: 18, fontFamily: 'Rajdhani' }}>{k}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}