import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export default function useFonts() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await Font.loadAsync({
          Orbitron: require('../../assets/fonts/Orbitron-Regular.ttf'),
          Rajdhani: require('../../assets/fonts/Rajdhani-Regular.ttf'),
          ShareTechMono: require('../../assets/fonts/ShareTechMono-Regular.ttf'),
          Caveat: require('../../assets/fonts/Caveat-Regular.ttf'),
        });
        if (mounted) setLoaded(true);
      } catch (e) {
        // Fallback to system fonts if custom not found
        setLoaded(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return loaded;
}