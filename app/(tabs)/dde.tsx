import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, FlatList,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { saveDDEEntry, getMyDDEEntries } from '../../src/services/dde.service';
import { DDEEntry, MoodType } from '../../src/types';

const MOODS: { type: MoodType; emoji: string; label: string; color: string }[] = [
  { type: 'excellent', emoji: '😊', label: 'Excelente', color: '#2ECC71' },
  { type: 'good',      emoji: '🙂', label: 'Bem',       color: '#4A90D9' },
  { type: 'neutral',   emoji: '😐', label: 'Neutro',    color: '#F39C12' },
  { type: 'tired',     emoji: '😟', label: 'Cansado',   color: '#E67E22' },
  { type: 'bad',       emoji: '😢', label: 'Mal',       color: '#E74C3C' },
];

const STRESS_LABELS = ['', 'Muito baixo', 'Baixo', 'Moderado', 'Alto', 'Muito alto'];

export default function DDEScreen() {
  const colors = useColors();
  const { profile } = useAuth();

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [stressLevel, setStressLevel] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [entries, setEntries] = useState<DDEEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [showForm, setShowForm] = useState(true);

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
      Alert.alert('✅ Salvo!', 'Seu registro de bem-estar foi salvo.');
      setSelectedMood(null);
      setStressLevel(0);
      setNotes('');
      setShowForm(false);
      await loadEntries();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const s = dynamicStyles(colors);

  const moodColor = selectedMood ? MOODS.find(m => m.type === selectedMood)?.color : colors.border;

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Bem-estar Diário</Text>
          <Text style={s.subtitle}>Como você está se sentindo?</Text>
        </View>

        {showForm ? (
          <View style={s.card}>
            {/* Mood selector */}
            <Text style={s.sectionLabel}>Humor</Text>
            <View style={s.moodRow}>
              {MOODS.map(m => (
                <TouchableOpacity
                  key={m.type}
                  style={[
                    s.moodBtn,
                    selectedMood === m.type && { borderColor: m.color, backgroundColor: m.color + '15' },
                  ]}
                  onPress={() => setSelectedMood(m.type)}
                >
                  <Text style={{ fontSize: 28 }}>{m.emoji}</Text>
                  <Text style={[s.moodLabel, { color: selectedMood === m.type ? m.color : colors.muted }]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Stress level */}
            <Text style={[s.sectionLabel, { marginTop: 20 }]}>Nível de Estresse</Text>
            <View style={s.stressRow}>
              {[1, 2, 3, 4, 5].map(n => (
                <TouchableOpacity
                  key={n}
                  style={[
                    s.stressBtn,
                    stressLevel >= n && { backgroundColor: colors.primary },
                    stressLevel === n && { transform: [{ scale: 1.1 }] },
                  ]}
                  onPress={() => setStressLevel(n)}
                >
                  <Text style={[s.stressNum, { color: stressLevel >= n ? '#fff' : colors.muted }]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {stressLevel > 0 && (
              <Text style={[s.stressLabel, { color: colors.muted }]}>
                {STRESS_LABELS[stressLevel]}
              </Text>
            )}

            {/* Notes */}
            <Text style={[s.sectionLabel, { marginTop: 20 }]}>Observações (opcional)</Text>
            <TextInput
              style={[s.notesInput, { color: colors.foreground, borderColor: colors.border }]}
              placeholder="Como foi seu dia? Algo que queira registrar..."
              placeholderTextColor={colors.muted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[s.saveBtn, { backgroundColor: colors.secondary }, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.saveBtnText}>Salvar Registro</Text>
              }
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[s.newEntryBtn, { borderColor: colors.secondary }]}
            onPress={() => setShowForm(true)}
          >
            <Text style={[s.newEntryText, { color: colors.secondary }]}>+ Novo Registro</Text>
          </TouchableOpacity>
        )}

        {/* History */}
        <Text style={[s.historyTitle, { color: colors.foreground }]}>Últimos 7 dias</Text>
        {loadingEntries ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 16 }} />
        ) : entries.length === 0 ? (
          <View style={[s.emptyBox, { borderColor: colors.border }]}>
            <Text style={{ fontSize: 32 }}>📊</Text>
            <Text style={[s.emptyText, { color: colors.muted }]}>Nenhum registro ainda.</Text>
          </View>
        ) : (
          entries.map((entry, i) => {
            const mood = MOODS.find(m => m.type === entry.mood);
            const date = entry.createdAt?.toDate?.() ?? new Date();
            return (
              <View key={entry.id ?? i} style={[s.entryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[s.entryMoodDot, { backgroundColor: mood?.color ?? colors.muted }]} />
                <View style={{ flex: 1 }}>
                  <View style={s.entryRow}>
                    <Text style={[s.entryMood, { color: colors.foreground }]}>
                      {mood?.emoji} {mood?.label}
                    </Text>
                    <Text style={[s.entryDate, { color: colors.muted }]}>
                      {date.toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Text style={[s.entryStress, { color: colors.muted }]}>
                    Estresse: {STRESS_LABELS[entry.stressLevel]}
                  </Text>
                  {entry.notes && (
                    <Text style={[s.entryNotes, { color: colors.muted }]} numberOfLines={2}>
                      {entry.notes}
                    </Text>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: colors.foreground },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 4 },
  card: {
    margin: 20, backgroundColor: colors.surface, borderRadius: 16,
    padding: 20, shadowColor: '#000', shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 3,
  },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: colors.foreground, marginBottom: 10 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: {
    alignItems: 'center', padding: 8, borderRadius: 12,
    borderWidth: 2, borderColor: 'transparent', width: 60,
  },
  moodLabel: { fontSize: 10, marginTop: 4, fontWeight: '600' },
  stressRow: { flexDirection: 'row', gap: 8 },
  stressBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  stressNum: { fontSize: 16, fontWeight: '700' },
  stressLabel: { fontSize: 12, marginTop: 6, textAlign: 'center' },
  notesInput: {
    borderWidth: 1, borderRadius: 10, padding: 12,
    fontSize: 14, minHeight: 80, backgroundColor: colors.background,
  },
  saveBtn: {
    borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginTop: 20,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  newEntryBtn: {
    margin: 20, borderRadius: 12, borderWidth: 2,
    paddingVertical: 14, alignItems: 'center',
  },
  newEntryText: { fontSize: 15, fontWeight: '700' },
  historyTitle: { fontSize: 16, fontWeight: '700', marginHorizontal: 20, marginTop: 8, marginBottom: 12 },
  emptyBox: {
    margin: 20, borderRadius: 12, borderWidth: 1,
    padding: 24, alignItems: 'center', gap: 8,
  },
  emptyText: { fontSize: 14 },
  entryCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginHorizontal: 20, marginBottom: 10,
    borderRadius: 12, padding: 14, borderWidth: 1, gap: 10,
  },
  entryMoodDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  entryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entryMood: { fontSize: 14, fontWeight: '600' },
  entryDate: { fontSize: 11 },
  entryStress: { fontSize: 12, marginTop: 2 },
  entryNotes: { fontSize: 12, marginTop: 4, fontStyle: 'italic' },
});
