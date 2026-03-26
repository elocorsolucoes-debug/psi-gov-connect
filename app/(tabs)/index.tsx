import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { hasMinRole } from '../../src/types';

// ─── Role-based dashboard components ────────────────────────

function ServidorDashboard({ colors }: { colors: any }) {
  return (
    <View>
      {/* CTA DDE */}
      <TouchableOpacity
        style={[styles.ctaCard, { backgroundColor: colors.secondary }]}
        onPress={() => router.push('/(tabs)/dde' as any)}
      >
        <Text style={styles.ctaEmoji}>😊</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.ctaTitle, { color: '#fff' }]}>Como você está hoje?</Text>
          <Text style={[styles.ctaSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
            Registre seu bem-estar diário
          </Text>
        </View>
        <Text style={{ color: '#fff', fontSize: 20 }}>›</Text>
      </TouchableOpacity>

      {/* Checklists CTA */}
      <TouchableOpacity
        style={[styles.ctaCard, { backgroundColor: colors.primary, marginTop: 12 }]}
        onPress={() => router.push('/checklists' as any)}
      >
        <Text style={styles.ctaEmoji}>📋</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.ctaTitle, { color: '#fff' }]}>Questionários</Text>
          <Text style={[styles.ctaSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
            Responda os questionários ativos
          </Text>
        </View>
        <Text style={{ color: '#fff', fontSize: 20 }}>›</Text>
      </TouchableOpacity>

      {/* Benefits */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Benefícios em destaque</Text>
      <View style={styles.row}>
        {[
          { emoji: '🎟️', title: 'Cupom Saúde', desc: 'Válido até 30/04' },
          { emoji: '📅', title: 'Evento PSI', desc: 'Próx. 05/04' },
        ].map((b, i) => (
          <View key={i} style={[styles.benefitCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={{ fontSize: 28 }}>{b.emoji}</Text>
            <Text style={[styles.benefitTitle, { color: colors.foreground }]}>{b.title}</Text>
            <Text style={[styles.benefitDesc, { color: colors.muted }]}>{b.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function GestorDashboard({ colors }: { colors: any }) {
  const kpis = [
    { label: 'Total de Relatos', value: '—', icon: '📋' },
    { label: 'Criticidade Média', value: '—', icon: '⚡' },
    { label: 'Checklists Ativos', value: '—', icon: '✅' },
  ];
  return (
    <View>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Painel Operacional</Text>
      {kpis.map((k, i) => (
        <View key={i} style={[styles.kpiCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={{ fontSize: 24 }}>{k.icon}</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.kpiLabel, { color: colors.muted }]}>{k.label}</Text>
            <Text style={[styles.kpiValue, { color: colors.foreground }]}>{k.value}</Text>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={[styles.ctaCard, { backgroundColor: colors.primary, marginTop: 8 }]}
        onPress={() => router.push('/checklists' as any)}
      >
        <Text style={styles.ctaEmoji}>📊</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.ctaTitle, { color: '#fff' }]}>Ver Questionários</Text>
          <Text style={[styles.ctaSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>Acompanhe respostas agregadas</Text>
        </View>
        <Text style={{ color: '#fff', fontSize: 20 }}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

function AdminDashboard({ colors }: { colors: any }) {
  return (
    <View>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Visão Estratégica</Text>

      {/* IMVP */}
      <View style={[styles.imvpCard, { backgroundColor: colors.primary }]}>
        <Text style={styles.imvpLabel}>IMVP</Text>
        <Text style={styles.imvpValue}>—</Text>
        <Text style={styles.imvpSubtitle}>Índice Municipal de Vulnerabilidade Psicossocial</Text>
      </View>

      {/* PGR Status */}
      <View style={[styles.kpiCard, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 12 }]}>
        <Text style={{ fontSize: 24 }}>🛡️</Text>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.kpiLabel, { color: colors.muted }]}>Status PGR</Text>
          <Text style={[styles.kpiValue, { color: colors.foreground }]}>Em monitoramento</Text>
        </View>
      </View>

      <View style={styles.row}>
        {[
          { icon: '📋', label: 'Relatos', color: colors.accent },
          { icon: '✅', label: 'Checklists', color: colors.secondary },
          { icon: '📈', label: 'Planos', color: colors.success },
        ].map((item, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={{ fontSize: 24 }}>{item.icon}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>{item.label}</Text>
            <Text style={[styles.statValue, { color: item.color }]}>—</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Main Home Screen ────────────────────────────────────────

export default function HomeScreen() {
  const colors = useColors();
  const { profile } = useAuth();

  const role = profile?.role ?? 'SERVIDOR_PUBLICO';
  const firstName = profile?.firstName ?? 'Servidor';

  const isAdmin = hasMinRole(role, 'PREFEITO');
  const isGestor = hasMinRole(role, 'GESTOR') && !isAdmin;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const s = dynamicStyles(colors);

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>{greeting()}, {firstName}!</Text>
            <Text style={s.roleLabel}>{role.replace(/_/g, ' ')}</Text>
          </View>
          <TouchableOpacity style={s.notifBtn}>
            <Text style={{ fontSize: 22 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Risk Level Banner */}
        <View style={[s.riskBanner, { backgroundColor: colors.warning + '20', borderColor: colors.warning }]}>
          <Text style={{ fontSize: 16 }}>⚠️</Text>
          <Text style={[s.riskText, { color: colors.foreground }]}>
            Nível de risco: <Text style={{ fontWeight: '700', color: colors.warning }}>Monitoramento</Text>
          </Text>
        </View>

        {/* Role-based content */}
        <View style={s.content}>
          {isAdmin
            ? <AdminDashboard colors={colors} />
            : isGestor
              ? <GestorDashboard colors={colors} />
              : <ServidorDashboard colors={colors} />
          }
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  ctaCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, padding: 16, gap: 12,
  },
  ctaEmoji: { fontSize: 28 },
  ctaTitle: { fontSize: 15, fontWeight: '700' },
  ctaSubtitle: { fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 10 },
  benefitCard: {
    flex: 1, borderRadius: 12, padding: 14, alignItems: 'center',
    borderWidth: 1, gap: 4,
  },
  benefitTitle: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  benefitDesc: { fontSize: 11, textAlign: 'center' },
  kpiCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, padding: 14, borderWidth: 1, marginBottom: 8,
  },
  kpiLabel: { fontSize: 12, marginBottom: 2 },
  kpiValue: { fontSize: 20, fontWeight: '700' },
  imvpCard: {
    borderRadius: 16, padding: 20, alignItems: 'center',
  },
  imvpLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  imvpValue: { color: '#fff', fontSize: 48, fontWeight: '800', marginVertical: 4 },
  imvpSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 11, textAlign: 'center' },
  statCard: {
    flex: 1, borderRadius: 12, padding: 12, alignItems: 'center',
    borderWidth: 1, gap: 4,
  },
  statLabel: { fontSize: 11 },
  statValue: { fontSize: 18, fontWeight: '700' },
});

const dynamicStyles = (colors: any) => StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12,
  },
  greeting: { fontSize: 20, fontWeight: '700', color: colors.foreground },
  roleLabel: { fontSize: 12, color: colors.muted, marginTop: 2 },
  notifBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  riskBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, borderRadius: 10, padding: 10,
    borderWidth: 1, marginBottom: 4,
  },
  riskText: { fontSize: 13 },
  content: { paddingHorizontal: 20, paddingTop: 8 },
});
