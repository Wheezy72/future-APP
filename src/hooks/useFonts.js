import { useEffect, useState } from 'react';

/**
 * Use system fonts to avoid bundling local binaries.
 * You can later integrate @expo-google-fonts or add local assets.
 */
export default function useFonts() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return loaded;
}