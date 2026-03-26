import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { registerWithEmail } from '../../src/services/auth.service';
import { createUserProfile } from '../../src/services/user.service';
import { useColors } from '@/hooks/use-colors';

export default function RegisterScreen() {
  const colors = useColors();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [prefectureId, setPrefectureId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !prefectureId) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      const cred = await registerWithEmail(email.trim(), password);
      await createUserProfile(cred.user.uid, {
        uid: cred.user.uid,
        email: email.trim(),
        firstName,
        lastName,
        role: 'SERVIDOR_PUBLICO',
        prefectureId: prefectureId.trim(),
      });
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err?.code === 'auth/email-already-in-use'
        ? 'Este e-mail já está cadastrado.'
        : 'Erro ao criar conta. Tente novamente.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  const s = styles(colors);

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <Text style={s.title}>Criar Conta</Text>
          <Text style={s.subtitle}>PSI-Gov Connect</Text>
        </View>

        <View style={s.card}>
          <View style={s.row}>
            <View style={s.half}>
              <Text style={s.label}>Nome *</Text>
              <TextInput style={s.input} placeholder="João" placeholderTextColor={colors.muted}
                value={firstName} onChangeText={setFirstName} />
            </View>
            <View style={[s.half, { marginLeft: 12 }]}>
              <Text style={s.label}>Sobrenome *</Text>
              <TextInput style={s.input} placeholder="Silva" placeholderTextColor={colors.muted}
                value={lastName} onChangeText={setLastName} />
            </View>
          </View>

          <Text style={[s.label, { marginTop: 16 }]}>E-mail *</Text>
          <TextInput style={s.input} placeholder="seu@email.gov.br"
            placeholderTextColor={colors.muted} value={email} onChangeText={setEmail}
            keyboardType="email-address" autoCapitalize="none" />

          <Text style={[s.label, { marginTop: 16 }]}>Senha *</Text>
          <TextInput style={s.input} placeholder="Mínimo 6 caracteres"
            placeholderTextColor={colors.muted} value={password} onChangeText={setPassword}
            secureTextEntry />

          <Text style={[s.label, { marginTop: 16 }]}>ID da Prefeitura *</Text>
          <TextInput style={s.input} placeholder="ex: prefeitura-sp-001"
            placeholderTextColor={colors.muted} value={prefectureId}
            onChangeText={setPrefectureId} autoCapitalize="none" />

          <TouchableOpacity
            style={[s.btn, loading && s.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>Criar Conta</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={s.linkBtn} onPress={() => router.back()}>
            <Text style={s.linkText}>Já tem conta? <Text style={s.linkBold}>Entrar</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60 },
  header: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '800', color: colors.foreground },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 4 },
  card: {
    backgroundColor: colors.surface, borderRadius: 16,
    padding: 24, shadowColor: '#000', shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 3,
  },
  row: { flexDirection: 'row' },
  half: { flex: 1 },
  label: { fontSize: 13, fontWeight: '600', color: colors.foreground, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: colors.foreground, backgroundColor: colors.background,
  },
  btn: {
    backgroundColor: colors.primary, borderRadius: 10,
    paddingVertical: 14, alignItems: 'center', marginTop: 24,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  linkBtn: { alignItems: 'center', marginTop: 16 },
  linkText: { color: colors.muted, fontSize: 14 },
  linkBold: { color: colors.accent, fontWeight: '700' },
});
