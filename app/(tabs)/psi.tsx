import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { getApiBaseUrl } from '@/constants/oauth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WELCOME_MSG: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Olá! Sou o PSI, seu assistente de saúde mental. Este é um espaço seguro e confidencial. Como posso ajudá-lo hoje?',
  timestamp: new Date(),
};

export default function PsiScreen() {
  const colors = useColors();
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Call the server LLM endpoint
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/psi-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      let reply = 'Entendo como você está se sentindo. Estou aqui para ouvir. Pode me contar mais?';
      if (res.ok) {
        const data = await res.json();
        reply = data.reply ?? reply;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Estou aqui para ouvir você. Às vezes, colocar em palavras o que sentimos já ajuda muito. O que está passando pela sua cabeça?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [input, isTyping, messages]);

  const s = dynamicStyles(colors);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[s.msgRow, isUser && s.msgRowUser]}>
        {!isUser && (
          <View style={[s.avatar, { backgroundColor: colors.secondary }]}>
            <Text style={s.avatarText}>PSI</Text>
          </View>
        )}
        <View style={[
          s.bubble,
          isUser
            ? [s.bubbleUser, { backgroundColor: colors.primary }]
            : [s.bubbleAI, { backgroundColor: colors.surface, borderColor: colors.border }],
        ]}>
          <Text style={[s.bubbleText, { color: isUser ? '#fff' : colors.foreground }]}>
            {item.content}
          </Text>
          <Text style={[s.bubbleTime, { color: isUser ? 'rgba(255,255,255,0.6)' : colors.muted }]}>
            {item.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={[s.header, { borderBottomColor: colors.border }]}>
        <View style={[s.headerAvatar, { backgroundColor: colors.secondary }]}>
          <Text style={s.headerAvatarText}>PSI</Text>
        </View>
        <View>
          <Text style={[s.headerTitle, { color: colors.foreground }]}>Assistente PSI</Text>
          <Text style={[s.headerSubtitle, { color: colors.success }]}>● Online — Confidencial</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={s.msgList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isTyping ? (
            <View style={[s.msgRow]}>
              <View style={[s.avatar, { backgroundColor: colors.secondary }]}>
                <Text style={s.avatarText}>PSI</Text>
              </View>
              <View style={[s.bubble, s.bubbleAI, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={s.typingDots}>
                  {[0, 1, 2].map(i => (
                    <View key={i} style={[s.dot, { backgroundColor: colors.muted }]} />
                  ))}
                </View>
              </View>
            </View>
          ) : null
        }
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={[s.inputRow, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput
            style={[s.input, { color: colors.foreground, backgroundColor: colors.background, borderColor: colors.border }]}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={colors.muted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[s.sendBtn, { backgroundColor: input.trim() ? colors.secondary : colors.border }]}
            onPress={sendMessage}
            disabled={!input.trim() || isTyping}
          >
            <Text style={s.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
  },
  headerAvatar: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  headerTitle: { fontSize: 15, fontWeight: '700' },
  headerSubtitle: { fontSize: 11, marginTop: 1 },
  msgList: { padding: 16, paddingBottom: 8 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12, gap: 8 },
  msgRowUser: { flexDirection: 'row-reverse' },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  avatarText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  bubble: {
    maxWidth: '75%', borderRadius: 16, padding: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 1 }, shadowRadius: 3,
  },
  bubbleUser: { borderBottomRightRadius: 4 },
  bubbleAI: { borderWidth: 1, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  bubbleTime: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  typingDots: { flexDirection: 'row', gap: 4, padding: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    padding: 12, borderTopWidth: 1,
  },
  input: {
    flex: 1, borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 15, maxHeight: 100,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  sendIcon: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
