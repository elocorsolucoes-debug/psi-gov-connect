import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';

interface ProgressBarProps {
  /** Value from 0 to 1 */
  value: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  color = '#1E88E5',
  backgroundColor = 'rgba(255,255,255,0.15)',
  height = 8,
  showLabel = false,
  label,
  animated = true,
}: ProgressBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const clamped = Math.max(0, Math.min(1, value));
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: clamped,
        duration: 700,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(clamped);
    }
  }, [value, animated, animatedWidth]);

  return (
    <View>
      {showLabel && label && (
        <Text style={[styles.label, { color }]}>{label}</Text>
      )}
      <View style={[styles.track, { backgroundColor, height, borderRadius: height / 2 }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              height,
              borderRadius: height / 2,
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
});
