import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, ActivityIndicator, Alert, Switch,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import {
  getChecklistById,
  submitChecklistResponse,
  hasUserRespondedChecklist,
} from '../../src/services/checklist.service';
import { Checklist, ChecklistQuestion, ChecklistAnswer } from '../../src/types';

// ─── Question Renderers ──────────────────────────────────────

function LikertQuestion({ question, value, onChange, colors }: any) {
  const labels = ['', 'Discordo totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo totalmente'];
  return (
    <View>
      <View style={styles.likertRow}>
        {[1, 2, 3, 4, 5].map(n => (
          <TouchableOpacity
            key={n}
            style={[
              styles.likertBtn,
              { borderColor: value === n ? colors.primary : colors.border },
              value === n && { backgroundColor: colors.primary },
            ]}
            onPress={() => onChange(n)}
          >
            <Text style={[styles.likertNum, { color: value === n ? '#fff' : colors.foreground }]}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {value > 0 && (
        <Text style={[styles.likertLabel, { color: colors.muted }]}>{labels[value]}</Text>
      )}
    </View>
  );
}

function MultipleChoiceQuestion({ question, value, onChange, colors }: any) {
  return (
    <View style={{ gap: 8 }}>
      {(question.options ?? []).map((opt: string) => (
        <TouchableOpacity
          key={opt}
          style={[
            styles.optionBtn,
            { borderColor: value === opt ? colors.primary : colors.border,
              backgroundColor: value === opt ? colors.primary + '15' : colors.background },
          ]}
          onPress={() => onChange(opt)}
        >
          <View style={[
            styles.optionDot,
            { borderColor: value === opt ? colors.primary : colors.border,
              backgroundColor: value === opt ? colors.primary : 'transparent' },
          ]} />
          <Text style={[styles.optionText, { color: colors.foreground }]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function CheckboxQuestion({ question, value, onChange, colors }: any) {
  const selected: string[] = Array.isArray(value) ? value : [];
  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
    else onChange([...selected, opt]);
  };
  return (
    <View style={{ gap: 8 }}>
      {(question.options ?? []).map((opt: string) => {
        const checked = selected.includes(opt);
        return (
          <TouchableOpacity
            key={opt}
            style={[
              styles.optionBtn,
              { borderColor: checked ? colors.primary : colors.border,
                backgroundColor: checked ? colors.primary + '15' : colors.background },
            ]}
            onPress={() => toggle(opt)}
          >
            <View style={[
              styles.checkBox,
              { borderColor: checked ? colors.primary : colors.border,
                backgroundColor: checked ? colors.primary : 'transparent' },
            ]}>
              {checked && <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>✓</Text>}
            </View>
            <Text style={[styles.optionText, { color: colors.foreground }]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function YesNoQuestion({ value, onChange, colors }: any) {
  return (
    <View style={styles.yesNoRow}>
      {['Sim', 'Não'].map(opt => (
        <TouchableOpacity
          key={opt}
          style={[
            styles.yesNoBtn,
            { borderColor: value === opt ? colors.primary : colors.border,
              backgroundColor: value === opt ? colors.primary : colors.background },
          ]}
          onPress={() => onChange(opt)}
        >
          <Text style={[styles.yesNoText, { color: value === opt ? '#fff' : colors.foreground }]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function TextQuestion({ value, onChange, colors }: any) {
  return (
    <TextInput
      style={[styles.textInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
      placeholder="Digite sua resposta..."
      placeholderTextColor={colors.muted}
      value={value ?? ''}
      onChangeText={onChange}
      multiline
      numberOfLines={3}
      textAlignVertical="top"
    />
  );
}

function DateQuestion({ value, onChange, colors }: any) {
  return (
    <TextInput
      style={[styles.textInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
      placeholder="DD/MM/AAAA"
      placeholderTextColor={colors.muted}
      value={value ?? ''}
      onChangeText={onChange}
      keyboardType="numeric"
      maxLength={10}
    />
  );
}

// ─── Main Screen ─────────────────────────────────────────────

export default function ChecklistResponseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { profile } = useAuth();

  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alreadyDone, setAlreadyDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!profile || !id) return;
      setLoading(true);
      try {
        const [cl, done] = await Promise.all([
          getChecklistById(profile.prefectureId, id),
          hasUserRespondedChecklist(profile.uid, id),
        ]);
        if (done) { setAlreadyDone(true); setLoading(false); return; }
        if (cl) {
          const sorted = [...(cl.questions ?? [])].sort((a, b) => a.order - b.order);
          setChecklist({ ...cl, questions: sorted });
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, profile]);

  const questions = checklist?.questions ?? [];
  const total = questions.length;
  const current = questions[currentIndex];

  const setAnswer = (qId: string, val: any) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
    setErrors(prev => { const e = { ...prev }; delete e[qId]; return e; });
  };

  const validateCurrent = () => {
    if (!current?.required) return true;
    const val = answers[current.id];
    if (val === undefined || val === null || val === '' ||
        (Array.isArray(val) && val.length === 0)) {
      setErrors(prev => ({ ...prev, [current.id]: 'Esta questão é obrigatória.' }));
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateCurrent()) return;
    if (currentIndex < total - 1) setCurrentIndex(i => i + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  };

  const handleSubmit = async () => {
    if (!validateCurrent()) return;
    if (!profile || !checklist) return;

    // Validate all required
    const missing: Record<string, string> = {};
    questions.forEach(q => {
      if (!q.required) return;
      const val = answers[q.id];
      if (val === undefined || val === null || val === '' ||
          (Array.isArray(val) && val.length === 0)) {
        missing[q.id] = 'Obrigatório';
      }
    });
    if (Object.keys(missing).length > 0) {
      setErrors(missing);
      Alert.alert('Atenção', 'Responda todas as questões obrigatórias antes de enviar.');
      return;
    }

    setSubmitting(true);
    try {
      const answerList: ChecklistAnswer[] = questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id] ?? '',
      }));
      await submitChecklistResponse({
        checklistId: checklist.id!,
        userId: profile.uid,
        prefectureId: profile.prefectureId,
        submissionDate: null,
        answers: answerList,
      });
      router.replace('/checklists/success' as any);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível enviar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const s = dynamicStyles(colors);

  if (loading) return (
    <ScreenContainer>
      <ActivityIndicator color={colors.primary} style={{ marginTop: 60 }} />
    </ScreenContainer>
  );

  if (alreadyDone) return (
    <ScreenContainer>
      <View style={s.center}>
        <Text style={{ fontSize: 48 }}>✅</Text>
        <Text style={[s.doneTitle, { color: colors.foreground }]}>Já respondido!</Text>
        <Text style={[s.doneDesc, { color: colors.muted }]}>
          Você já respondeu este questionário anteriormente.
        </Text>
        <TouchableOpacity style={[s.backBtn2, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
          <Text style={s.backBtn2Text}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );

  if (!checklist || total === 0) return (
    <ScreenContainer>
      <View style={s.center}>
        <Text style={[s.doneTitle, { color: colors.foreground }]}>Questionário não encontrado.</Text>
        <TouchableOpacity style={[s.backBtn2, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
          <Text style={s.backBtn2Text}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );

  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={[s.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[s.backIcon, { color: colors.primary }]}>‹</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[s.headerTitle, { color: colors.foreground }]} numberOfLines={1}>
            {checklist.title}
          </Text>
          <Text style={[s.progressText, { color: colors.muted }]}>
            {currentIndex + 1} de {total}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[s.progressBar, { backgroundColor: colors.border }]}>
        <View style={[s.progressFill, { backgroundColor: colors.primary, width: `${progress}%` as any }]} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Question card */}
        <View style={[s.questionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={s.questionHeader}>
            <View style={[s.questionNum, { backgroundColor: colors.primary }]}>
              <Text style={s.questionNumText}>{currentIndex + 1}</Text>
            </View>
            {current.required && (
              <Text style={[s.required, { color: colors.error }]}>* Obrigatória</Text>
            )}
          </View>
          <Text style={[s.questionTitle, { color: colors.foreground }]}>{current.title}</Text>

          <View style={{ marginTop: 16 }}>
            {current.type === 'likert' && (
              <LikertQuestion question={current} value={answers[current.id]} onChange={(v: any) => setAnswer(current.id, v)} colors={colors} />
            )}
            {current.type === 'multiple_choice' && (
              <MultipleChoiceQuestion question={current} value={answers[current.id]} onChange={(v: any) => setAnswer(current.id, v)} colors={colors} />
            )}
            {current.type === 'checkbox' && (
              <CheckboxQuestion question={current} value={answers[current.id]} onChange={(v: any) => setAnswer(current.id, v)} colors={colors} />
            )}
            {current.type === 'yes_no' && (
              <YesNoQuestion value={answers[current.id]} onChange={(v: any) => setAnswer(current.id, v)} colors={colors} />
            )}
            {current.type === 'text' && (
              <TextQuestion value={answers[current.id]} onChange={(v: any) => setAnswer(current.id, v)} colors={colors} />
            )}
            {current.type === 'date' && (
              <DateQuestion value={answers[current.id]} onChange={(v: any) => setAnswer(current.id, v)} colors={colors} />
            )}
          </View>

          {errors[current.id] && (
            <Text style={[s.errorText, { color: colors.error }]}>⚠ {errors[current.id]}</Text>
          )}
        </View>

        {/* Navigation */}
        <View style={s.navRow}>
          {currentIndex > 0 ? (
            <TouchableOpacity style={[s.navBtn, { borderColor: colors.border }]} onPress={goPrev}>
              <Text style={[s.navBtnText, { color: colors.foreground }]}>← Anterior</Text>
            </TouchableOpacity>
          ) : <View style={{ flex: 1 }} />}

          {currentIndex < total - 1 ? (
            <TouchableOpacity style={[s.navBtnPrimary, { backgroundColor: colors.primary }]} onPress={goNext}>
              <Text style={s.navBtnPrimaryText}>Próxima →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[s.navBtnPrimary, { backgroundColor: colors.success }, submitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.navBtnPrimaryText}>Enviar ✓</Text>
              }
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  likertRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  likertBtn: {
    flex: 1, height: 44, borderRadius: 10, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  likertNum: { fontSize: 16, fontWeight: '700' },
  likertLabel: { fontSize: 12, textAlign: 'center', marginTop: 6 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 10, borderWidth: 1.5, padding: 12,
  },
  optionDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2 },
  checkBox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  optionText: { fontSize: 14, flex: 1 },
  yesNoRow: { flexDirection: 'row', gap: 12 },
  yesNoBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 10,
    borderWidth: 2, alignItems: 'center',
  },
  yesNoText: { fontSize: 16, fontWeight: '700' },
  textInput: {
    borderWidth: 1, borderRadius: 10, padding: 12,
    fontSize: 15, minHeight: 80,
  },
});

const dynamicStyles = (colors: any) => StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
  },
  backIcon: { fontSize: 32, lineHeight: 36 },
  headerTitle: { fontSize: 15, fontWeight: '700' },
  progressText: { fontSize: 11, marginTop: 1 },
  progressBar: { height: 4 },
  progressFill: { height: 4 },
  questionCard: {
    borderRadius: 16, padding: 20, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
    elevation: 3,
  },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  questionNum: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  questionNumText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  required: { fontSize: 11, fontWeight: '600' },
  questionTitle: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  errorText: { fontSize: 12, marginTop: 10, fontWeight: '600' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 12 },
  navBtn: {
    flex: 1, borderRadius: 10, paddingVertical: 13,
    alignItems: 'center', borderWidth: 1.5,
  },
  navBtnText: { fontSize: 14, fontWeight: '600' },
  navBtnPrimary: {
    flex: 1, borderRadius: 10, paddingVertical: 13, alignItems: 'center',
  },
  navBtnPrimaryText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  doneTitle: { fontSize: 20, fontWeight: '700' },
  doneDesc: { fontSize: 14, textAlign: 'center' },
  backBtn2: { borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  backBtn2Text: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
