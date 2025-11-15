import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem(key, defaultValue = null) {
  try {
    const v = await AsyncStorage.getItem(key);
    return v != null ? JSON.parse(v) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export async function setItem(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key) {
  await AsyncStorage.removeItem(key);
}

// Backup/restore
export async function exportJSON(keys) {
  const out = {};
  for (const k of keys) {
    out[k] = await getItem(k, null);
  }
  return out;
}

export async function importJSON(obj) {
  const entries = Object.entries(obj || {});
  for (const [k, v] of entries) {
    await setItem(k, v);
  }
}