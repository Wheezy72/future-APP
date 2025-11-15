import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../../src/constants/theme';
import GlassCard from '../../src/components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import {
  listPartners,
  addPartnerByCode,
  sendNudge,
  listFeed,
  listChallenges,
  addChallenge,
  completeChallenge,
} from '../../src/services/social';
import * as Haptics from 'expo-haptics';

export default function Social() {
  const { colors } = useTheme();
  const [partners, setPartners] = useState([]);
  const [feed, setFeed] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [code, setCode] = useState('');
  const [challengeTitle, setChallengeTitle] = useState('');

  useEffect(() => {
    (async () => {
      setPartners(await listPartners());
      setFeed(await listFeed());
      setChallenges(await listChallenges());
    })();
  }, []);

  const connectPartner = async () => {
    if (!code.trim()) return;
    await addPartnerByCode(code.trim());
    setPartners(await listPartners());
    setCode('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const nudge = async (partnerId) => {
    await sendNudge(partnerId);
    setFeed(await listFeed());
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const addChal = async () => {
    if (!challengeTitle.trim()) return;
    await addChallenge(challengeTitle.trim());
    setChallenges(await listChallenges());
    setChallengeTitle('');
  };

  const completeChal = async (id) => {
    await completeChallenge(id);
    setChallenges(await listChallenges());
  };

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16 }}
      data={partners}
      keyExtractor={(p) => p.id}
      ListHeaderComponent={
        <>
          <Text style={{ color: colors.text, fontSize: 22, fontFamily: 'Orbitron' }}>Social</Text>
          <GlassCard style={{ marginTop: 10 }}>
            <Text style={{ color: colors.subtext }}>Connect Partner</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TextInput
                placeholder="Connection Code"
                placeholderTextColor={colors.subtext}
                value={code}
                onChangeText={setCode}
                style={{
                  flex: 1, color: colors.text, backgroundColor: colors.card, borderColor: colors.border,
                  borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8
                }}
              />
              <TouchableOpacity
                onPress={connectPartner}
                style={{
                  backgroundColor: 'rgba(0,224,255,0.12)', borderColor: colors.accent, borderWidth: 1, borderRadius: 10,
                  paddingHorizontal: 12, justifyContent: 'center'
                }}
              >
                <Text style={{ color: colors.accent }}>Connect</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          <Text style={{ color: colors.text, fontSize: 20, fontFamily: 'Rajdhani', marginTop: 16 }}>Partners</Text>
        </>
      }
      renderItem={({ item }) => (
        <GlassCard style={{ marginTop: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: colors.text }}>{item.name}</Text>
              <Text style={{ color: colors.subtext }}>{item.code}</Text>
            </View>
            <TouchableOpacity onPress={() => nudge(item.id)}>
              <Ionicons name="send" size={18} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </GlassCard>
      )}
      ListFooterComponent={
        <>
          <Text style={{ color: colors.text, fontSize: 20, fontFamily: 'Rajdhani', marginTop: 16 }}>Challenges</Text>
          <GlassCard style={{ marginTop: 8 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                placeholder="New challenge"
                placeholderTextColor={colors.subtext}
                value={challengeTitle}
                onChangeText={setChallengeTitle}
                style={{
                  flex: 1, color: colors.text, backgroundColor: colors.card, borderColor: colors.border,
                  borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8
                }}
              />
              <TouchableOpacity
                onPress={addChal}
                style={{
                  backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10,
                  paddingHorizontal: 12, justifyContent: 'center'
                }}
              >
                <Text style={{ color: colors.text }}>Add</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {challenges.map((c) => (
            <GlassCard key={c.id} style={{ marginTop: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: colors.text }}>{c.title}</Text>
                {!c.completed ? (
                  <TouchableOpacity onPress={() => completeChal(c.id)}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="checkmark-done" size={20} color={colors.success} />
                )}
              </View>
            </GlassCard>
          ))}

          <Text style={{ color: colors.text, fontSize: 20, fontFamily: 'Rajdhani', marginTop: 16 }}>Activity Feed</Text>
          {feed.map((f) => (
            <GlassCard key={f.id} style={{ marginTop: 8 }}>
              <Text style={{ color: colors.text }}>{f.type}</Text>
              <Text style={{ color: colors.subtext }}>{new Date(f.date).toLocaleString()}</Text>
            </GlassCard>
          ))}
        </>
      }
    />
  );
}