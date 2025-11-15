import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../src/constants/theme';
import GlassCard from '../src/components/GlassCard';
import { listScheduled, cancelScheduled, scheduleDaily } from '../src/services/notifications';

export default function NotificationsCenter() {
  const { colors } = useTheme();
  const [items, setItems] = useState([]);

  const refresh = async () => {
    setItems(await listScheduled());
  };

  useEffect(() => {
    refresh();
  }, []);

  const scheduleExample = async () => {
    await scheduleDaily({ id: 'habit', hour: 9, minute: 0, title: 'Habit Reminder', body: 'Time to work on your goal.' });
    refresh();
  };

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16 }}
      data={items}
      keyExtractor={(i) => i.identifier}
      ListHeaderComponent={
        <>
          <Text style={{ color: colors.text, fontSize: 22, fontFamily: 'Orbitron' }}>Notifications</Text>
          <GlassCard style={{ marginTop: 10 }}>
            <TouchableOpacity
              onPress={scheduleExample}
              style={{
                backgroundColor: 'rgba(0,224,255,0.12)', borderColor: colors.accent, borderWidth: 1, borderRadius: 10,
                paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center'
              }}
            >
              <Text style={{ color: colors.accent }}>Schedule Example Habit</Text>
            </TouchableOpacity>
          </GlassCard>
        </>
      }
      renderItem={({ item }) => (
        <GlassCard style={{ marginTop: 10 }}>
          <Text style={{ color: colors.text }}>{item.content?.title || 'Reminder'}</Text>
          <Text style={{ color: colors.subtext }}>{item.identifier}</Text>
          <TouchableOpacity
            onPress={async () => {
              await cancelScheduled(item.identifier);
              refresh();
            }}
            style={{
              marginTop: 6,
              backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10,
              paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center'
            }}
          >
            <Text style={{ color: colors.text }}>Cancel</Text>
          </TouchableOpacity>
        </GlassCard>
      )}
    />
  );
}