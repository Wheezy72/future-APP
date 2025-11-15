import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export default function AnimatedBackground() {
  const glow = useSharedValue(0);

  React.useEffect(() => {
    glow.value = withRepeat(
      withTiming(1, { duration: 4800, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [glow]);

  const style = useAnimatedStyle(() => {
    const opacity = 0.25 + glow.value * 0.35;
    const scale = 1 + glow.value * 0.08;
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return <Animated.View pointerEvents="none" style={[styles.bg, style]} />;
}

const styles = StyleSheet.create({
  bg: {
    position: 'absolute',
    top: -80,
    left: -80,
    right: -80,
    bottom: -80,
    backgroundColor: '#0b0f14',
    // subtle radial via layered shadows
    shadowColor: '#00e0ff',
    shadowOpacity: 0.35,
    shadowRadius: 120,
  },
});