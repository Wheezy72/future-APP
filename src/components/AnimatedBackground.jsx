import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../constants/theme';

export default function AnimatedBackground() {
  const { colors } = useTheme();
  const a = useSharedValue(0);
  const b = useSharedValue(0);
  const c = useSharedValue(0);

  React.useEffect(() => {
    a.value = withRepeat(withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.quad) }), -1, true);
    b.value = withRepeat(withTiming(1, { duration: 7400, easing: Easing.inOut(Easing.quad) }), -1, true);
    c.value = withRepeat(withTiming(1, { duration: 8200, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, []);

  const blob = (sv, baseScale) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: baseScale + sv.value * 0.2 }],
      opacity: 0.35 + sv.value * 0.2,
    }));

  const styleA = blob(a, 1.05);
  const styleB = blob(b, 0.95);
  const styleC = blob(c, 1.0);

  return (
    <View pointerEvents="none" style={[styles.container, { backgroundColor: colors.bg }]}>
      <Animated.View style={[styles.blob, { backgroundColor: colors.blob1, top: -120, left: -80 }, styleA]} />
      <Animated.View style={[styles.blob, { backgroundColor: colors.blob2, bottom: -140, right: -60 }, styleB]} />
      <Animated.View style={[styles.blob, { backgroundColor: colors.blob3, top: '40%', left: '20%' }, styleC]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  blob: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 200,
    filter: 'blur(60px)', // ignored on native, but we keep large radius + opacity for glow
    opacity: 0.4,
  },
});