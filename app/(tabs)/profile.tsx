import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { logout } from '../../src/services/auth.service';
import { updateUserProfile } from '../../src/services/user.service';
import { AnimatedScreen } from '@/components/animations/animated-screen';
import { SectionHeader } from '@/components/ui/section-header';

const { width } = Dimensions.get('window');

const ROLE_LABELS: Record<string, string> = {
  ADMIN_IPT: 'Administrador IPT',
  ADMIN: 'Administrador',
  PREFEITO: 'Prefeito',
  SECRETARIO: 'Secretário',
  AUDITOR: 'Auditor',
  COORDENADOR: 'Coordenador',
  GESTOR: 'Gestor',
  SERVIDOR_PUBLICO: 'Servidor Público',
  TECNICO: 'Técnico',
  TERCEIROS: 'Terceiros',
};

// ─── Profile Header ───────────────────────────────

function ProfileHero({ profile, colors, onEditPress }: any) {
  const initials = `${profile?.firstName?.[0] ?? ''}${profile?.lastName?.[0] ?? ''}`.toUpperCase();
  const roleLabel = ROLE_LABELS[profile?.role] || profile?.role;

  return (
    <LinearGradient
      colors={[colors.primary, colors.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroGradient}
    >
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials || '👤'}</Text>
        </View>
      </View>

      {/* Name & Role */}
      <Text style={styles.heroName}>
        {profile?.firstName} {profile?.lastName}
      </Text>
      <View style={styles.roleBadge}>
        <Text style={styles.roleEmoji}>👔</Text>
        <Text style={styles.roleLabel}>{roleLabel}</Text>
      </View>

      {/* Edit Button */}
      <TouchableOpacity onPress={onEditPress} style={styles.editButton} activeOpacity={0.8}>
        <Text style={styles.editButtonText}>✎ Editar Perfil</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

// ─── Info Row ─────────────────────────────────────

function InfoRow({ icon, label, value, colors }: any) {
  return (
    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.infoLabel, { color: colors.muted }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.foreground }]}>{value || '—'}</Text>
      </View>
    </View>
  );
}

// ─── Field (Edit Mode) ────────────────────────────

function ProfileField({ label, value, colors, editable, onChangeText, keyboardType }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
      <TextInput
        style={[
          styles.fieldInput,
          {
            backgroundColor: colors.background,
            borderColor: focused ? colors.primary : colors.border,
            color: colors.foreground,
            borderWidth: focused ? 2 : 1.5,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────

export default function ProfileScreen() {
  const colors = useColors();
  const { profile, refreshProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(profile?.firstName ?? '');
  const [lastName, setLastName] = useState(profile?.lastName ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [cpf, setCpf] = useState(profile?.cpf ?? '');
  const [saving, setSaving] = useState(false);

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
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login' as any);
        },
      },
    ]);
  };

  return (
    <AnimatedScreen animation="slideInDown" duration={400}>
      <ScreenContainer>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 48 }}
        >
          {/* Hero Card */}
          <ProfileHero
            profile={profile}
            colors={colors}
            onEditPress={() => setEditing(!editing)}
          />

          {editing ? (
            /* ─── Edit Mode ─── */
            <View style={styles.section}>
              <SectionHeader
                title="Dados Pessoais"
                color={colors.muted}
                borderColor={colors.border}
                marginTop={24}
                marginBottom={16}
              />
              <ProfileField label="Primeiro Nome" value={firstName} onChangeText={setFirstName} editable colors={colors} />
              <ProfileField label="Sobrenome" value={lastName} onChangeText={setLastName} editable colors={colors} />
              <ProfileField label="Telefone" value={phone} onChangeText={setPhone} editable colors={colors} keyboardType="phone-pad" />
              <ProfileField label="CPF" value={cpf} onChangeText={setCpf} editable colors={colors} keyboardType="numeric" />

              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                style={{ marginTop: 24 }}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[colors.primary, colors.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.saveButton, { opacity: saving ? 0.6 : 1 }]}
                >
                  {saving
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                  }
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setEditing(false)}
                disabled={saving}
                style={[styles.cancelButton, { borderColor: colors.border }]}
                activeOpacity={0.75}
              >
                <Text style={[styles.cancelButtonText, { color: colors.foreground }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* ─── View Mode ─── */
            <>
              {/* Informações Pessoais */}
              <SectionHeader
                title="Informações Pessoais"
                color={colors.muted}
                borderColor={colors.border}
                marginTop={24}
                marginBottom={4}
              />
              <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <InfoRow icon="📧" label="E-mail" value={profile?.email} colors={colors} />
                <InfoRow icon="📱" label="Telefone" value={profile?.phone} colors={colors} />
                <InfoRow icon="🆔" label="CPF" value={profile?.cpf} colors={colors} />
                <InfoRow icon="🏛️" label="Prefeitura" value={profile?.prefectureId} colors={colors} />
              </View>

              {/* Ações */}
              <SectionHeader
                title="Ações"
                color={colors.muted}
                borderColor={colors.border}
                marginTop={24}
                marginBottom={12}
              />

              {/* Meus Planos de Ação */}
              <TouchableOpacity
                onPress={() => router.push('/action-plans' as any)}
                style={{ marginHorizontal: 20, marginBottom: 12 }}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[colors.accent, colors.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionButtonIcon}>📋</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.actionButtonTitle}>Meus Planos de Ação</Text>
                    <Text style={styles.actionButtonDesc}>Acompanhe seus planos ativos</Text>
                  </View>
                  <Text style={styles.actionArrow}>→</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Segurança */}
              <SectionHeader
                title="Segurança"
                color={colors.muted}
                borderColor={colors.border}
                marginTop={12}
                marginBottom={12}
              />

              <View style={[styles.securityCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TouchableOpacity
                  style={[styles.securityRow, { borderBottomColor: colors.border }]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.securityIcon}>🔐</Text>
                  <Text style={[styles.securityLabel, { color: colors.foreground }]}>Alterar Senha</Text>
                  <Text style={[styles.securityChevron, { color: colors.muted }]}>›</Text>
                </TouchableOpacity>
                <View style={styles.securityRow}>
                  <Text style={styles.securityIcon}>📱</Text>
                  <Text style={[styles.securityLabel, { color: colors.foreground }]}>Autenticação Biométrica</Text>
                  <View style={[styles.activeBadge, { backgroundColor: colors.success + '20', borderColor: colors.success }]}>
                    <Text style={[styles.activeBadgeText, { color: colors.success }]}>Ativo</Text>
                  </View>
                </View>
              </View>

              {/* Logout */}
              <SectionHeader
                title="Conta"
                color={colors.muted}
                borderColor={colors.border}
                marginTop={24}
                marginBottom={12}
              />

              <TouchableOpacity
                onPress={handleLogout}
                style={[styles.logoutButton, { borderColor: colors.error + '60', backgroundColor: colors.error + '08' }]}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 18 }}>🚪</Text>
                <Text style={[styles.logoutButtonText, { color: colors.error }]}>Sair da Conta</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </ScreenContainer>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  // ─── Hero ───
  heroGradient: {
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  avatarWrapper: {
    marginBottom: 14,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
  },
  heroName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 16,
  },
  roleEmoji: { fontSize: 13 },
  roleLabel: { color: 'rgba(255,255,255,0.95)', fontSize: 13, fontWeight: '700' },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  editButtonText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  // ─── Section ───
  section: {
    marginHorizontal: 20,
  },
  // ─── Info Card ───
  infoCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  infoIcon: { fontSize: 18 },
  infoLabel: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  // ─── Fields (Edit Mode) ───
  fieldContainer: { gap: 6, marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.2 },
  fieldInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  // ─── Action Button ───
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 12,
  },
  actionButtonIcon: { fontSize: 22 },
  actionButtonTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 2 },
  actionButtonDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '500' },
  actionArrow: { color: '#fff', fontSize: 18, fontWeight: '700' },
  // ─── Security Card ───
  securityCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  securityIcon: { fontSize: 20 },
  securityLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
  securityChevron: { fontSize: 22, fontWeight: '400' },
  activeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  activeBadgeText: { fontSize: 11, fontWeight: '700' },
  // ─── Buttons ───
  saveButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    marginTop: 10,
  },
  cancelButtonText: { fontSize: 14, fontWeight: '700' },
  logoutButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  logoutButtonText: { fontSize: 15, fontWeight: '700' },
});
