import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  ActivityIndicator, Alert, TextInput, Switch, Modal, ScrollView, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { getMyReports, getAllReports, createReport } from '../../src/services/reports.service';
import { AnimatedScreen } from '@/components/animations/animated-screen';
import { Report, hasMinRole } from '../../src/types';

const { width } = Dimensions.get('window');

const STATUS_CONFIG: Record<string, { color: string; emoji: string; label: string }> = {
  'Enviado':     { color: '#1E88E5', emoji: '📤', label: 'Enviado' },
  'Visualizado': { color: '#7C4DFF', emoji: '👁️', label: 'Visualizado' },
  'Em Análise':  { color: '#FF9800', emoji: '🔍', label: 'Em Análise' },
  'Respondido':  { color: '#4CAF50', emoji: '✅', label: 'Respondido' },
};

const FILTERS = ['Todos', 'Enviado', 'Em Análise', 'Respondido'];

function ReportCard({ report, colors }: { report: Report; colors: any }) {
  const date = report.createdAt?.toDate?.() ?? new Date();
  const status = STATUS_CONFIG[report.status] || { color: colors.muted, emoji: '📋', label: report.status };
  const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderLeftColor: status.color,
          borderLeftWidth: 4,
        },
      ]}
    >
      {/* Header row */}
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          {report.isAnonymous ? '🔒 Relato Anônimo' : '👤 Seu relato'}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: status.color + '20', borderColor: status.color + '80' }]}>
          <Text style={{ fontSize: 11 }}>{status.emoji}</Text>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      {/* Date */}
      <Text style={[styles.cardDate, { color: colors.muted }]}>Enviado em {dateStr}</Text>

      {/* Body */}
      <Text style={[styles.cardText, { color: colors.foreground }]} numberOfLines={3}>
        {report.reportText}
      </Text>

      {/* Analysis */}
      {report.analysis && (
        <View style={[styles.analysisBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          {report.analysis.category && (
            <View style={styles.analysisItem}>
              <Text style={[styles.analysisLabel, { color: colors.muted }]}>Categoria:</Text>
              <Text style={[styles.analysisValue, { color: colors.foreground }]}>{report.analysis.category}</Text>
            </View>
          )}
          {report.analysis.priority && (
            <View style={styles.analysisItem}>
              <Text style={[styles.analysisLabel, { color: colors.muted }]}>Prioridade:</Text>
              <Text style={[styles.analysisValue, { color: colors.foreground }]}>{report.analysis.priority}</Text>
            </View>
          )}
        </View>
      )}

      {/* Response */}
      {report.response && (
        <View style={[styles.responseBox, { backgroundColor: colors.accent + '10', borderColor: colors.accent + '40' }]}>
          <Text style={[styles.responseLabel, { color: colors.accent }]}>✓ Resposta oficial:</Text>
          <Text style={[styles.responseText, { color: colors.foreground }]}>{report.response}</Text>
        </View>
      )}
    </View>
  );
}

function CreateReportModal({
  visible, onClose, onSaved, colors, profile,
}: { visible: boolean; onClose: () => void; onSaved: () => void; colors: any; profile: any; }) {
  const [text, setText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) { Alert.alert('Atenção', 'Descreva o ocorrido.'); return; }
    if (!profile) return;
    setSaving(true);
    try {
      await createReport({
        userId: profile.uid,
        prefectureId: profile.prefectureId,
        reportText: text.trim(),
        isAnonymous,
      });
      Alert.alert('✅ Enviado!', 'Seu relato foi registrado com sucesso.');
      setText('');
      setIsAnonymous(false);
      onSaved();
      onClose();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível enviar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          {/* Drag handle */}
          <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />

          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Novo Relato</Text>
            <TouchableOpacity onPress={onClose} disabled={saving} style={styles.closeBtnWrapper}>
              <Text style={[styles.closeBtn, { color: colors.muted }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
            <Text style={[styles.inputLabel, { color: colors.foreground }]}>Descreva o ocorrido</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
              placeholder="Relate o que aconteceu com o máximo de detalhes possível..."
              placeholderTextColor={colors.muted}
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!saving}
            />

            <View style={[styles.toggleContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.toggleLabel, { color: colors.foreground }]}>Relato Anônimo</Text>
                <Text style={[styles.toggleDesc, { color: colors.muted }]}>Seu nome não será vinculado</Text>
              </View>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
                disabled={saving}
              />
            </View>

            <View style={[styles.infoBox, { backgroundColor: colors.accent + '15', borderColor: colors.accent + '40' }]}>
              <Text style={[styles.infoText, { color: colors.accent }]}>
                ℹ️ Seu relato será analisado automaticamente para categorização e priorização.
              </Text>
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
            <TouchableOpacity onPress={onClose} disabled={saving} style={[styles.cancelBtn, { borderColor: colors.border }]}>
              <Text style={[styles.cancelBtnText, { color: colors.foreground }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} disabled={!text.trim() || saving} style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.submitBtn, { opacity: !text.trim() || saving ? 0.6 : 1 }]}
              >
                <Text style={styles.submitBtnText}>{saving ? 'Enviando...' : 'Enviar Relato'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function ReportsScreen() {
  const colors = useColors();
  const { profile } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Todos');

  const isAdmin = hasMinRole(profile?.role ?? 'SERVIDOR_PUBLICO', 'GESTOR');

  const loadReports = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const data = isAdmin
        ? await getAllReports(profile.prefectureId)
        : await getMyReports(profile.uid, profile.prefectureId);
      setReports(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [profile, isAdmin]);

  useEffect(() => { loadReports(); }, [loadReports]);

  const filteredReports = useMemo(() => {
    if (activeFilter === 'Todos') return reports;
    return reports.filter(r => r.status === activeFilter);
  }, [reports, activeFilter]);

  return (
    <AnimatedScreen animation="slideInLeft" duration={400}>
      <ScreenContainer>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>Relatos</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              {isAdmin ? 'Todos os relatos da prefeitura' : 'Compartilhe suas preocupações'}
            </Text>
          </View>
          {!isAdmin && (
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={[styles.headerCTA, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
            >
              <Text style={styles.headerCTAText}>+ Novo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}
        >
          {FILTERS.map(f => {
            const isActive = activeFilter === f;
            const cfg = STATUS_CONFIG[f];
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isActive ? (cfg?.color ?? colors.primary) : colors.surface,
                    borderColor: isActive ? (cfg?.color ?? colors.primary) : colors.border,
                  },
                ]}
                activeOpacity={0.75}
              >
                {cfg && <Text style={{ fontSize: 12 }}>{cfg.emoji} </Text>}
                <Text style={[styles.filterPillText, { color: isActive ? '#fff' : colors.muted }]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : filteredReports.length === 0 ? (
          <View style={styles.centerContainer}>
            <View style={[styles.emptyBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>📋</Text>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Nenhum relato encontrado</Text>
              <Text style={[styles.emptyText, { color: colors.muted }]}>
                {isAdmin ? 'Não há relatos ainda' : 'Clique em "+ Novo" para começar'}
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={filteredReports}
            keyExtractor={(item) => item.id ?? Math.random().toString()}
            renderItem={({ item }) => <ReportCard report={item} colors={colors} />}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, paddingTop: 4 }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* FAB — always visible for non-admin */}
        {!isAdmin && (
          <View style={styles.fabContainer}>
            <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={0.85}>
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fab}
              >
                <Text style={styles.fabText}>+</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <CreateReportModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onSaved={loadReports}
          colors={colors}
          profile={profile}
        />
      </ScreenContainer>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  // ─── Header ───
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 4, fontWeight: '500' },
  headerCTA: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  headerCTAText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  // ─── Filters ───
  filterScroll: { flexGrow: 0 },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  filterPillText: { fontSize: 12, fontWeight: '700' },
  // ─── Cards ───
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '700', flex: 1, marginRight: 8 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: { fontSize: 10, fontWeight: '700' },
  cardDate: { fontSize: 11, fontWeight: '500' },
  cardText: { fontSize: 13, fontWeight: '500', lineHeight: 19 },
  analysisBox: { borderRadius: 10, padding: 10, borderWidth: 1, gap: 6 },
  analysisItem: { flexDirection: 'row', justifyContent: 'space-between' },
  analysisLabel: { fontSize: 11, fontWeight: '600' },
  analysisValue: { fontSize: 11, fontWeight: '700' },
  responseBox: { borderRadius: 10, padding: 10, borderWidth: 1, gap: 4 },
  responseLabel: { fontSize: 11, fontWeight: '700' },
  responseText: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
  // ─── Empty ───
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  emptyBox: { borderRadius: 16, padding: 36, alignItems: 'center', borderWidth: 1, width: '100%' },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptyText: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
  // ─── FAB ───
  fabContainer: { position: 'absolute', bottom: 24, right: 20 },
  fab: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 10,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '700', lineHeight: 32 },
  // ─── Modal ───
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%', overflow: 'hidden' },
  dragHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  closeBtnWrapper: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
  },
  closeBtn: { fontSize: 22, fontWeight: '600' },
  modalBody: { paddingHorizontal: 20, paddingTop: 16 },
  inputLabel: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  textArea: {
    borderRadius: 12, borderWidth: 1.5, padding: 14,
    fontSize: 14, minHeight: 130, marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 14,
    borderRadius: 12, borderWidth: 1, marginBottom: 16,
  },
  toggleLabel: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  toggleDesc: { fontSize: 11, fontWeight: '500' },
  infoBox: { borderRadius: 12, padding: 14, borderWidth: 1 },
  infoText: { fontSize: 12, fontWeight: '500', lineHeight: 17 },
  modalFooter: {
    flexDirection: 'row', gap: 12,
    paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1,
  },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', borderWidth: 1.5,
  },
  cancelBtnText: { fontSize: 14, fontWeight: '700' },
  submitBtn: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
