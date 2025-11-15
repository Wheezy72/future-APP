import { useFonts as useGFonts } from '@expo-google-fonts/orbitron';
import { Orbitron_400Regular } from '@expo-google-fonts/orbitron';
import { useFonts as useGFontsRaj } from '@expo-google-fonts/rajdhani';
import { Rajdhani_400Regular } from '@expo-google-fonts/rajdhani';
import { useFonts as useGFontsSTM } from '@expo-google-fonts/share-tech-mono';
import { ShareTechMono_400Regular } from '@expo-google-fonts/share-tech-mono';

export default function useFonts() {
  const [orbitronLoaded] = useGFonts({ Orbitron: Orbitron_400Regular });
  const [rajdhaniLoaded] = useGFontsRaj({ Rajdhani: Rajdhani_400Regular });
  const [stmLoaded] = useGFontsSTM({ ShareTechMono: ShareTechMono_400Regular });
  return orbitronLoaded && rajdhaniLoaded && stmLoaded;
}