import { getItem, setItem } from './storage';

const KEY_GOALS = 'gj:goals';
const KEY_ENTRIES = 'gj:entries';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export async function listGoals() {
  return (await getItem(KEY_GOALS, [])) || [];
}

export async function addGoal({ title, target = 10, category = 'General' }) {
  const list = await listGoals();
  const g = { id: uid(), title, target: Number(target), category, progress: 0, reminders: [] };
  list.push(g);
  await setItem(KEY_GOALS, list);
  return g;
}

export async function incrementGoalProgress(id) {
  const list = await listGoals();
  const idx = list.findIndex((g) => g.id === id);
  if (idx >= 0) {
    list[idx].progress = Number(list[idx].progress) + 1;
    await setItem(KEY_GOALS, list);
  }
}

export async function listEntries() {
  const list = (await getItem(KEY_ENTRIES, [])) || [];
  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function addEntry({ text, mood = '🙂', imageUri = null }) {
  const list = await listEntries();
  const e = { id: uid(), text, mood, imageUri, date: new Date().toISOString() };
  list.push(e);
  await setItem(KEY_ENTRIES, list);
  return e;
}