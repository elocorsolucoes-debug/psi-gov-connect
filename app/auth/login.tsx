import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { loginWithEmail } from '../../src/services/auth.service';
import { useColors } from '@/hooks/use-colors';

export default function LoginScreen() {
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err?.code === 'auth/invalid-credential'
        ? 'E-mail ou senha incorretos.'
        : 'Erro ao fazer login. Tente novamente.';
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
        {/* Logo / Header */}
        <View style={s.header}>
          <View style={s.logoCircle}>
            <Text style={s.logoText}>PSI</Text>
          </View>
          <Text style={s.title}>PSI-Gov Connect</Text>
          <Text style={s.subtitle}>Plataforma de Saúde Psicossocial</Text>
        </View>

        {/* Form */}
        <View style={s.card}>
          <Text style={s.label}>E-mail institucional</Text>
          <TextInput
            style={s.input}
            placeholder="seu@email.gov.br"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />

          <Text style={[s.label, { marginTop: 16 }]}>Senha</Text>
          <TextInput
            style={s.input}
            placeholder="••••••••"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity
            style={[s.btn, loading && s.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>Entrar</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={s.linkBtn}
            onPress={() => router.push('/auth/register' as any)}
          >
            <Text style={s.linkText}>Não tem conta? <Text style={s.linkBold}>Cadastre-se</Text></Text>
          </TouchableOpacity>
        </View>

        <Text style={s.footer}>
          Acesso restrito a servidores públicos autorizados.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.primary, shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 12,
    elevation: 6,
  },
  logoText: { color: '#fff', fontSize: 24, fontWeight: '800' },
  title: { fontSize: 22, fontWeight: '700', color: colors.foreground },
  subtitle: { fontSize: 13, color: colors.muted, marginTop: 4 },
  card: {
    backgroundColor: colors.surface, borderRadius: 16,
    padding: 24, shadowColor: '#000', shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 3,
  },
  label: { fontSize: 13, fontWeight: '600', color: colors.foreground, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: colors.foreground,
    backgroundColor: colors.background,
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
  footer: { textAlign: 'center', color: colors.muted, fontSize: 11, marginTop: 24 },
});
