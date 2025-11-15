export function levelForXP(xp = 0) {
  // simple curve: every 100 XP -> new level
  const level = Math.floor((xp || 0) / 100) + 1;
  return Math.max(1, level);
}

export function xpForAction(action) {
  switch (action) {
    case 'expense:add':
      return 2;
    case 'goal:complete':
      return 25;
    case 'journal:add':
      return 5;
    case 'mood:log':
      return 3;
    default:
      return 1;
  }
}