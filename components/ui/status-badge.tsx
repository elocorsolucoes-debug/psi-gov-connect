import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusBadgeProps {
  label: string;
  color: string;
  emoji?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ label, color, emoji, size = 'sm' }: StatusBadgeProps) {
  const isLarge = size === 'md';
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color + '22',
          borderColor: color + '80',
          paddingHorizontal: isLarge ? 10 : 7,
          paddingVertical: isLarge ? 5 : 3,
        },
      ]}
    >
      {emoji && <Text style={{ fontSize: isLarge ? 13 : 11 }}>{emoji}</Text>}
      <Text
        style={[
          styles.label,
          { color, fontSize: isLarge ? 12 : 10 },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
