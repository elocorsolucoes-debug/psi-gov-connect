import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { logout } from '../../src/services/auth.service';
import { updateUserProfile } from '../../src/services/user.service';

const ROLE_LABELS: Record<string, string> = {
  ADMIN_IPT:       'Administrador IPT',
  ADMIN:           'Administrador',
  PREFEITO:        'Prefeito',
  SECRETARIO:      'Secretário',
  AUDITOR:         'Auditor',
  COORDENADOR:     'Coordenador',
  GESTOR:          'Gestor',
  SERVIDOR_PUBLICO:'Servidor Público',
  TECNICO:         'Técnico',
  TERCEIROS:       'Terceiros',
};

export default function ProfileScreen() {
  const colors = useColors();
  const { profile, refreshProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(profile?.firstName ?? '');
  const [lastName, setLastName] = useState(profile?.lastName ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [cpf, setCpf] = useState(profile?.cpf ?? '');
  const [saving, setSaving] = useState(false);

  const initials = `${profile?.firstName?.[0] ?? ''}${profile?.lastName?.[0] ?? ''}`.toUpperCase();

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateUserProfile(profile.uid, { firstName, lastName, phone, cpf });
      await refreshProfile();
      setEditing(false);
      Alert.alert('✅ Salvo!', 'Perfil atualizado com sucesso.');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login' as any);
          },
        },
      ],
    );
  };

  const s = dynamicStyles(colors);

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Perfil</Text>
          <TouchableOpacity
            style={[s.editBtn, { borderColor: colors.primary }]}
            onPress={() => {
              if (editing) {
                setFirstName(profile?.firstName ?? '');
                setLastName(profile?.lastName ?? '');
                setPhone(profile?.phone ?? '');
                setCpf(profile?.cpf ?? '');
              }
              setEditing(!editing);
            }}
          >
            <Text style={[s.editBtnText, { color: colors.primary }]}>
              {editing ? 'Cancelar' : 'Editar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={s.avatarSection}>
          {profile?.photoURL ? (
            <View style={[s.avatarCircle, { backgroundColor: colors.primary }]}>
              <Text style={s.avatarInitials}>{initials}</Text>
            </View>
          ) : (
            <View style={[s.avatarCircle, { backgroundColor: colors.primary }]}>
              <Text style={s.avatarInitials}>{initials || '?'}</Text>
            </View>
          )}
          <Text style={[s.avatarName, { color: colors.foreground }]}>
            {profile?.firstName} {profile?.lastName}
          </Text>
          <View style={[s.roleBadge, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
            <Text style={[s.roleText, { color: colors.primary }]}>
              {ROLE_LABELS[profile?.role ?? ''] ?? profile?.role}
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[s.cardTitle, { color: colors.foreground }]}>Informações Pessoais</Text>

          <View style={s.row}>
            <View style={s.half}>
              <Text style={[s.label, { color: colors.muted }]}>Nome</Text>
              {editing ? (
                <TextInput
                  style={[s.input, { color: colors.foreground, borderColor: colors.border }]}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Nome"
                  placeholderTextColor={colors.muted}
                />
              ) : (
                <Text style={[s.value, { color: colors.foreground }]}>{profile?.firstName || '—'}</Text>
              )}
            </View>
            <View style={[s.half, { marginLeft: 12 }]}>
              <Text style={[s.label, { color: colors.muted }]}>Sobrenome</Text>
              {editing ? (
                <TextInput
                  style={[s.input, { color: colors.foreground, borderColor: colors.border }]}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Sobrenome"
                  placeholderTextColor={colors.muted}
                />
              ) : (
                <Text style={[s.value, { color: colors.foreground }]}>{profile?.lastName || '—'}</Text>
              )}
            </View>
          </View>

          <View style={s.field}>
            <Text style={[s.label, { color: colors.muted }]}>E-mail</Text>
            <Text style={[s.value, { color: colors.muted }]}>{profile?.email}</Text>
            <Text style={[s.immutable, { color: colors.muted }]}>Não editável</Text>
          </View>

          <View style={s.field}>
            <Text style={[s.label, { color: colors.muted }]}>Telefone</Text>
            {editing ? (
              <TextInput
                style={[s.input, { color: colors.foreground, borderColor: colors.border }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="(00) 00000-0000"
                placeholderTextColor={colors.muted}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={[s.value, { color: colors.foreground }]}>{profile?.phone || '—'}</Text>
            )}
          </View>

          <View style={s.field}>
            <Text style={[s.label, { color: colors.muted }]}>CPF</Text>
            {editing ? (
              <TextInput
                style={[s.input, { color: colors.foreground, borderColor: colors.border }]}
                value={cpf}
                onChangeText={setCpf}
                placeholder="000.000.000-00"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                maxLength={14}
              />
            ) : (
              <Text style={[s.value, { color: colors.foreground }]}>{profile?.cpf || '—'}</Text>
            )}
          </View>

          <View style={s.field}>
            <Text style={[s.label, { color: colors.muted }]}>Prefeitura ID</Text>
            <Text style={[s.value, { color: colors.muted }]}>{profile?.prefectureId || '—'}</Text>
          </View>

          {editing && (
            <TouchableOpacity
              style={[s.saveBtn, { backgroundColor: colors.primary }, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.saveBtnText}>Salvar Alterações</Text>
              }
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Actions */}
        <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[s.cardTitle, { color: colors.foreground }]}>Ações</Text>
          <TouchableOpacity
            style={[s.actionRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/checklists' as any)}
          >
            <Text style={{ fontSize: 20 }}>📋</Text>
            <Text style={[s.actionText, { color: colors.foreground }]}>Meus Questionários</Text>
            <Text style={[s.actionArrow, { color: colors.muted }]}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.actionRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/action-plans' as any)}
          >
            <Text style={{ fontSize: 20 }}>📌</Text>
            <Text style={[s.actionText, { color: colors.foreground }]}>Planos de Ação</Text>
            <Text style={[s.actionArrow, { color: colors.muted }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[s.logoutBtn, { borderColor: colors.error }]}
          onPress={handleLogout}
        >
          <Text style={[s.logoutText, { color: colors.error }]}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8,
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.foreground },
  editBtn: { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  editBtnText: { fontSize: 13, fontWeight: '700' },
  avatarSection: { alignItems: 'center', paddingVertical: 20, gap: 8 },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
    elevation: 4,
  },
  avatarInitials: { color: '#fff', fontSize: 28, fontWeight: '800' },
  avatarName: { fontSize: 18, fontWeight: '700' },
  roleBadge: {
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1,
  },
  roleText: { fontSize: 12, fontWeight: '700' },
  card: {
    marginHorizontal: 20, marginBottom: 16, borderRadius: 16,
    padding: 20, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 1 }, shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', marginBottom: 16 },
  row: { flexDirection: 'row', marginBottom: 12 },
  half: { flex: 1 },
  field: { marginBottom: 12 },
  label: { fontSize: 11, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 15 },
  immutable: { fontSize: 10, marginTop: 2 },
  input: {
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8,
    fontSize: 15,
  },
  saveBtn: { borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1,
  },
  actionText: { flex: 1, fontSize: 14, fontWeight: '500' },
  actionArrow: { fontSize: 20 },
  logoutBtn: {
    marginHorizontal: 20, borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1.5, marginBottom: 8,
  },
  logoutText: { fontSize: 15, fontWeight: '700' },
});
