import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  ActivityIndicator, Alert, TextInput, Switch, Modal, ScrollView, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { createReport, getMyReports, getAllReports } from '../../src/services/reports.service';
import { Report, hasMinRole } from '../../src/types';

const { width } = Dimensions.get('window');

const STATUS_CONFIG: Record<string, { color: string; emoji: string }> = {
  'Enviado': { color: '#3b82f6', emoji: '📤' },
  'Visualizado': { color: '#8b5cf6', emoji: '👁️' },
  'Em Análise': { color: '#f59e0b', emoji: '🔍' },
  'Respondido': { color: '#10b981', emoji: '✅' },
};

function ReportCard({ report, colors }: { report: Report; colors: any }) {
  const date = report.createdAt?.toDate?.() ?? new Date();
  const status = STATUS_CONFIG[report.status] || { color: colors.muted, emoji: '📋' };
  const dateStr = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              {report.isAnonymous ? '🔒 Anônimo' : '👤 Seu relato'}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: status.color + '20', borderColor: status.color },
              ]}
            >
              <Text style={{ fontSize: 11 }}>{status.emoji}</Text>
              <Text style={[styles.statusText, { color: status.color }]}>
                {report.status}
              </Text>
            </View>
          </View>
          <Text style={[styles.cardDate, { color: colors.muted }]}>{dateStr}</Text>
        </View>
      </View>

      <Text
        style={[styles.cardText, { color: colors.foreground }]}
        numberOfLines={3}
      >
        {report.reportText}
      </Text>

      {report.analysis && (
        <View
          style={[
            styles.analysisBox,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          {report.analysis.category && (
            <View style={styles.analysisItem}>
              <Text style={[styles.analysisLabel, { color: colors.muted }]}>
                Categoria:
              </Text>
              <Text style={[styles.analysisValue, { color: colors.foreground }]}>
                {report.analysis.category}
              </Text>
            </View>
          )}
          {report.analysis.priority && (
            <View style={styles.analysisItem}>
              <Text style={[styles.analysisLabel, { color: colors.muted }]}>
                Prioridade:
              </Text>
              <Text style={[styles.analysisValue, { color: colors.foreground }]}>
                {report.analysis.priority}
              </Text>
            </View>
          )}
        </View>
      )}

      {report.response && (
        <View
          style={[
            styles.responseBox,
            { backgroundColor: colors.accent + '10', borderColor: colors.accent },
          ]}
        >
          <Text style={[styles.responseLabel, { color: colors.accent }]}>
            ✓ Resposta:
          </Text>
          <Text style={[styles.responseText, { color: colors.foreground }]}>
            {report.response}
          </Text>
        </View>
      )}
    </View>
  );
}

function CreateReportModal({
  visible,
  onClose,
  onSaved,
  colors,
  profile,
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
    if (!text.trim()) {
      Alert.alert('Atenção', 'Descreva o ocorrido.');
      return;
    }
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
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              Novo Relato
            </Text>
            <TouchableOpacity onPress={onClose} disabled={saving}>
              <Text style={[styles.closeBtn, { color: colors.muted }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.inputLabel, { color: colors.foreground }]}>
              Descreva o ocorrido
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
              ]}
              placeholder="Relate o que aconteceu com o máximo de detalhes possível..."
              placeholderTextColor={colors.muted}
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!saving}
            />

            {/* Anonymous Toggle */}
            <View
              style={[
                styles.toggleContainer,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.toggleLabel, { color: colors.foreground }]}>
                  Relato Anônimo
                </Text>
                <Text style={[styles.toggleDesc, { color: colors.muted }]}>
                  Seu nome não será vinculado
                </Text>
              </View>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
                disabled={saving}
              />
            </View>

            {/* Info Box */}
            <View
              style={[
                styles.infoBox,
                { backgroundColor: colors.accent + '15', borderColor: colors.accent },
              ]}
            >
              <Text style={[styles.infoText, { color: colors.accent }]}>
                ℹ️ Seu relato será analisado automaticamente para categorização e priorização.
              </Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              onPress={onClose}
              disabled={saving}
              style={[styles.cancelBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.cancelBtnText, { color: colors.foreground }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!text.trim() || saving}
              style={{ flex: 1, borderRadius: 10, overflow: 'hidden' }}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.submitBtn,
                  { opacity: !text.trim() || saving ? 0.6 : 1 },
                ]}
              >
                <Text style={styles.submitBtnText}>
                  {saving ? 'Enviando...' : 'Enviar Relato'}
                </Text>
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

  useEffect(() => {
    loadReports();
  }, [loadReports]);

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
    <ScreenContainer>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.title}>Relatos</Text>
        <Text style={dynamicStyles.subtitle}>
          {isAdmin ? 'Todos os relatos da prefeitura' : 'Compartilhe suas preocupações'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : reports.length === 0 ? (
        <View style={styles.centerContainer}>
          <View
            style={[
              styles.emptyBox,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📋</Text>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Nenhum relato encontrado
            </Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              {isAdmin
                ? 'Não há relatos da prefeitura ainda'
                : 'Clique em "Novo Relato" para começar'}
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id ?? Math.random().toString()}
          renderItem={({ item }) => <ReportCard report={item} colors={colors} />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        />
      )}

      {/* FAB - New Report */}
      {!isAdmin && (
        <View style={styles.fabContainer}>
          <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={0.8}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.fab}
            >
              <Text style={styles.fabText}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Create Report Modal */}
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
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
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
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
  cardDate: {
    fontSize: 11,
    fontWeight: '500',
  },
  cardText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  analysisBox: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    gap: 8,
  },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analysisLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  analysisValue: {
    fontSize: 11,
    fontWeight: '700',
  },
  responseBox: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    gap: 6,
  },
  responseLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  responseText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  emptyBox: {
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
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    fontSize: 24,
    fontWeight: '600',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    minHeight: 120,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: 11,
    fontWeight: '500',
  },
  infoBox: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  submitBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
