import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function scheduleDaily({ id, hour, minute, title, body }) {
  await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { hour, minute, repeats: true },
    identifier: id,
  });
}

export async function listScheduled() {
  const arr = await Notifications.getAllScheduledNotificationsAsync();
  return arr;
}

export async function cancelScheduled(id) {
  return Notifications.cancelScheduledNotificationAsync(id);
}