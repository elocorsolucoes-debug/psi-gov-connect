import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { saveDDEEntry, getMyDDEEntries } from '../../src/services/dde.service';
import { DDEEntry, MoodType } from '../../src/types';
import { AnimatedScreen } from '@/components/animations/animated-screen';
import { SectionHeader } from '@/components/ui/section-header';

const MOODS: { type: MoodType; emoji: string; label: string; color: string }[] = [
  { type: 'excellent', emoji: '😊', label: 'Excelente', color: '#4CAF50' },
  { type: 'good',      emoji: '🙂', label: 'Bem',       color: '#1E88E5' },
  { type: 'neutral',   emoji: '😐', label: 'Neutro',    color: '#FF9800' },
  { type: 'tired',     emoji: '😟', label: 'Cansado',   color: '#E65100' },
  { type: 'bad',       emoji: '😢', label: 'Mal',       color: '#F44336' },
];

const STRESS_LABELS: Record<number, string> = {
  1: 'Mínimo', 2: 'Muito baixo', 3: 'Baixo', 4: 'Moderado-baixo',
  5: 'Moderado', 6: 'Moderado-alto', 7: 'Alto', 8: 'Muito alto',
  9: 'Severo', 10: 'Extremo',
};

function getStressColor(level: number): string {
  if (level <= 2) return '#4CAF50';
  if (level <= 4) return '#8BC34A';
  if (level <= 6) return '#FF9800';
  if (level <= 8) return '#FF5722';
  return '#F44336';
}

export default function DDEScreen() {
  const colors = useColors();
  const { profile } = useAuth();

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [stressLevel, setStressLevel] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [entries, setEntries] = useState<DDEEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  const loadEntries = useCallback(async () => {
    if (!profile) return;
    setLoadingEntries(true);
    try {
      const data = await getMyDDEEntries(profile.uid);
      setEntries(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoadingEntries(false);
    }
  }, [profile]);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  const handleSave = async () => {
    if (!selectedMood) { Alert.alert('Atenção', 'Selecione seu humor.'); return; }
    if (stressLevel === 0) { Alert.alert('Atenção', 'Selecione seu nível de estresse.'); return; }
    if (!profile) return;

    setSaving(true);
    try {
      await saveDDEEntry({
        userId: profile.uid,
        prefectureId: profile.prefectureId,
        mood: selectedMood,
        stressLevel,
        notes: notes.trim() || undefined,
      });
      Alert.alert('✅ Salvo!', 'Seu registro de bem-estar foi salvo com sucesso.');
      setSelectedMood(null);
      setStressLevel(0);
      setNotes('');
      await loadEntries();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatedScreen animation="slideInRight" duration={400}>
      <ScreenContainer>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View>
              <Text style={[styles.title, { color: colors.foreground }]}>Bem-estar Diário</Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>Como você está se sentindo?</Text>
            </View>
          </View>

          {/* ─── Form Card ─── */}
          <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            
            {/* Mood Selector */}
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Humor</Text>
            <View style={styles.moodRow}>
              {MOODS.map(m => (
                <TouchableOpacity
                  key={m.type}
                  style={[
                    styles.moodBtn,
                    { borderColor: 'transparent', backgroundColor: colors.background },
                    selectedMood === m.type && {
                      borderColor: m.color,
                      backgroundColor: m.color + '18',
                    },
                  ]}
                  onPress={() => setSelectedMood(m.type)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text style={[
                    styles.moodLabel,
                    { color: selectedMood === m.type ? m.color : colors.muted },
                  ]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Stress Level — 1 to 10 */}
            <Text style={[styles.sectionLabel, { color: colors.foreground, marginTop: 24 }]}>
              Nível de Estresse
            </Text>
            <View style={styles.stressRow}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => {
                const active = stressLevel >= n;
                const stressColor = getStressColor(n);
                return (
                  <TouchableOpacity
                    key={n}
                    style={[
                      styles.stressBtn,
                      {
                        backgroundColor: active ? stressColor : colors.background,
                        borderColor: active ? stressColor : colors.border,
                      },
                    ]}
                    onPress={() => setStressLevel(n)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.stressNum, { color: active ? '#fff' : colors.muted }]}>
                      {n}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {stressLevel > 0 && (
              <View style={styles.stressLabelRow}>
                <Text style={[styles.stressLabelText, { color: getStressColor(stressLevel) }]}>
                  {stressLevel}/10 — {STRESS_LABELS[stressLevel]}
                </Text>
              </View>
            )}

            {/* Notes */}
            <Text style={[styles.sectionLabel, { color: colors.foreground, marginTop: 24 }]}>
              Observações (opcional)
            </Text>
            <TextInput
              style={[styles.notesInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
              placeholder="Como foi seu dia? Algo que queira registrar..."
              placeholderTextColor={colors.muted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primary }, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveBtnText}>Salvar Registro</Text>
              }
            </TouchableOpacity>
          </View>

          {/* ─── History Section ─── */}
          <SectionHeader
            title="Histórico – últimos 7 dias"
            color={colors.muted}
            borderColor={colors.border}
            marginTop={8}
            marginBottom={16}
          />

          {loadingEntries ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 16 }} />
          ) : entries.length === 0 ? (
            <View style={[styles.emptyBox, { borderColor: colors.border }]}>
              <Text style={{ fontSize: 32 }}>📊</Text>
              <Text style={[styles.emptyText, { color: colors.muted }]}>Nenhum registro ainda.</Text>
              <Text style={[styles.emptyHint, { color: colors.muted }]}>Salve seu primeiro registro acima!</Text>
            </View>
          ) : (
            entries.map((entry, i) => {
              const mood = MOODS.find(m => m.type === entry.mood);
              const date = entry.createdAt?.toDate?.() ?? new Date();
              return (
                <View
                  key={entry.id ?? i}
                  style={[
                    styles.entryCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  {/* Left color bar */}
                  <View style={[styles.entryAccentBar, { backgroundColor: mood?.color ?? colors.muted }]} />
                  <View style={{ flex: 1, paddingLeft: 12 }}>
                    <View style={styles.entryRow}>
                      <Text style={[styles.entryMood, { color: colors.foreground }]}>
                        {mood?.emoji} {mood?.label}
                      </Text>
                      <Text style={[styles.entryDate, { color: colors.muted }]}>
                        {date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })},
                        {' '}{date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                    <View style={styles.stressPillRow}>
                      <View style={[styles.stressPill, { backgroundColor: getStressColor(entry.stressLevel) + '20', borderColor: getStressColor(entry.stressLevel) + '60' }]}>
                        <Text style={[styles.stressPillText, { color: getStressColor(entry.stressLevel) }]}>
                          Estresse {entry.stressLevel}/10
                        </Text>
                      </View>
                    </View>
                    {entry.notes && (
                      <Text style={[styles.entryNotes, { color: colors.muted }]} numberOfLines={2}>
                        "{entry.notes}"
                      </Text>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </ScreenContainer>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 4, fontWeight: '500' },
  // ─── Form Card ───
  formCard: {
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 4,
  },
  sectionLabel: { fontSize: 13, fontWeight: '700', marginBottom: 12, letterSpacing: 0.2 },
  // ─── Mood ───
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 2,
    width: 60,
    gap: 4,
  },
  moodEmoji: { fontSize: 30 },
  moodLabel: { fontSize: 9, fontWeight: '700', textAlign: 'center' },
  // ─── Stress ───
  stressRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  stressBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  stressNum: { fontSize: 13, fontWeight: '700' },
  stressLabelRow: { marginTop: 8, alignItems: 'center' },
  stressLabelText: { fontSize: 12, fontWeight: '700' },
  // ─── Notes ───
  notesInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    minHeight: 88,
  },
  // ─── Save Button ───
  saveBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  // ─── Empty ───
  emptyBox: {
    marginHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: { fontSize: 15, fontWeight: '600' },
  emptyHint: { fontSize: 12, fontWeight: '500' },
  // ─── Entry Cards ───
  entryCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingRight: 14,
    overflow: 'hidden',
  },
  entryAccentBar: { width: 4, borderRadius: 4, marginLeft: 0 },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  entryMood: { fontSize: 14, fontWeight: '700' },
  entryDate: { fontSize: 11, fontWeight: '500' },
  stressPillRow: { flexDirection: 'row' },
  stressPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  stressPillText: { fontSize: 11, fontWeight: '700' },
  entryNotes: { fontSize: 12, marginTop: 6, fontStyle: 'italic', lineHeight: 16 },
});
