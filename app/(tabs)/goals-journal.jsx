import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { useTheme } from '../../src/constants/theme';
import GlassCard from '../../src/components/GlassCard';
import {
  listGoals,
  addGoal,
  incrementGoalProgress,
  listEntries,
  addEntry,
} from '../../src/services/goalsJournal';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

export default function GoalsJournal() {
  const { colors } = useTheme();
  const [goals, setGoals] = useState([]);
  const [entries, setEntries] = useState([]);

  // goal form
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('10');
  const [goalCategory, setGoalCategory] = useState('General');

  // journal form
  const [journalText, setJournalText] = useState('');
  const [journalMood, setJournalMood] = useState('🙂');
  const [journalImage, setJournalImage] = useState(null);

  useEffect(() => {
    (async () => {
      setGoals(await listGoals());
      setEntries(await listEntries());
    })();
  }, []);

  const onAddGoal = async () => {
    const target = parseInt(goalTarget, 10) || 10;
    await addGoal({ title: goalTitle || 'New Goal', target, category: goalCategory });
    setGoals(await listGoals());
    setGoalTitle('');
    setGoalTarget('10');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onIncrementGoal = async (id) => {
    await incrementGoalProgress(id);
    setGoals(await listGoals());
    Haptics.selectionAsync();
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled && res.assets?.[0]) {
      setJournalImage(res.assets[0].uri);
    }
  };

  const onAddEntry = async () => {
    if (!journalText.trim()) return;
    await addEntry({ text: journalText, mood: journalMood, imageUri: journalImage });
    setEntries(await listEntries());
    setJournalText('');
    setJournalMood('🙂');
    setJournalImage(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16 }}
      data={goals}
      keyExtractor={(g) => g.id}
      ListHeaderComponent={
        <>
          <Text style={{ color: colors.text, fontSize: 22, fontFamily: 'Orbitron', marginBottom: 12 }}>Goals</Text>
          <GlassCard>
            <TextInput
              placeholder="Goal Title"
              placeholderTextColor={colors.subtext}
              value={goalTitle}
              onChangeText={setGoalTitle}
              style={{
                color: colors.text, backgroundColor: colors.card, borderColor: colors.border,
                borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8
              }}
            />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TextInput
                placeholder="Target"
                placeholderTextColor={colors.subtext}
                keyboardType="numeric"
                value={goalTarget}
                onChangeText={setGoalTarget}
                style={{
                  flex: 1, color: colors.text, backgroundColor: colors.card, borderColor: colors.border,
                  borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8
                }}
              />
              <TextInput
                placeholder="Category"
                placeholderTextColor={colors.subtext}
                value={goalCategory}
                onChangeText={setGoalCategory}
                style={{
                  flex: 1, color: colors.text, backgroundColor: colors.card, borderColor: colors.border,
                  borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8
                }}
              />
            </View>
            <TouchableOpacity
              onPress={onAddGoal}
              style={{
                marginTop: 8, backgroundColor: 'rgba(0,224,255,0.12)', borderColor: colors.accent, borderWidth: 1, borderRadius: 10,
                paddingVertical: 10, alignItems: 'center'
              }}
            >
              <Text style={{ color: colors.accent }}>Add Goal</Text>
            </TouchableOpacity>
          </GlassCard>

          <Text style={{ color: colors.text, fontSize: 22, fontFamily: 'Orbitron', marginTop: 16 }}>Journal</Text>
          <GlassCard>
            <TextInput
              placeholder="Write something..."
              placeholderTextColor={colors.subtext}
              value={journalText}
              onChangeText={setJournalText}
              multiline
              style={{
                color: colors.text, backgroundColor: colors.card, borderColor: colors.border,
                borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10, minHeight: 80,
                fontSize: 16
              }}
            />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, alignItems: 'center' }}>
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10,
                  paddingHorizontal: 12, paddingVertical: 8
                }}
              >
                <Text style={{ color: colors.text }}>Attach Photo</Text>
              </TouchableOpacity>
              <TextInput
                placeholder="Mood (🙂, 😌, 😔)"
                placeholderTextColor={colors.subtext}
                value={journalMood}
                onChangeText={setJournalMood}
                style={{
                  flex: 1, color: colors.text, backgroundColor: colors.card, borderColor: colors.border,
                  borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8
                }}
              />
              <TouchableOpacity
                onPress={onAddEntry}
                style={{
                  backgroundColor: 'rgba(0,224,255,0.12)', borderColor: colors.accent, borderWidth: 1, borderRadius: 10,
                  paddingHorizontal: 12, paddingVertical: 8
                }}
              >
                <Text style={{ color: colors.accent }}>Save</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          <Text style={{ color: colors.text, fontSize: 20, fontFamily: 'Rajdhani', marginTop: 14 }}>Your Goals</Text>
        </>
      }
      renderItem={({ item }) => {
        const pct = Math.min(100, Math.round((item.progress / item.target) * 100));
        return (
          <GlassCard style={{ marginTop: 10 }}>
            <Text style={{ color: colors.text }}>{item.title}</Text>
            <Text style={{ color: colors.subtext }}>{item.progress} / {item.target}</Text>
            <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden', marginTop: 4 }}>
              <View style={{ width: `${pct}%`, height: 8, backgroundColor: colors.success }} />
            </View>
            <TouchableOpacity
              onPress={() => onIncrementGoal(item.id)}
              style={{
                marginTop: 8, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10,
                paddingVertical: 8, alignItems: 'center'
              }}
            >
              <Text style={{ color: colors.text }}>+1 Progress</Text>
            </TouchableOpacity>
          </GlassCard>
        );
      }}
      ListFooterComponent={
        <>
          <Text style={{ color: colors.text, fontSize: 20, fontFamily: 'Rajdhani', marginTop: 14 }}>Journal Entries</Text>
          {entries.map((e) => (
            <GlassCard key={e.id} style={{ marginTop: 10 }}>
              <Text style={{ color: colors.text, fontSize: 16 }}>{e.text}</Text>
              <Text style={{ color: colors.subtext, marginTop: 4 }}>{e.mood} — {new Date(e.date).toLocaleString()}</Text>
              {e.imageUri ? (
                <View style={{ marginTop: 8, alignSelf: 'flex-start' }}>
                  <Image source={{ uri: e.imageUri }} style={{ width: 160, height: 120, borderRadius: 6 }} />
                </View>
              ) : null}
            </GlassCard>
          ))}
        </>
      }
    />
  );
}