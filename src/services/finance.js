import { getItem, setItem } from './storage';

const KEY_EXPENSES = 'finance:expenses';
const KEY_BUDGETS = 'finance:budgets';
const KEY_SAVINGS = 'finance:savings';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export async function listExpenses() {
  const items = (await getItem(KEY_EXPENSES, [])) || [];
  // sort desc by date
  return items.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function addExpense({ amount, category = 'General', note = '', date = new Date().toISOString() }) {
  const items = await listExpenses();
  const e = { id: uid(), amount: Number(amount), category, note, date };
  items.push(e);
  await setItem(KEY_EXPENSES, items);
  return e;
}

export async function deleteExpense(id) {
  const items = await listExpenses();
  const next = items.filter((e) => e.id !== id);
  await setItem(KEY_EXPENSES, next);
}

export async function listBudgets() {
  return (await getItem(KEY_BUDGETS, {})) || {};
}

export async function setBudget(category, amount) {
  const budgets = await listBudgets();
  budgets[category] = Number(amount);
  await setItem(KEY_BUDGETS, budgets);
  return budgets;
}

export async function listSavings() {
  return (await getItem(KEY_SAVINGS, [])) || [];
}

export async function addSavingsGoal({ name, target }) {
  const list = await listSavings();
  const g = { id: uid(), name, target: Number(target), saved: 0 };
  list.push(g);
  await setItem(KEY_SAVINGS, list);
  return g;
}

export async function contributeToSavings(id, amount) {
  const list = await listSavings();
  const idx = list.findIndex((g) => g.id === id);
  if (idx >= 0) {
    list[idx].saved = Number(list[idx].saved) + Number(amount);
    await setItem(KEY_SAVINGS, list);
  }
}

export function getCategoryTotalsForMonth(expenses) {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const map = new Map();
  for (const e of expenses) {
    const d = new Date(e.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      map.set(e.category, (map.get(e.category) || 0) + Number(e.amount));
    }
  }
  return Array.from(map.entries()).map(([category, value]) => ({ category, value }));
}

export function getMonthlyTrend(expenses) {
  // last 6 months totals
  const now = new Date();
  const points = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${d.getMonth() + 1}/${String(d.getFullYear()).slice(-2)}`;
    let total = 0;
    for (const e of expenses) {
      const ed = new Date(e.date);
      if (ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear()) {
        total += Number(e.amount);
      }
    }
    points.push({ label, value: total });
  }
  return points;
}