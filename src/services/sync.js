import { pushToREST, pullFromREST, pushToFirebase, pullFromFirebase } from './cloud';
import { getSettings } from './settings';

// Datasets to sync (storage keys)
export const DATASETS = [
  'finance:expenses',
  'finance:budgets',
  'finance:savings',
  'gj:goals',
  'gj:entries',
  'wellness:moods',
  'xp:total',
];

export async function syncNow() {
  const settings = await getSettings();
  if (!settings.cloudEnabled) return { ok: false, reason: 'disabled' };

  if (settings.cloudProvider === 'rest') {
    if (!settings.cloudBaseUrl) return { ok: false, reason: 'no_base_url' };
    // Pull then push
    try {
      await pullFromREST(settings.cloudBaseUrl);
      await pushToREST(settings.cloudBaseUrl, DATASETS);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e?.message || String(e) };
    }
  }

  if (settings.cloudProvider === 'firebase') {
    // Placeholder: you can pass a firestore instance here
    try {
      await pullFromFirebase(null);
      await pushToFirebase(null, DATASETS);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e?.message || String(e) };
    }
  }

  return { ok: false, reason: 'unknown_provider' };
}