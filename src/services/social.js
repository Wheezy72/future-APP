import { getItem, setItem } from './storage';

const KEY_PARTNERS = 'social:partners';
const KEY_FEED = 'social:feed';
const KEY_CHALLENGES = 'social:challenges';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export async function listPartners() {
  return (await getItem(KEY_PARTNERS, [])) || [];
}

export async function addPartnerByCode(code) {
  const list = await listPartners();
  const name = `Partner ${code.slice(-4)}`;
  const p = { id: uid(), name, code };
  list.push(p);
  await setItem(KEY_PARTNERS, list);
  await addFeed({ type: `Connected: ${name}` });
  return p;
}

export async function listFeed() {
  const list = (await getItem(KEY_FEED, [])) || [];
  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function addFeed({ type }) {
  const list = await listFeed();
  list.push({ id: uid(), type, date: new Date().toISOString() });
  await setItem(KEY_FEED, list);
}

export async function sendNudge(partnerId) {
  const partners = await listPartners();
  const p = partners.find((x) => x.id === partnerId);
  await addFeed({ type: `Nudge sent to ${p?.name || 'Partner'}` });
  return true;
}

export async function listChallenges() {
  return (await getItem(KEY_CHALLENGES, [])) || [];
}

export async function addChallenge(title) {
  const list = await listChallenges();
  const c = { id: uid(), title, completed: false };
  list.push(c);
  await setItem(KEY_CHALLENGES, list);
  await addFeed({ type: `Challenge created: ${title}` });
  return c;
}

export async function completeChallenge(id) {
  const list = await listChallenges();
  const idx = list.findIndex((c) => c.id === id);
  if (idx >= 0) {
    list[idx].completed = true;
    await setItem(KEY_CHALLENGES, list);
    await addFeed({ type: `Challenge completed: ${list[idx].title}` });
  }
}