import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { hasMinRole } from '../../src/types';

const { width } = Dimensions.get('window');

// ─── Componentes Reutilizáveis ────────────────────────

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
          shadowColor: colors.foreground,
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

// ─── Role-based dashboard components ────────────────────────

function ServidorDashboard({ colors }: { colors: any }) {
  return (
    <View style={styles.dashboardContainer}>
      {/* CTA Principal - DDE */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)/dde' as any)}
      >
        <GradientCard
          colors={[colors.secondary, colors.accent]}
          style={styles.primaryCTA}
        >
          <View style={styles.ctaContent}>
            <View>
              <Text style={styles.ctaEmoji}>😊</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.ctaTitle, { color: '#fff' }]}>
                Como você está hoje?
              </Text>
              <Text style={[styles.ctaSubtitle, { color: 'rgba(255,255,255,0.85)' }]}>
                Registre seu bem-estar diário
              </Text>
            </View>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>→</Text>
          </View>
        </GradientCard>
      </TouchableOpacity>

      {/* CTA Secundária - Checklists */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/checklists' as any)}
        style={{ marginTop: 12 }}
      >
        <ModernCard colors={colors} style={styles.secondaryCTA}>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaEmoji}>📋</Text>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.ctaTitle, { color: colors.foreground }]}>
                Questionários
              </Text>
              <Text style={[styles.ctaSubtitle, { color: colors.muted }]}>
                Responda os questionários ativos
              </Text>
            </View>
            <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: '600' }}>→</Text>
          </View>
        </ModernCard>
      </TouchableOpacity>

      {/* Seção de Benefícios */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Benefícios em Destaque
        </Text>
        <View style={styles.benefitsGrid}>
          {[
            { emoji: '🎟️', title: 'Cupom Saúde', desc: 'Válido até 30/04' },
            { emoji: '📅', title: 'Evento PSI', desc: 'Próx. 05/04' },
          ].map((b, i) => (
            <ModernCard key={i} colors={colors} style={styles.benefitCard}>
              <Text style={styles.benefitEmoji}>{b.emoji}</Text>
              <Text style={[styles.benefitTitle, { color: colors.foreground }]}>
                {b.title}
              </Text>
              <Text style={[styles.benefitDesc, { color: colors.muted }]}>
                {b.desc}
              </Text>
            </ModernCard>
          ))}
        </View>
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
      {/* Banner de Status */}
      <ModernCard colors={colors} style={styles.statusBanner}>
        <View style={styles.statusContent}>
          <View>
            <Text style={styles.statusIcon}>📊</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.statusTitle, { color: colors.foreground }]}>
              Painel Operacional
            </Text>
            <Text style={[styles.statusDesc, { color: colors.muted }]}>
              Acompanhe métricas em tempo real
            </Text>
          </View>
        </View>
      </ModernCard>

      {/* KPIs Grid */}
      <View style={styles.section}>
        <View style={styles.kpisGrid}>
          {kpis.map((k, i) => (
            <StatBox
              key={i}
              icon={k.icon}
              label={k.label}
              value={k.value}
              colors={colors}
            />
          ))}
        </View>
      </View>

      {/* CTA - Ver Questionários */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/checklists' as any)}
      >
        <GradientCard
          colors={[colors.primary, colors.accent]}
          style={styles.primaryCTA}
        >
          <View style={styles.ctaContent}>
            <Text style={styles.ctaEmoji}>📊</Text>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.ctaTitle, { color: '#fff' }]}>
                Ver Questionários
              </Text>
              <Text style={[styles.ctaSubtitle, { color: 'rgba(255,255,255,0.85)' }]}>
                Acompanhe respostas agregadas
              </Text>
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
      {/* IMVP Card - Destaque Principal */}
      <GradientCard
        colors={[colors.primary, colors.secondary]}
        style={styles.imvpCard}
      >
        <View style={styles.imvpContent}>
          <Text style={styles.imvpLabel}>IMVP</Text>
          <Text style={styles.imvpValue}>—</Text>
          <Text style={styles.imvpSubtitle}>
            Índice Municipal de Vulnerabilidade Psicossocial
          </Text>
        </View>
      </GradientCard>

      {/* PGR Status */}
      <ModernCard colors={colors} style={styles.statusBanner}>
        <View style={styles.statusContent}>
          <View>
            <Text style={styles.statusIcon}>🛡️</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.statusTitle, { color: colors.foreground }]}>
              Status PGR
            </Text>
            <Text style={[styles.statusDesc, { color: colors.muted }]}>
              Em monitoramento contínuo
            </Text>
          </View>
        </View>
      </ModernCard>

      {/* Estatísticas Grid */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Visão Estratégica
        </Text>
        <View style={styles.statsGrid}>
          {[
            { icon: '📋', label: 'Relatos', color: colors.accent },
            { icon: '✅', label: 'Checklists', color: colors.secondary },
            { icon: '📈', label: 'Planos', color: colors.success },
          ].map((item, i) => (
            <ModernCard key={i} colors={colors} style={styles.statCard}>
              <Text style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                {item.label}
              </Text>
              <Text style={[styles.statValue, { color: item.color }]}>—</Text>
            </ModernCard>
          ))}
        </View>
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

  const dynamicStyles = useMemo(() => {
    return StyleSheet.create({
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
      },
      headerContent: {
        flex: 1,
      },
      greeting: {
        fontSize: 28,
        fontWeight: '700',
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
        marginHorizontal: 20,
        marginBottom: 20,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: colors.warning + '15',
        borderWidth: 1,
        borderColor: colors.warning + '40',
      },
      riskText: {
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
      },
    });
  }, [colors]);

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <View style={dynamicStyles.header}>
          <View style={dynamicStyles.headerContent}>
            <Text style={dynamicStyles.greeting}>{greeting()}, {firstName}!</Text>
            <Text style={dynamicStyles.roleLabel}>
              {role.replace(/_/g, ' ')}
            </Text>
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
            <Text style={{ fontWeight: '700', color: colors.warning }}>
              Monitoramento
            </Text>
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
  );
}

const styles = StyleSheet.create({
  dashboardContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  section: {
    marginTop: 8,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  gradientCard: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  modernCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  primaryCTA: {
    marginTop: 8,
  },
  secondaryCTA: {
    borderWidth: 1.5,
  },
  ctaEmoji: {
    fontSize: 32,
    fontWeight: '700',
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  ctaSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusBanner: {
    marginTop: 8,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIcon: {
    fontSize: 28,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  statusDesc: {
    fontSize: 12,
    fontWeight: '500',
  },
  benefitsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  benefitCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  benefitEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  benefitDesc: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  kpisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    minWidth: (width - 52) / 2,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  imvpCard: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  imvpContent: {
    alignItems: 'center',
  },
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
