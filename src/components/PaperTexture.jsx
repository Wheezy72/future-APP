import React from 'react';
import { View } from 'react-native';
import { Svg, Rect, Line } from 'react-native-svg';

export default function PaperTexture() {
  return (
    <View style={{ position: 'absolute', top: 8, left: 8, right: 8, bottom: 8, opacity: 0.08 }}>
      <Svg width="100%" height="100%">
        <Rect x="0" y="0" width="100%" height="100%" fill="#fff" />
        {[...Array(20)].map((_, i) => (
          <Line key={i} x1={i * 12} y1="0" x2={i * 12} y2="100%" stroke="#000" strokeWidth="1" opacity="0.08" />
        ))}
      </Svg>
    </View>
  );
}