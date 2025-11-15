import { exportJSON, importJSON } from './storage';

export async function pushToREST(baseUrl, datasets) {
  const data = await exportJSON(datasets);
  const res = await fetch(`${baseUrl}/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Push failed');
  return true;
}

export async function pullFromREST(baseUrl) {
  const res = await fetch(`${baseUrl}/sync`, { method: 'GET' });
  if (!res.ok) throw new Error('Pull failed');
  const data = await res.json();
  await importJSON(data);
  return true;
}

// Firebase Firestore stubs (document sync/default)
export async function pushToFirebase(firestore, datasets) {
  const data = await exportJSON(datasets);
  // expect firestore to be initialized and point to doc sync/default
  const ref = firestore.collection('sync').doc('default');
  await ref.set(data, { merge: true });
  return true;
}

export async function pullFromFirebase(firestore) {
  const ref = firestore.collection('sync').doc('default');
  const snap = await ref.get();
  if (snap.exists) {
    await importJSON(snap.data());
  }
  return true;
}