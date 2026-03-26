import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  ActivityIndicator, Alert, TextInput, Switch, Modal, ScrollView,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { createReport, getMyReports, getAllReports } from '../../src/services/reports.service';
import { Report, hasMinRole } from '../../src/types';

const STATUS_COLORS: Record<string, string> = {
  'Enviado':    '#4A90D9',
  'Visualizado': '#F39C12',
  'Em Análise': '#9B59B6',
  'Respondido': '#2ECC71',
};

function ReportCard({ report, colors }: { report: Report; colors: any }) {
  const date = report.createdAt?.toDate?.() ?? new Date();
  const statusColor = STATUS_COLORS[report.status] ?? colors.muted;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20', borderColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{report.status}</Text>
        </View>
        <Text style={[styles.cardDate, { color: colors.muted }]}>
          {date.toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <Text style={[styles.cardText, { color: colors.foreground }]} numberOfLines={3}>
        {report.isAnonymous ? '🔒 Relato anônimo' : report.reportText}
      </Text>
      {report.analysis?.category && (
        <View style={styles.analysisRow}>
          <Text style={[styles.analysisTag, { backgroundColor: colors.accent + '20', color: colors.accent }]}>
            {report.analysis.category}
          </Text>
          {report.analysis.priority && (
            <Text style={[styles.analysisTag, { backgroundColor: colors.warning + '20', color: colors.warning }]}>
              {report.analysis.priority}
            </Text>
          )}
        </View>
      )}
      {report.response && (
        <View style={[styles.responseBox, { backgroundColor: colors.success + '10', borderColor: colors.success }]}>
          <Text style={[styles.responseLabel, { color: colors.success }]}>Resposta:</Text>
          <Text style={[styles.responseText, { color: colors.foreground }]}>{report.response}</Text>
        </View>
      )}
    </View>
  );
}

function CreateReportModal({
  visible, onClose, onSaved, colors, profile,
}: {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  colors: any;
  profile: any;
}) {
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
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalRoot, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.modalCancel, { color: colors.muted }]}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>Novo Relato</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={saving}>
            {saving
              ? <ActivityIndicator color={colors.primary} />
              : <Text style={[styles.modalSend, { color: colors.primary }]}>Enviar</Text>
            }
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          <Text style={[styles.modalLabel, { color: colors.foreground }]}>
            Descreva o ocorrido *
          </Text>
          <TextInput
            style={[styles.modalTextarea, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]}
            placeholder="Relate o que aconteceu com o máximo de detalhes possível..."
            placeholderTextColor={colors.muted}
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />

          <View style={[styles.anonRow, { borderColor: colors.border }]}>
            <View>
              <Text style={[styles.anonTitle, { color: colors.foreground }]}>Relato anônimo</Text>
              <Text style={[styles.anonDesc, { color: colors.muted }]}>
                Seu nome não será vinculado ao relato
              </Text>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.infoBox, { backgroundColor: colors.accent + '10', borderColor: colors.accent }]}>
            <Text style={[styles.infoText, { color: colors.accent }]}>
              ℹ️ Seu relato será analisado automaticamente para categorização e priorização.
            </Text>
          </View>
        </ScrollView>
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

  const s = dynamicStyles(colors);

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Relatos</Text>
        <Text style={s.subtitle}>
          {isAdmin ? 'Todos os relatos da prefeitura' : 'Meus relatos'}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : reports.length === 0 ? (
        <View style={s.emptyBox}>
          <Text style={{ fontSize: 40 }}>📋</Text>
          <Text style={[s.emptyText, { color: colors.muted }]}>Nenhum relato encontrado.</Text>
          {!isAdmin && (
            <Text style={[s.emptyHint, { color: colors.muted }]}>
              Toque no botão + para registrar um relato.
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id ?? Math.random().toString()}
          renderItem={({ item }) => <ReportCard report={item} colors={colors} />}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      {!isAdmin && (
        <TouchableOpacity
          style={[s.fab, { backgroundColor: colors.primary }]}
          onPress={() => setShowModal(true)}
        >
          <Text style={s.fabIcon}>+</Text>
        </TouchableOpacity>
      )}

      <CreateReportModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSaved={loadReports}
        colors={colors}
        profile={profile}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 1 }, shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1 },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardDate: { fontSize: 11 },
  cardText: { fontSize: 14, lineHeight: 20 },
  analysisRow: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  analysisTag: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, fontSize: 11, fontWeight: '600' },
  responseBox: { borderRadius: 8, padding: 10, marginTop: 10, borderWidth: 1 },
  responseLabel: { fontSize: 11, fontWeight: '700', marginBottom: 2 },
  responseText: { fontSize: 13 },
  // Modal
  modalRoot: { flex: 1 },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 1,
  },
  modalCancel: { fontSize: 15 },
  modalTitle: { fontSize: 16, fontWeight: '700' },
  modalSend: { fontSize: 15, fontWeight: '700' },
  modalLabel: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  modalTextarea: {
    borderWidth: 1, borderRadius: 12, padding: 14,
    fontSize: 15, minHeight: 160,
  },
  anonRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderRadius: 12, padding: 14, marginTop: 16,
  },
  anonTitle: { fontSize: 14, fontWeight: '600' },
  anonDesc: { fontSize: 12, marginTop: 2 },
  infoBox: { borderRadius: 10, padding: 12, marginTop: 16, borderWidth: 1 },
  infoText: { fontSize: 13, lineHeight: 18 },
});

const dynamicStyles = (colors: any) => StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: colors.foreground },
  subtitle: { fontSize: 13, color: colors.muted, marginTop: 4 },
  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { fontSize: 15, fontWeight: '600' },
  emptyHint: { fontSize: 13 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: { color: '#fff', fontSize: 28, lineHeight: 32 },
});
