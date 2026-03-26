import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SectionHeaderProps {
  title: string;
  color: string;
  borderColor: string;
  marginTop?: number;
  marginBottom?: number;
  marginHorizontal?: number;
}

export function SectionHeader({
  title,
  color,
  borderColor,
  marginTop = 8,
  marginBottom = 12,
  marginHorizontal = 20,
}: SectionHeaderProps) {
  return (
    <View style={[styles.container, { marginTop, marginBottom, marginHorizontal }]}>
      <View style={[styles.line, { backgroundColor: borderColor }]} />
      <Text style={[styles.title, { color }]}>{title}</Text>
      <View style={[styles.line, { backgroundColor: borderColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
