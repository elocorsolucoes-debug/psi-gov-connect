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

function ProfileHeader({ profile, colors, onEditPress }: any) {
  const initials = `${profile?.firstName?.[0] ?? ''}${profile?.lastName?.[0] ?? ''}`.toUpperCase();
  const roleLabel = ROLE_LABELS[profile?.role] || profile?.role;

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>
            {profile?.firstName} {profile?.lastName}
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleEmoji}>👔</Text>
            <Text style={styles.roleLabel}>{roleLabel}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
          <Text style={styles.editButtonText}>✎</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

function ProfileField({ label, value, colors, editable, onChangeText }: any) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
      <TextInput
        style={[
          styles.fieldInput,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            color: colors.foreground,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}

function InfoCard({ icon, label, value, colors }: any) {
  return (
    <View
      style={[
        styles.infoCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.infoLabel, { color: colors.muted }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.foreground }]}>
          {value || '—'}
        </Text>
      </View>
    </View>
  );
}

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
      await updateUserProfile(profile.uid, {
        firstName,
        lastName,
        phone,
        cpf,
      });
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

  const dynamicStyles = useMemo(() => {
    return StyleSheet.create({
      headerTop: {
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
    });
  }, [colors]);

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View style={dynamicStyles.headerTop}>
          <Text style={dynamicStyles.title}>Perfil</Text>
        </View>

        {/* Profile Header Card */}
        <View style={styles.profileHeaderWrapper}>
          <ProfileHeader
            profile={profile}
            colors={colors}
            onEditPress={() => setEditing(!editing)}
          />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {editing ? (
            <>
              {/* Edit Mode */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  Dados Pessoais
                </Text>
                <ProfileField
                  label="Primeiro Nome"
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={true}
                  colors={colors}
                />
                <ProfileField
                  label="Sobrenome"
                  value={lastName}
                  onChangeText={setLastName}
                  editable={true}
                  colors={colors}
                />
                <ProfileField
                  label="Telefone"
                  value={phone}
                  onChangeText={setPhone}
                  editable={true}
                  colors={colors}
                />
                <ProfileField
                  label="CPF"
                  value={cpf}
                  onChangeText={setCpf}
                  editable={true}
                  colors={colors}
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                style={{ marginHorizontal: 20, marginBottom: 12 }}
              >
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.saveButton,
                    { opacity: saving ? 0.6 : 1 },
                  ]}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                onPress={() => setEditing(false)}
                disabled={saving}
                style={[
                  styles.cancelButton,
                  {
                    borderColor: colors.border,
                    marginHorizontal: 20,
                    marginBottom: 20,
                  },
                ]}
              >
                <Text style={[styles.cancelButtonText, { color: colors.foreground }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* View Mode */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  Informações
                </Text>
                <InfoCard
                  icon="📧"
                  label="E-mail"
                  value={profile?.email}
                  colors={colors}
                />
                <InfoCard
                  icon="📱"
                  label="Telefone"
                  value={profile?.phone}
                  colors={colors}
                />
                <InfoCard
                  icon="🆔"
                  label="CPF"
                  value={profile?.cpf}
                  colors={colors}
                />
                <InfoCard
                  icon="🏛️"
                  label="Prefeitura"
                  value={profile?.prefectureId}
                  colors={colors}
                />
              </View>

              {/* Action Plans Link */}
              <TouchableOpacity
                onPress={() => router.push('/action-plans' as any)}
                style={{ marginHorizontal: 20, marginBottom: 12 }}
              >
                <LinearGradient
                  colors={[colors.accent, colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionButtonIcon}>📋</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.actionButtonTitle}>
                      Meus Planos de Ação
                    </Text>
                    <Text style={styles.actionButtonDesc}>
                      Acompanhe seus planos
                    </Text>
                  </View>
                  <Text style={styles.actionArrow}>→</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Logout Button */}
              <TouchableOpacity
                onPress={handleLogout}
                style={[
                  styles.logoutButton,
                  { borderColor: colors.error },
                  { marginHorizontal: 20 },
                ]}
              >
                <Text style={[styles.logoutButtonText, { color: colors.error }]}>
                  🚪 Sair da Conta
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileHeaderWrapper: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerGradient: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    marginRight: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roleEmoji: {
    fontSize: 14,
  },
  roleLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  fieldContainer: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  fieldInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
  },
  actionButtonIcon: {
    fontSize: 20,
  },
  actionButtonTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  actionButtonDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
  actionArrow: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
