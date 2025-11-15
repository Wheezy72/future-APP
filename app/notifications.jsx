import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../src/constants/theme';
import GlassCard from '../src/components/GlassCard';
import ThemedText from '../src/components/ThemedText';
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
          <ThemedText variant="heading" style={{ color: colors.text, fontSize: 22 }}>Notifications</ThemedText>
          <GlassCard style={{ marginTop: 10 }}>
            <TouchableOpacity
              onPress={scheduleExample}
              style={{
                backgroundColor: 'rgba(0,224,255,0.12)', borderColor: colors.accent, borderWidth: 1, borderRadius: 10,
                paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center'
              }}
            >
              <ThemedText style={{ color: colors.accent }}>Schedule Example Habit</ThemedText>
            </TouchableOpacity>
          </GlassCard>
        </>
      }
      renderItem={({ item }) => (
        <GlassCard style={{ marginTop: 10 }}>
          <ThemedText style={{ color: colors.text }}>{item.content?.title || 'Reminder'}</ThemedText>
          <ThemedText variant="mono" style={{ color: colors.subtext }}>{item.identifier}</ThemedText>
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
            <ThemedText style={{ color: colors.text }}>Cancel</ThemedText>
          </TouchableOpacity>
        </GlassCard>
      )}
    />
  );
}