import { getItem, setItem } from './storage';

const KEY_MOODS = 'wellness:moods';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export async function listMoods() {
  const list = (await getItem(KEY_MOODS, [])) || [];
  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function logMood(mood) {
  const list = await listMoods();
  const m = { id: uid(), mood, date: new Date().toISOString() };
  list.push(m);
  await setItem(KEY_MOODS, list);
  return m;
}