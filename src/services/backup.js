import * as FileSystem from 'expo-file-system';
import { exportJSON, importJSON } from './storage';
import { DATASETS } from './sync';

export async function exportBackup() {
  const data = await exportJSON(DATASETS);
  const name = `backup-${Date.now()}.json`;
  const path = `${FileSystem.documentDirectory}${name}`;
  await FileSystem.writeAsStringAsync(path, JSON.stringify(data, null, 2));
  return { path, name };
}

export async function importBackupFromPath(path) {
  const json = await FileSystem.readAsStringAsync(path);
  const data = JSON.parse(json);
  await importJSON(data);
  return true;
}

export async function listBackups() {
  const dir = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
  return dir.filter((f) => f.startsWith('backup-') && f.endsWith('.json'));
}