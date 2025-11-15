import { getItem, setItem } from './storage';

const KEY_SETTINGS = 'app:settings';

const defaults = {
  cloudEnabled: false,
  cloudBaseUrl: '',
  cloudProvider: 'rest', // 'rest' | 'firebase'
};

export async function getSettings() {
  const s = await getItem(KEY_SETTINGS, null);
  return { ...defaults, ...(s || {}) };
}

export async function saveSettings(patch) {
  const cur = await getSettings();
  const next = { ...cur, ...(patch || {}) };
  await setItem(KEY_SETTINGS, next);
  return next;
}