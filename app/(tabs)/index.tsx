import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { hasMinRole } from '../../src/types';
import { AnimatedScreen } from '@/components/animations/animated-screen';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SectionHeader } from '@/components/ui/section-header';

const { width } = Dimensions.get('window');

// ─── Reusable Card Components ──────────────────────────

function GradientCard({ children, colors: cardColors, style }: any) {
  return (
    <LinearGradient
      colors={cardColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientCard, style]}
    >
      {children}
    </LinearGradient>
  );
}

function ModernCard({ children, colors, style }: any) {
  return (
    <View
      style={[
        styles.modernCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: '#000',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function StatBox({ icon, label, value, colors }: any) {
  return (
    <ModernCard colors={colors} style={styles.statBox}>
      <Text style={{ fontSize: 24, marginBottom: 8 }}>{icon}</Text>
      <Text style={[styles.statLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
    </ModernCard>
  );
}

// ─── Mini Wellbeing Chart ─────────────────────────────

function MiniWellbeingChart({ colors }: { colors: any }) {
  // Simulated 7-day data (0–4 corresponding to mood levels)
  const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  const values = [3, 4, 2, 3, 4, 3, 4]; // 0=bad, 4=excellent
  const maxVal = 4;

  const barColors = [
    colors.error,   // 0 - bad
    '#FF9800',      // 1 - tired
    '#FFC107',      // 2 - neutral
    colors.accent,  // 3 - good
    colors.success, // 4 - excellent
  ];

  return (
    <ModernCard colors={colors} style={styles.chartCard}>
      <Text style={[styles.chartTitle, { color: colors.foreground }]}>
        📈 Bem-estar (últimos 7 dias)
      </Text>
      <View style={styles.chartBars}>
        {values.map((v, i) => (
          <View key={i} style={styles.chartBarWrapper}>
            <View style={[styles.chartBarTrack, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.chartBarFill,
                  {
                    height: `${(v / maxVal) * 100}%`,
                    backgroundColor: barColors[v],
                  },
                ]}
              />
            </View>
            <Text style={[styles.chartDay, { color: colors.muted }]}>{days[i]}</Text>
          </View>
        ))}
      </View>
    </ModernCard>
  );
}

// ─── Role-based Dashboard Components ─────────────────

function ServidorDashboard({ colors }: { colors: any }) {
  return (
    <View style={styles.dashboardContainer}>
      {/* Progress Card */}
      <ModernCard colors={colors} style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={[styles.progressTitle, { color: colors.foreground }]}>
              🎯 Seu Progresso Hoje
            </Text>
            <Text style={[styles.progressSub, { color: colors.muted }]}>
              2 de 3 atividades completas
            </Text>
          </View>
          <Text style={[styles.progressPct, { color: colors.primary }]}>80%</Text>
        </View>
        <View style={{ marginTop: 12 }}>
          <ProgressBar value={0.8} color={colors.primary} backgroundColor={colors.border} height={10} />
        </View>
      </ModernCard>

      {/* CTA Principal - DDE (large) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/(tabs)/dde' as any)}
      >
        <GradientCard
          colors={[colors.primary, colors.accent]}
          style={styles.primaryCTA}
        >
          <View style={styles.ctaContent}>
            <Text style={styles.ctaEmoji}>😊</Text>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.ctaTitle, { color: '#fff' }]}>
                Como você está hoje?
              </Text>
              <Text style={[styles.ctaSubtitle, { color: 'rgba(255,255,255,0.85)' }]}>
                Registre seu bem-estar diário
              </Text>
            </View>
            <View style={styles.ctaArrow}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>→</Text>
            </View>
          </View>
        </GradientCard>
      </TouchableOpacity>

      {/* CTAs Secundárias — 2 colunas */}
      <View style={styles.secondaryGrid}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={{ flex: 1 }}
          onPress={() => router.push('/checklists' as any)}
        >
          <ModernCard colors={colors} style={styles.secondaryCard}>
            <Text style={styles.secondaryEmoji}>📋</Text>
            <Text style={[styles.secondaryTitle, { color: colors.foreground }]}>
              Questionários
            </Text>
            <Text style={[styles.secondaryBadge, { backgroundColor: colors.primary, color: '#fff' }]}>
              3 pendentes
            </Text>
          </ModernCard>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={{ flex: 1 }}
          onPress={() => router.push('/(tabs)/reports' as any)}
        >
          <ModernCard colors={colors} style={styles.secondaryCard}>
            <Text style={styles.secondaryEmoji}>📊</Text>
            <Text style={[styles.secondaryTitle, { color: colors.foreground }]}>
              Meus Relatos
            </Text>
            <Text style={[styles.secondaryBadge, { backgroundColor: colors.success, color: '#fff' }]}>
              5 enviados
            </Text>
          </ModernCard>
        </TouchableOpacity>
      </View>

      {/* Mini Wellbeing Chart */}
      <MiniWellbeingChart colors={colors} />

      {/* Benefícios */}
      <SectionHeader
        title="Benefícios em Destaque"
        color={colors.muted}
        borderColor={colors.border}
        marginTop={4}
        marginBottom={12}
        marginHorizontal={0}
      />
      <View style={styles.benefitsGrid}>
        {[
          { emoji: '🎟️', title: 'Cupom Saúde', desc: 'Válido até 30/04' },
          { emoji: '📅', title: 'Evento PSI', desc: 'Próx. 05/04' },
        ].map((b, i) => (
          <ModernCard key={i} colors={colors} style={styles.benefitCard}>
            <Text style={styles.benefitEmoji}>{b.emoji}</Text>
            <Text style={[styles.benefitTitle, { color: colors.foreground }]}>{b.title}</Text>
            <Text style={[styles.benefitDesc, { color: colors.muted }]}>{b.desc}</Text>
          </ModernCard>
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
    <View style={styles.dashboardContainer}>
      <ModernCard colors={colors} style={styles.statusBanner}>
        <View style={styles.statusContent}>
          <Text style={styles.statusIcon}>📊</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.statusTitle, { color: colors.foreground }]}>Painel Operacional</Text>
            <Text style={[styles.statusDesc, { color: colors.muted }]}>Acompanhe métricas em tempo real</Text>
          </View>
        </View>
      </ModernCard>

      <View style={styles.kpisGrid}>
        {kpis.map((k, i) => (
          <StatBox key={i} icon={k.icon} label={k.label} value={k.value} colors={colors} />
        ))}
      </View>

      <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/checklists' as any)}>
        <GradientCard colors={[colors.primary, colors.accent]} style={styles.primaryCTA}>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaEmoji}>📊</Text>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.ctaTitle, { color: '#fff' }]}>Ver Questionários</Text>
              <Text style={[styles.ctaSubtitle, { color: 'rgba(255,255,255,0.85)' }]}>Acompanhe respostas agregadas</Text>
            </View>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>→</Text>
          </View>
        </GradientCard>
      </TouchableOpacity>
    </View>
  );
}

function AdminDashboard({ colors }: { colors: any }) {
  return (
    <View style={styles.dashboardContainer}>
      <GradientCard colors={[colors.primary, colors.tertiary ?? colors.accent]} style={styles.imvpCard}>
        <View style={styles.imvpContent}>
          <Text style={styles.imvpLabel}>IMVP</Text>
          <Text style={styles.imvpValue}>—</Text>
          <Text style={styles.imvpSubtitle}>Índice Municipal de Vulnerabilidade Psicossocial</Text>
        </View>
      </GradientCard>

      <ModernCard colors={colors} style={styles.statusBanner}>
        <View style={styles.statusContent}>
          <Text style={styles.statusIcon}>🛡️</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.statusTitle, { color: colors.foreground }]}>Status PGR</Text>
            <Text style={[styles.statusDesc, { color: colors.muted }]}>Em monitoramento contínuo</Text>
          </View>
          <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />
        </View>
      </ModernCard>

      <SectionHeader title="Visão Estratégica" color={colors.muted} borderColor={colors.border} marginHorizontal={0} />
      <View style={styles.statsGrid}>
        {[
          { icon: '📋', label: 'Relatos', color: colors.accent },
          { icon: '✅', label: 'Checklists', color: colors.success },
          { icon: '📈', label: 'Planos', color: colors.tertiary ?? colors.accent },
        ].map((item, i) => (
          <ModernCard key={i} colors={colors} style={styles.statCard}>
            <Text style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>{item.label}</Text>
            <Text style={[styles.statValue, { color: item.color }]}>—</Text>
          </ModernCard>
        ))}
      </View>
    </View>
  );
}

// ─── Main Home Screen ─────────────────────────────────

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

  const dynamicStyles = useMemo(() => {
    return StyleSheet.create({
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
      },
      headerContent: { flex: 1 },
      greeting: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.foreground,
        letterSpacing: -0.5,
      },
      roleLabel: {
        fontSize: 13,
        color: colors.muted,
        marginTop: 4,
        fontWeight: '500',
      },
      notifBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
      },
      riskBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginHorizontal: 24,
        marginBottom: 20,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: colors.warning + '18',
        borderWidth: 1,
        borderColor: colors.warning + '50',
      },
      riskText: {
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
        color: colors.foreground,
      },
    });
  }, [colors]);

  return (
    <AnimatedScreen animation="fadeIn" duration={500}>
      <ScreenContainer>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* Header */}
          <View style={dynamicStyles.header}>
            <View style={dynamicStyles.headerContent}>
              <Text style={dynamicStyles.greeting}>{greeting()}, {firstName}!</Text>
              <Text style={dynamicStyles.roleLabel}>{role.replace(/_/g, ' ')}</Text>
            </View>
            <TouchableOpacity style={dynamicStyles.notifBtn}>
              <Text style={{ fontSize: 20 }}>🔔</Text>
            </TouchableOpacity>
          </View>

          {/* Risk Level Banner */}
          <View style={dynamicStyles.riskBanner}>
            <Text style={{ fontSize: 16 }}>⚠️</Text>
            <Text style={dynamicStyles.riskText}>
              Nível de risco:{' '}
              <Text style={{ fontWeight: '700', color: colors.warning }}>Monitoramento</Text>
            </Text>
          </View>

          {/* Role-based content */}
          {isAdmin
            ? <AdminDashboard colors={colors} />
            : isGestor
              ? <GestorDashboard colors={colors} />
              : <ServidorDashboard colors={colors} />
          }
        </ScrollView>
      </ScreenContainer>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  dashboardContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  // ─── Progress Card ───
  progressCard: {
    padding: 18,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  progressSub: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressPct: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  // ─── CTA Cards ───
  gradientCard: {
    borderRadius: 16,
    padding: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 8,
  },
  modernCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryCTA: {
    minHeight: 80,
    justifyContent: 'center',
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaEmoji: {
    fontSize: 34,
  },
  ctaTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 3,
  },
  ctaSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  ctaArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ─── Secondary Grid (2-col) ───
  secondaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryCard: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    gap: 8,
  },
  secondaryEmoji: {
    fontSize: 30,
  },
  secondaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    overflow: 'hidden',
  },
  // ─── Mini Chart ───
  chartCard: {
    padding: 16,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 14,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
    gap: 6,
  },
  chartBarWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    gap: 4,
  },
  chartBarTrack: {
    width: '100%',
    height: 52,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 6,
  },
  chartDay: {
    fontSize: 9,
    fontWeight: '600',
  },
  // ─── Benefits ───
  benefitsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  benefitCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 12,
    gap: 6,
  },
  benefitEmoji: { fontSize: 28 },
  benefitTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  benefitDesc: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  // ─── Gestor/Admin ───
  statusBanner: { padding: 14 },
  statusContent: { flexDirection: 'row', alignItems: 'center' },
  statusIcon: { fontSize: 28 },
  statusTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  statusDesc: { fontSize: 12, fontWeight: '500' },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  kpisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    flex: 1,
    minWidth: (width - 60) / 2,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  statLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 10 },
  imvpCard: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 8,
  },
  imvpContent: { alignItems: 'center' },
  imvpLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  imvpValue: {
    color: '#fff',
    fontSize: 56,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -1,
  },
  imvpSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
});
