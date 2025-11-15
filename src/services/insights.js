import { listExpenses } from './finance';
import { listMoods } from './wellness';

/**
 * Simple placeholder: correlate high spending days with mood logs.
 */
export async function getSmartInsights() {
  const expenses = await listExpenses();
  const moods = await listMoods();
  const highSpendDays = new Set();
  for (const e of expenses) {
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const sum = expenses
      .filter((x) => {
        const dx = new Date(x.date);
        return dx.getFullYear() === d.getFullYear() && dx.getMonth() === d.getMonth() && dx.getDate() === d.getDate();
      })
      .reduce((acc, x) => acc + Number(x.amount), 0);
    if (sum > 100) highSpendDays.add(key);
  }
  const moodOnSpend = moods.filter((m) => {
    const d = new Date(m.date);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    return highSpendDays.has(key);
  });
  return {
    summary: `Found ${moodOnSpend.length} mood logs on high-spend days. Consider scheduling mindfulness after expenses.`,
  };
}