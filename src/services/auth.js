import { getItem, setItem } from './storage';

const KEY_PIN = 'auth:pin';
const KEY_BIO = 'auth:biometrics';

export async function getPIN() {
  return (await getItem(KEY_PIN, null));
}

export async function setPIN(pin) {
  // store as string "dddd"
  await setItem(KEY_PIN, String(pin));
}

export async function getBiometricsEnabled() {
  const v = await getItem(KEY_BIO, null);
  return v;
}

export async function setBiometricsEnabled(enabled) {
  await setItem(KEY_BIO, !!enabled);
}