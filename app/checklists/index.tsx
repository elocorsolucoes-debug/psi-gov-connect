import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  ActivityIndicator, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { getActiveChecklists, getUserChecklistResponses } from '../../src/services/checklist.service';
import { Checklist } from '../../src/types';
import { AnimatedScreen } from '@/components/animations/animated-screen';
import { ProgressBar } from '@/components/ui/progress-bar';

const { width } = Dimensions.get('window');

function ChecklistCard({ checklist, isCompleted, inProgress, colors }: any) {
  const questionCount = checklist.questions?.length ?? 0;

  const statusIcon = isCompleted ? '✅' : inProgress ? '⏳' : '⭕';
  const statusLabel = isCompleted ? 'Concluído' : inProgress ? 'Em progresso' : 'Não iniciado';
  const statusColor = isCompleted ? colors.success : inProgress ? colors.warning : colors.muted;
  const ctaLabel = isCompleted ? 'Ver Respostas' : inProgress ? 'Continuar →' : 'Começar →';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/checklists/${checklist.id}` as any)}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderLeftColor: statusColor,
            borderLeftWidth: 4,
          },
        ]}
      >
        {/* Status Row */}
        <View style={styles.statusRow}>
          <Text style={styles.statusIcon}>{statusIcon}</Text>
          <Text style={[styles.statusLabel, { color: statusColor }]}>{statusLabel}</Text>
        </View>

        {/* Title & Description */}
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>{checklist.title}</Text>
        {checklist.description && (
          <Text style={[styles.cardDesc, { color: colors.muted }]} numberOfLines={2}>
            {checklist.description}
          </Text>
        )}

        {/* Meta + CTA */}
        <View style={styles.cardFooter}>
          <View style={[styles.metaBadge, { backgroundColor: colors.accent + '15', borderColor: colors.accent }]}>
            <Text style={[styles.metaText, { color: colors.accent }]}>
              📋 {questionCount} {questionCount === 1 ? 'questão' : 'questões'}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push(`/checklists/${checklist.id}` as any)}
            style={[
              styles.ctaInline,
              { backgroundColor: isCompleted ? colors.surface : colors.primary,
                borderColor: isCompleted ? colors.border : colors.primary },
            ]}
          >
            <Text style={[styles.ctaInlineText, { color: isCompleted ? colors.foreground : '#fff' }]}>
              {ctaLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ChecklistListScreen() {
  const colors = useColors();
  const { profile } = useAuth();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [respondedIds, setRespondedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const [cls, responses] = await Promise.all([
        getActiveChecklists(profile.prefectureId),
        getUserChecklistResponses(profile.uid, profile.prefectureId),
      ]);
      setChecklists(cls);
      setRespondedIds(new Set(responses.map((r) => r.checklistId)));
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    load();
  }, [load]);

  const completedCount = respondedIds.size;
  const totalCount = checklists.length;
  const completionRatio = totalCount > 0 ? completedCount / totalCount : 0;
  const completionPercentage = Math.round(completionRatio * 100);

  return (
    <AnimatedScreen animation="slideInUp" duration={400}>
      <ScreenContainer>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Questionários</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Responda os questionários ativos da sua prefeitura
          </Text>
        </View>

      {/* Progress Card */}
      {totalCount > 0 && (
        <View style={styles.progressContainer}>
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.progressCard}
          >
            <View style={styles.progressContent}>
              <View>
                <Text style={styles.progressLabel}>Seu Progresso</Text>
                <View style={styles.progressNumbers}>
                  <Text style={styles.progressValue}>{completedCount}</Text>
                  <Text style={styles.progressTotal}> de {totalCount} completos</Text>
                </View>
              </View>
              <View style={styles.progressCircle}>
                <Text style={styles.progressPercent}>{completionPercentage}%</Text>
              </View>
            </View>
            <ProgressBar
              value={completionRatio}
              color="rgba(255,255,255,0.9)"
              backgroundColor="rgba(255,255,255,0.25)"
              height={8}
            />
          </LinearGradient>
        </View>
      )}

      {/* Checklists List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : checklists.length === 0 ? (
        <View style={styles.centerContainer}>
          <View
            style={[
              styles.emptyContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📋</Text>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Nenhum questionário ativo
            </Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Não há questionários disponíveis no momento
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={checklists}
          keyExtractor={(item) => item.id ?? Math.random().toString()}
          renderItem={({ item }) => (
            <ChecklistCard
              checklist={item}
              isCompleted={respondedIds.has(item.id!)}
              inProgress={false}
              colors={colors}
            />
          )}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}
      </ScreenContainer>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  // ─── Header ───
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 18,
    borderBottomWidth: 1,
    marginBottom: 0,
  },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 4, fontWeight: '500' },
  // ─── Progress ───
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  progressContainer: { paddingHorizontal: 20, paddingTop: 16, marginBottom: 8 },
  progressCard: { borderRadius: 18, padding: 18, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 12, elevation: 8 },
  progressContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  progressNumbers: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  progressValue: { color: '#fff', fontSize: 32, fontWeight: '800', lineHeight: 38 },
  progressTotal: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  progressCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  progressPercent: { color: '#fff', fontSize: 22, fontWeight: '800' },
  // ─── List ───
  listContent: { paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 40, gap: 12 },
  // ─── Card ───
  card: { borderRadius: 14, padding: 16, borderWidth: 1, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  statusIcon: { fontSize: 16 },
  statusLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardDesc: { fontSize: 12, fontWeight: '500', lineHeight: 17, marginTop: -2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  metaBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  metaText: { fontSize: 11, fontWeight: '600' },
  ctaInline: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  ctaInlineText: { fontSize: 12, fontWeight: '700' },
  // ─── Empty ───
  emptyContainer: { borderRadius: 14, padding: 36, alignItems: 'center', borderWidth: 1 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  emptyText: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
});
