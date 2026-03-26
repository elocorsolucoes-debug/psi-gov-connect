import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';

export default function ChecklistSuccessScreen() {
  const colors = useColors();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={[styles.iconCircle, { backgroundColor: colors.success + '20' }]}>
          <Text style={styles.icon}>✅</Text>
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Questionário enviado!
        </Text>
        <Text style={[styles.desc, { color: colors.muted }]}>
          Suas respostas foram registradas com sucesso. Obrigado por contribuir com a melhoria do ambiente de trabalho.
        </Text>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={() => router.replace('/checklists' as any)}
        >
          <Text style={styles.btnText}>Ver outros questionários</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnSecondary, { borderColor: colors.border }]}
          onPress={() => router.replace('/(tabs)' as any)}
        >
          <Text style={[styles.btnSecondaryText, { color: colors.foreground }]}>Ir para o início</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16,
  },
  iconCircle: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: 48 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  desc: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  btn: {
    borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32,
    alignItems: 'center', width: '100%',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnSecondary: {
    borderRadius: 12, paddingVertical: 13, paddingHorizontal: 32,
    alignItems: 'center', width: '100%', borderWidth: 1.5,
  },
  btnSecondaryText: { fontSize: 15, fontWeight: '600' },
});
