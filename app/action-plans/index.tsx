import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { getActionPlans } from '../../src/services/actionPlans.service';
import { ActionPlan, hasMinRole } from '../../src/types';

const STATUS_COLORS: Record<string, string> = {
  'Pendente':      '#F39C12',
  'Em Andamento':  '#4A90D9',
  'Concluído':     '#2ECC71',
  'Atrasado':      '#E74C3C',
};

const RISK_COLORS: Record<string, string> = {
  'Baixo':   '#2ECC71',
  'Médio':   '#F39C12',
  'Alto':    '#E67E22',
  'Crítico': '#E74C3C',
};

function ActionPlanCard({ plan, colors }: { plan: ActionPlan; colors: any }) {
  const statusColor = STATUS_COLORS[plan.status] ?? colors.muted;
  const riskColor = RISK_COLORS[plan.riskGrade] ?? colors.muted;
  const deadline = plan.deadline?.toDate?.() ?? (plan.deadline ? new Date(plan.deadline) : null);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.badge, { backgroundColor: statusColor + '20', borderColor: statusColor }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>{plan.status}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: riskColor + '20', borderColor: riskColor }]}>
          <Text style={[styles.badgeText, { color: riskColor }]}>Risco {plan.riskGrade}</Text>
        </View>
      </View>
      <Text style={[styles.cardTitle, { color: colors.foreground }]}>{plan.title}</Text>
      {plan.description ? (
        <Text style={[styles.cardDesc, { color: colors.muted }]} numberOfLines={2}>
          {plan.description}
        </Text>
      ) : null}
      {deadline && (
        <View style={styles.deadlineRow}>
          <Text style={{ fontSize: 14 }}>📅</Text>
          <Text style={[styles.deadlineText, { color: colors.muted }]}>
            Prazo: {deadline.toLocaleDateString('pt-BR')}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function ActionPlanListScreen() {
  const colors = useColors();
  const { profile } = useAuth();
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const canCreate = hasMinRole(profile?.role ?? 'SERVIDOR_PUBLICO', 'GESTOR');

  const load = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const data = await getActionPlans(profile.prefectureId);
      setPlans(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => { load(); }, [load]);

  const filtered = filter ? plans.filter(p => p.status === filter) : plans;

  const s = dynamicStyles(colors);

  return (
    <ScreenContainer>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={[s.backIcon, { color: colors.primary }]}>‹</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[s.title, { color: colors.foreground }]}>Planos de Ação</Text>
          <Text style={[s.subtitle, { color: colors.muted }]}>{plans.length} planos cadastrados</Text>
        </View>
        {canCreate && (
          <TouchableOpacity style={[s.addBtn, { backgroundColor: colors.primary }]}>
            <Text style={s.addBtnText}>+ Novo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={s.filters}>
        {[null, 'Pendente', 'Em Andamento', 'Concluído', 'Atrasado'].map(f => (
          <TouchableOpacity
            key={f ?? 'all'}
            style={[
              s.filterBtn,
              { borderColor: filter === f ? colors.primary : colors.border },
              filter === f && { backgroundColor: colors.primary },
            ]}
            onPress={() => setFilter(f)}
          >
            <Text style={[s.filterText, { color: filter === f ? '#fff' : colors.muted }]}>
              {f ?? 'Todos'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : filtered.length === 0 ? (
        <View style={s.empty}>
          <Text style={{ fontSize: 40 }}>📌</Text>
          <Text style={[s.emptyText, { color: colors.muted }]}>Nenhum plano encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id ?? Math.random().toString()}
          renderItem={({ item }) => <ActionPlanCard plan={item} colors={colors} />}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 1 }, shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  cardDesc: { fontSize: 13, lineHeight: 18 },
  deadlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  deadlineText: { fontSize: 12 },
});

const dynamicStyles = (colors: any) => StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 32, lineHeight: 36 },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2 },
  addBtn: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  addBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  filters: {
    flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8, gap: 6, flexWrap: 'wrap',
  },
  filterBtn: {
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1,
  },
  filterText: { fontSize: 12, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { fontSize: 14 },
});
