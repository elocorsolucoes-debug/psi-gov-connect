import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, KeyboardAvoidingView, Platform, Dimensions, Animated, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useAuth } from '../../src/context/AuthContext';
import { getApiBaseUrl } from '@/constants/oauth';
import { AnimatedScreen } from '@/components/animations/animated-screen';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const { width } = Dimensions.get('window');

const WELCOME_MSG: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Olá! Sou o PSI, seu assistente de saúde mental. Este é um espaço seguro e confidencial para compartilhar seus sentimentos e preocupações. Como posso ajudá-lo hoje?',
  timestamp: new Date(),
};

// ─── Animated Typing Indicator ─────────────────────

function TypingDots({ colors }: { colors: any }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const bounce = (dot: Animated.Value, delay: number) =>
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dot, { toValue: -5, duration: 300, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
        Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true, easing: Easing.in(Easing.quad) }),
        Animated.delay(600),
      ])
    );

  useEffect(() => {
    const a1 = bounce(dot1, 0);
    const a2 = bounce(dot2, 150);
    const a3 = bounce(dot3, 300);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, []);

  return (
    <View style={styles.typingContainer}>
      <View style={[styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.typingDotRow}>
          {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View
              key={i}
              style={[
                styles.typingDot,
                { backgroundColor: colors.muted, transform: [{ translateY: dot }] },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Message Bubble ────────────────────────────────

function MessageBubble({ message, colors }: any) {
  const isUser = message.role === 'user';
  const time = message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.messageBubbleContainer, { justifyContent: isUser ? 'flex-end' : 'flex-start' }]}>
      {/* AI avatar */}
      {!isUser && (
        <View style={[styles.aiAvatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.aiAvatarText}>🧠</Text>
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          isUser
            ? { backgroundColor: colors.primary, borderBottomRightRadius: 4 }
            : { backgroundColor: colors.surface, borderBottomLeftRadius: 4, borderColor: colors.border, borderWidth: 1 },
        ]}
      >
        <Text style={[styles.messageText, { color: isUser ? '#fff' : colors.foreground }]}>
          {message.content}
        </Text>
        <Text style={[styles.messageTime, { color: isUser ? 'rgba(255,255,255,0.65)' : colors.muted }]}>
          {time}
        </Text>
      </View>
    </View>
  );
}

export default function PsiScreen() {
  const colors = useColors();
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/psi-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      let reply = 'Entendo como você está se sentindo. Estou aqui para ouvir. Pode me contar mais?';
      if (res.ok) {
        const data = await res.json();
        reply = data.reply ?? reply;
      }

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      }]);
    } catch (e) {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Estou aqui para ouvir você. Às vezes, colocar em palavras o que sentimos já ajuda muito. O que está passando pela sua cabeça?',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, messages]);

  const dynamicStyles = useMemo(() => StyleSheet.create({
    header: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    headerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: { fontSize: 17, fontWeight: '800', color: colors.foreground },
    onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
    onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
    subtitle: { fontSize: 11, color: colors.muted, fontWeight: '600' },
  }), [colors]);

  return (
    <AnimatedScreen animation="fadeIn" duration={400}>
      <ScreenContainer>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* Header */}
          <View style={dynamicStyles.header}>
            <View style={dynamicStyles.headerAvatar}>
              <Text style={{ fontSize: 20 }}>🧠</Text>
            </View>
            <View>
              <Text style={dynamicStyles.title}>PSI Chat</Text>
              <View style={dynamicStyles.onlineRow}>
                <View style={dynamicStyles.onlineDot} />
                <Text style={dynamicStyles.subtitle}>Online · Suporte empático</Text>
              </View>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} colors={colors} />}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />

          {/* Typing Indicator */}
          {isTyping && <TypingDots colors={colors} />}

          {/* Input Area */}
          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
              placeholder="Digite sua mensagem..."
              placeholderTextColor={colors.muted}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
              editable={!isTyping}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!input.trim() || isTyping}
              activeOpacity={0.75}
              style={[styles.sendButton, { opacity: !input.trim() || isTyping ? 0.45 : 1 }]}
            >
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendButtonGradient}
              >
                <Text style={styles.sendButtonText}>{isTyping ? '…' : '↑'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messagesList: { paddingHorizontal: 16, paddingVertical: 16, gap: 10 },
  // ─── Bubbles ───
  messageBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginVertical: 3,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarText: { fontSize: 17 },
  messageBubble: {
    maxWidth: width - 100,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    gap: 3,
  },
  messageText: { fontSize: 14, fontWeight: '500', lineHeight: 21 },
  messageTime: { fontSize: 10, fontWeight: '500', alignSelf: 'flex-end' },
  // ─── Typing ───
  typingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: 'flex-end',
    gap: 8,
  },
  aiBubble: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  typingDotRow: { flexDirection: 'row', gap: 5, alignItems: 'center', height: 14 },
  typingDot: { width: 7, height: 7, borderRadius: 4 },
  // ─── Input ───
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    maxHeight: 110,
  },
  sendButton: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  sendButtonGradient: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  sendButtonText: { color: '#fff', fontSize: 20, fontWeight: '800' },
});
