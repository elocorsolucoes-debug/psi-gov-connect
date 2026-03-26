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
import { AnimatedCard } from '@/components/animations/animated-card';

const { width } = Dimensions.get('window');

function ChecklistCard({ checklist, isCompleted, colors }: any) {
  const questionCount = checklist.questions?.length ?? 0;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/checklists/${checklist.id}` as any)}
      disabled={isCompleted}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: isCompleted ? 0.7 : 1,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                {checklist.title}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: isCompleted
                      ? colors.success + '20'
                      : colors.warning + '20',
                    borderColor: isCompleted ? colors.success : colors.warning,
                  },
                ]}
              >
                <Text style={{ fontSize: 10 }}>
                  {isCompleted ? '✓' : '○'}
                </Text>
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: isCompleted ? colors.success : colors.warning,
                    },
                  ]}
                >
                  {isCompleted ? 'Concluído' : 'Pendente'}
                </Text>
              </View>
            </View>
            {checklist.description && (
              <Text
                style={[styles.cardDesc, { color: colors.muted }]}
                numberOfLines={2}
              >
                {checklist.description}
              </Text>
            )}
          </View>
        </View>

        {/* Question Count */}
        <View style={styles.metaRow}>
          <View
            style={[
              styles.metaBadge,
              { backgroundColor: colors.accent + '15', borderColor: colors.accent },
            ]}
          >
            <Text style={[styles.metaText, { color: colors.accent }]}>
              📋 {questionCount} {questionCount === 1 ? 'questão' : 'questões'}
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        {!isCompleted && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push(`/checklists/${checklist.id}` as any)}
            style={{ marginTop: 12 }}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>
                Iniciar Questionário
              </Text>
              <Text style={styles.ctaArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
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
  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const dynamicStyles = useMemo(() => {
    return StyleSheet.create({
      header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
      },
      title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.foreground,
        letterSpacing: -0.5,
      },
      subtitle: {
        fontSize: 13,
        color: colors.muted,
        marginTop: 4,
        fontWeight: '500',
      },
    });
  }, [colors]);

  return (
    <AnimatedScreen animation="slideInUp" duration={400}>
      <ScreenContainer>
        {/* Header */}
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.title}>Questionários</Text>
          <Text style={dynamicStyles.subtitle}>
            Responda os questionários ativos da sua prefeitura
          </Text>
        </View>

      {/* Progress Card */}
      {totalCount > 0 && (
        <View style={styles.progressContainer}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.progressCard}
          >
            <View style={styles.progressContent}>
              <View>
                <Text style={styles.progressLabel}>Sua Progressão</Text>
                <View style={styles.progressNumbers}>
                  <Text style={styles.progressValue}>{completedCount}</Text>
                  <Text style={styles.progressTotal}>/{totalCount}</Text>
                </View>
              </View>
              <View style={styles.progressCircle}>
                <Text style={styles.progressPercent}>{completionPercentage}%</Text>
              </View>
            </View>
            <View
              style={[
                styles.progressBar,
                { backgroundColor: 'rgba(255,255,255,0.3)' },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${completionPercentage}%`,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                  },
                ]}
              />
            </View>
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressCard: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  progressContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  progressValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 36,
  },
  progressTotal: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  card: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  ctaArrow: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
