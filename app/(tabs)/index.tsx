import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { hasMinRole } from '../../src/types';
import { AnimatedScreen } from '@/components/animations/animated-screen';
import { useResponsive } from '@/hooks/use-responsive';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colors = useColors();
  const { user, profile } = useAuth();
  const responsive = useResponsive();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: responsive.screenPadding,
      paddingVertical: responsive.screenPadding,
    },
    header: {
      marginBottom: responsive.spacing.lg,
    },
    greeting: {
      fontSize: responsive.fontSize['2xl'],
      fontWeight: '800',
      color: colors.foreground,
      marginBottom: responsive.spacing.sm,
    },
    subGreeting: {
      fontSize: responsive.fontSize.sm,
      color: colors.muted,
    },
    progressCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: responsive.cardPadding,
      marginBottom: responsive.spacing.lg,
      borderColor: colors.border,
      borderWidth: 1,
    },
    progressLabel: {
      fontSize: responsive.fontSize.sm,
      color: colors.muted,
      marginBottom: responsive.spacing.sm,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: responsive.spacing.md,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.accent,
      width: '80%',
    },
    progressText: {
      fontSize: responsive.fontSize.base,
      fontWeight: '600',
      color: colors.foreground,
    },
    ctaContainer: {
      marginBottom: responsive.spacing.lg,
    },
    primaryCTA: {
      borderRadius: 16,
      padding: responsive.cardPadding,
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsive.spacing.md,
    },
    ctaEmoji: {
      fontSize: responsive.fontSize['3xl'],
    },
    ctaTitle: {
      fontSize: responsive.fontSize.lg,
      fontWeight: '700',
      marginBottom: responsive.spacing.xs,
    },
    ctaSubtitle: {
      fontSize: responsive.fontSize.sm,
      opacity: 0.85,
    },
    ctaArrow: {
      fontSize: responsive.fontSize.xl,
      fontWeight: '600',
    },
    secondaryGrid: {
      flexDirection: 'row',
      gap: responsive.spacing.md,
      marginBottom: responsive.spacing.lg,
    },
    secondaryCTA: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: responsive.cardPadding,
      borderColor: colors.border,
      borderWidth: 1,
    },
    secondaryCTAContent: {
      alignItems: 'center',
      gap: responsive.spacing.sm,
    },
    secondaryCTATitle: {
      fontSize: responsive.fontSize.sm,
      fontWeight: '600',
      color: colors.foreground,
      textAlign: 'center',
    },
    secondaryCTAValue: {
      fontSize: responsive.fontSize.lg,
      fontWeight: '800',
      color: colors.accent,
    },
    chartCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: responsive.cardPadding,
      borderColor: colors.border,
      borderWidth: 1,
      marginBottom: responsive.spacing.lg,
    },
    chartTitle: {
      fontSize: responsive.fontSize.base,
      fontWeight: '700',
      color: colors.foreground,
      marginBottom: responsive.spacing.md,
    },
    chartPlaceholder: {
      height: 150,
      backgroundColor: colors.border,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chartText: {
      fontSize: responsive.fontSize.sm,
      color: colors.muted,
    },
  });

  return (
    <AnimatedScreen animation="fadeIn">
      <ScreenContainer className="bg-background">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.greeting}>
                Bem-vindo, {profile?.firstName || 'Servidor'}! 👋
              </Text>
              <Text style={styles.subGreeting}>
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
            </View>

            {/* Progress Card */}
            <View style={styles.progressCard}>
              <Text style={styles.progressLabel}>Seu Progresso Hoje</Text>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.progressText}>80% completo</Text>
            </View>

            {/* Primary CTA - DDE */}
            <View style={styles.ctaContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/dde' as any)}
              >
                <LinearGradient
                  colors={[colors.accent, colors.secondary] as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryCTA}
                >
                  <Text style={styles.ctaEmoji}>😊</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.ctaTitle, { color: '#fff' }]}>
                      Como você está hoje?
                    </Text>
                    <Text style={[styles.ctaSubtitle, { color: 'rgba(255,255,255,0.85)' }]}>
                      Registre seu bem-estar diário
                    </Text>
                  </View>
                  <Text style={[styles.ctaArrow, { color: '#fff' }]}>→</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Secondary CTAs Grid */}
            <View style={styles.secondaryGrid}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/checklists' as any)}
                style={{ flex: 1 }}
              >
                <View style={styles.secondaryCTA}>
                  <View style={styles.secondaryCTAContent}>
                    <Text style={styles.ctaEmoji}>📋</Text>
                    <Text style={styles.secondaryCTATitle}>Questionários</Text>
                    <Text style={styles.secondaryCTAValue}>3</Text>
                    <Text style={[styles.secondaryCTATitle, { fontSize: responsive.fontSize.xs, color: colors.muted }]}>
                      pendentes
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/(tabs)/reports' as any)}
                style={{ flex: 1 }}
              >
                <View style={styles.secondaryCTA}>
                  <View style={styles.secondaryCTAContent}>
                    <Text style={styles.ctaEmoji}>📊</Text>
                    <Text style={styles.secondaryCTATitle}>Meus Relatos</Text>
                    <Text style={styles.secondaryCTAValue}>5</Text>
                    <Text style={[styles.secondaryCTATitle, { fontSize: responsive.fontSize.xs, color: colors.muted }]}>
                      enviados
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Mini Chart */}
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>📈 Seu Bem-Estar (últimos 7 dias)</Text>
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartText}>Gráfico de tendência</Text>
              </View>
            </View>

            {/* Gestor/Admin Dashboard */}
            {profile?.role && hasMinRole(profile.role, 'GESTOR') && (
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>📊 Dashboard de Gestão</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {}}
                  style={{
                    backgroundColor: colors.border,
                    borderRadius: 12,
                    padding: responsive.cardPadding,
                    marginBottom: responsive.spacing.sm,
                  }}
                >
                  <Text style={{ fontSize: responsive.fontSize.sm, color: colors.foreground, fontWeight: '600' }}>
                    📈 Relatórios Agregados
                  </Text>
                  <Text style={{ fontSize: responsive.fontSize.xs, color: colors.muted, marginTop: responsive.spacing.xs }}>
                    Ver métricas de bem-estar da equipe
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </ScreenContainer>
    </AnimatedScreen>
  );
}
