import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import * as FileSystem from 'expo-file-system';

export default function CachedImage({ uri, style, onError }) {
  const [path, setPath] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!uri) return;
      try {
        const name = encodeURIComponent(uri);
        const localPath = `${FileSystem.cacheDirectory}${name}`;
        const info = await FileSystem.getInfoAsync(localPath);
        if (!info.exists) {
          await FileSystem.downloadAsync(uri, localPath);
        }
        if (mounted) setPath(localPath);
      } catch (e) {
        onError && onError(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [uri]);

  if (!uri) return null;
  return <Image source={{ uri: path || uri }} style={style} />;
}