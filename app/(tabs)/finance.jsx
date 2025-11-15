import React, { useEffect, useMemo, useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/constants/theme';
import GlassCard from '../../src/components/GlassCard';
import ThemedText from '../../src/components/ThemedText';
import * as Haptics from 'expo-haptics';
import {
  listExpenses,
  addExpense,
  deleteExpense,
  listBudgets,
  setBudget,
  listSavings,
  addSavingsGoal,
  contributeToSavings,
  getCategoryTotalsForMonth,
  getMonthlyTrend,
} from '../../src/services/finance';
import { Svg, Rect, Line } from 'react-native-svg';

function BarChart({ data = [], width = 320, height = 120, color = '#00e0ff' }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barWidth = Math.max(6, Math.floor(width / (data.length * 2 || 1)));
  return (
    <Svg width={width} height={height}>
      {data.map((d, i) => {
        const h = Math.round((d.value / max) * (height - 16));
        return (
          <Rect
            key={i}
            x={8 + i * (barWidth + 8)}
            y={height - h - 8}
            width={barWidth}
            height={h}
            fill={color}
            opacity={0.8}
            rx={4}
          />
        );
      })}
      <Line x1="0" y1={height - 6} x2={width} y2={height - 6} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    </Svg>
  );
}

export default function Finance() {
  const { colors } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [savings, setSavings] = useState([]);

  // form states
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [note, setNote] = useState('');

  const categories = useMemo(() => {
    const base = new Set(['General', 'Food', 'Transport', 'Bills', 'Entertainment', 'Health']);
    expenses.forEach((e) => base.add(e.category));
    return Array.from(base);
  }, [expenses]);

  useEffect(() => {
    (async () => {
      const e = await listExpenses();
      setExpenses(e);
      const b = await listBudgets();
      setBudgets(b || {});
      const s = await listSavings();
      setSavings(s || []);
    })();
  }, []);

  const onAddExpense = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    await addExpense({ amount: amt, category, note });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const e = await listExpenses();
    setExpenses(e);
    setAmount('');
    setNote('');
  };

  const onDeleteExpense = async (id) => {
    await deleteExpense(id);
    Haptics.selectionAsync();
    const e = await listExpenses();
    setExpenses(e);
  };

  const setBudgetForCategory = async () => {
    const bAmt = parseFloat(amount);
    if (!bAmt || bAmt <= 0) return;
    await setBudget(category, bAmt);
    const b = await listBudgets();
    setBudgets(b || {});
    setAmount('');
  };

  const addSavings = async () => {
    const target = parseFloat(amount);
    if (!target || target <= 0) return;
    await addSavingsGoal({ name: note || 'Goal', target });
    const s = await listSavings();
    setSavings(s || []);
    setAmount('');
    setNote('');
  };

  const contribute = async (id) => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    await contributeToSavings(id, amt);
    const s = await listSavings();
    setSavings(s || []);
    setAmount('');
  };

  const categoryTotals = useMemo(() => getCategoryTotalsForMonth(expenses), [expenses]);
  const monthlyTrend = useMemo(() => getMonthlyTrend(expenses), [expenses]);

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16 }}
      data={expenses}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <ThemedText variant="heading" style={{ color: colors.text, fontSize: 22, marginBottom: 12 }}>
            Expenses
          </ThemedText>

          <GlassCard>
            <ThemedText style={{ color: colors.subtext, marginBottom: 8 }}>Add Expense</ThemedText>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                placeholder="Amount"
                placeholderTextColor={colors.subtext}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                style={{
                  flex: 1, color: colors.text, backgroundColor: colors.card, borderColor: colors.border,
                  borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, fontFamily: 'Rajdhani'
                }}
              />
              <TextInput
                placeholder="Category"
                placeholderTextColor={colors.subtext}
                value={category}
                onChangeText={setCategory}
                style={{
                  flex: 1, color: colors.text, backgroundColor: colors.card, borderColor: colors.border,
                  borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, fontFamily: 'Rajdhani'
                }}
              />
            </View>
            <TextInput
              placeholder="Note"
              placeholderTextColor={colors.subtext}
              value={note}
              onChangeText={setNote}
              style={{
                marginTop: 8, color: colors.text, backgroundColor: colors.card, borderColor: colors.border,
                borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, fontFamily: 'Rajdhani'
              }}
            />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <TouchableOpacity
                onPress={onAddExpense}
                style={{
                  flex: 1, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10,
                  paddingVertical: 10, alignItems: 'center'
                }}
              >
                <ThemedText style={{ color: colors.text }}>Add</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={setBudgetForCategory}
                style={{
                  flex: 1, backgroundColor: 'rgba(0,224,255,0.12)', borderColor: colors.accent, borderWidth: 1, borderRadius: 10,
                  paddingVertical: 10, alignItems: 'center'
                }}
              >
                <ThemedText style={{ color: colors.accent }}>Set Budget</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addSavings}
                style={{
                  flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderColor: colors.border, borderWidth: 1, borderRadius: 10,
                  paddingVertical: 10, alignItems: 'center'
                }}
              >
                <ThemedText style={{ color: colors.text }}>New Savings Goal</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCategory(c)}
                  style={{
                    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10,
                    backgroundColor: category === c ? 'rgba(0,224,255,0.12)' : 'rgba(255,255,255,0.06)',
                    borderWidth: 1, borderColor: category === c ? colors.accent : colors.border
                  }}
                >
                  <ThemedText style={{ color: category === c ? colors.accent : colors.text }}>{c}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>

          <GlassCard style={{ marginTop: 16 }}>
            <ThemedText style={{ color: colors.subtext, marginBottom: 6 }}>Budgets (This Month)</ThemedText>
            {Object.keys(budgets || {}).length === 0 && (
              <ThemedText style={{ color: colors.subtext }}>No budgets set.</ThemedText>
            )}
            {Object.entries(budgets || {}).map(([cat, amt]) => {
              const spent = categoryTotals.find((x) => x.category === cat)?.value || 0;
              const pct = Math.min(100, Math.round((spent / amt) * 100));
              return (
                <View key={cat} style={{ marginVertical: 6 }}>
                  <ThemedText style={{ color: colors.text }}>{cat}: <ThemedText variant="mono" style={{ color: colors.text }}>{spent.toFixed(2)}</ThemedText> / <ThemedText variant="mono" style={{ color: colors.text }}>{amt.toFixed(2)}</ThemedText></ThemedText>
                  <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden', marginTop: 4 }}>
                    <View style={{ width: `${pct}%`, height: 8, backgroundColor: colors.accent }} />
                  </View>
                </View>
              );
            })}
          </GlassCard>

          <GlassCard style={{ marginTop: 16 }}>
            <ThemedText style={{ color: colors.subtext, marginBottom: 6 }}>Analytics</ThemedText>
            <ThemedText style={{ color: colors.text }}>By Category</ThemedText>
            <BarChart
              data={categoryTotals.map((c) => ({ label: c.category, value: c.value }))}
              width={320}
              height={120}
              color={colors.accent}
            />
            <ThemedText style={{ color: colors.text, marginTop: 8 }}>Monthly Trend</ThemedText>
            <BarChart
              data={monthlyTrend.map((m) => ({ label: m.label, value: m.value }))}
              width={320}
              height={120}
              color="#8ea0b4"
            />
          </GlassCard>

          <ThemedText style={{ color: colors.text, fontSize: 20, marginTop: 18 }}>Recent</ThemedText>
        </>
      }
      renderItem={({ item }) => (
        <GlassCard style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <ThemedText style={{ color: colors.text, fontSize: 16 }}>{item.category}</ThemedText>
              <ThemedText style={{ color: colors.subtext, fontSize: 12 }}>{new Date(item.date).toLocaleString()}</ThemedText>
              {item.note ? <ThemedText style={{ color: colors.subtext, marginTop: 4 }}>{item.note}</ThemedText> : null}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <ThemedText variant="mono" style={{ color: colors.text, fontSize: 18 }}>{item.amount.toFixed(2)}</ThemedText>
              <TouchableOpacity onPress={() => onDeleteExpense(item.id)} style={{ marginTop: 8 }}>
                <Ionicons name="trash" size={18} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        </GlassCard>
      )}
      ListFooterComponent={
        <>
          <ThemedText style={{ color: colors.text, fontSize: 20, marginTop: 18 }}>Savings</ThemedText>
          {savings.length === 0 && (
            <GlassCard style={{ marginTop: 10 }}>
              <ThemedText style={{ color: colors.subtext }}>No savings goals yet.</ThemedText>
            </GlassCard>
          )}
          {savings.map((g) => {
            const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
            return (
              <GlassCard key={g.id} style={{ marginTop: 10 }}>
                <ThemedText style={{ color: colors.text }}>{g.name}</ThemedText>
                <ThemedText style={{ color: colors.subtext }}>
                  <ThemedText variant="mono">{g.saved.toFixed(2)}</ThemedText> / <ThemedText variant="mono">{g.target.toFixed(2)}</ThemedText>
                </ThemedText>
                <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden', marginTop: 4 }}>
                  <View style={{ width: `${pct}%`, height: 8, backgroundColor: colors.success }} />
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                  <TextInput
                    placeholder="Contribution"
                    placeholderTextColor={colors.subtext}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    style={{
                      flex: 1, color: colors.text, backgroundColor: colors.card, borderColor: colors.border,
                      borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, fontFamily: 'Rajdhani'
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => contribute(g.id)}
                    style={{
                      backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10,
                      paddingHorizontal: 16, justifyContent: 'center'
                    }}
                  >
                    <ThemedText style={{ color: colors.text }}>Contribute</ThemedText>
                  </TouchableOpacity>
                </View>
              </GlassCard>
            );
          })}
        </>
      }
    />
  );
}