import { getItem, setItem } from './storage';
import { listExpenses } from './finance';
import { levelForXP } from '../utils/xp';

const KEY_XP = 'xp:total';

export async function getXP() {
  return (await getItem(KEY_XP, 0)) || 0;
}

export async function addXP(x) {
  const cur = await getXP();
  const next = cur + (x || 0);
  await setItem(KEY_XP, next);
  return next;
}

export async function getTodayStats() {
  const expenses = await listExpenses();
  const today = new Date();
  const isSameDay = (d) =>
    new Date(d).getFullYear() === today.getFullYear() &&
    new Date(d).getMonth() === today.getMonth() &&
    new Date(d).getDate() === today.getDate();

  const expToday = expenses.filter((e) => isSameDay(e.date));
  const xp = await getXP();
  const level = levelForXP(xp);

  return {
    goals: 0,
    entries: 0,
    expenses: expToday.length,
    xpLevel: { xp, level },
  };
}