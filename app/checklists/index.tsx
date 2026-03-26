import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { getActiveChecklists, getUserChecklistResponses } from '../../src/services/checklist.service';
import { Checklist } from '../../src/types';

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
      setRespondedIds(new Set(responses.map(r => r.checklistId)));
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => { load(); }, [load]);

  const s = dynamicStyles(colors);

  const renderItem = ({ item }: { item: Checklist }) => {
    const done = respondedIds.has(item.id!);
    return (
      <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={s.cardHeader}>
          <View style={[
            s.badge,
            { backgroundColor: done ? colors.success + '20' : colors.warning + '20',
              borderColor: done ? colors.success : colors.warning },
          ]}>
            <Text style={[s.badgeText, { color: done ? colors.success : colors.warning }]}>
              {done ? '✓ Concluído' : 'Não respondido'}
            </Text>
          </View>
          <Text style={[s.questionCount, { color: colors.muted }]}>
            {item.questions?.length ?? 0} questões
          </Text>
        </View>
        <Text style={[s.cardTitle, { color: colors.foreground }]}>{item.title}</Text>
        {item.description ? (
          <Text style={[s.cardDesc, { color: colors.muted }]} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        {!done && (
          <TouchableOpacity
            style={[s.ctaBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push(`/checklists/${item.id}` as any)}
          >
            <Text style={s.ctaBtnText}>Iniciar Questionário</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ScreenContainer>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={[s.backIcon, { color: colors.primary }]}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={[s.title, { color: colors.foreground }]}>Questionários</Text>
          <Text style={[s.subtitle, { color: colors.muted }]}>Questionários ativos da prefeitura</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : checklists.length === 0 ? (
        <View style={s.empty}>
          <Text style={{ fontSize: 40 }}>📋</Text>
          <Text style={[s.emptyText, { color: colors.muted }]}>Nenhum questionário ativo no momento.</Text>
        </View>
      ) : (
        <FlatList
          data={checklists}
          keyExtractor={item => item.id ?? Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 32, lineHeight: 36 },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2 },
  card: {
    borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 1 }, shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  questionCount: { fontSize: 11 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardDesc: { fontSize: 13, lineHeight: 18 },
  ctaBtn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  ctaBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { fontSize: 14 },
});
