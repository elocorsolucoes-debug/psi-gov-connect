import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Dimensions,
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

function MessageBubble({ message, colors }: any) {
  const isUser = message.role === 'user';
  const time = message.timestamp.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={[
        styles.messageBubbleContainer,
        { justifyContent: isUser ? 'flex-end' : 'flex-start' },
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isUser
            ? {
                backgroundColor: colors.primary,
                borderBottomRightRadius: 4,
              }
            : {
                backgroundColor: colors.surface,
                borderBottomLeftRadius: 4,
                borderColor: colors.border,
                borderWidth: 1,
              },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            {
              color: isUser ? '#fff' : colors.foreground,
            },
          ]}
        >
          {message.content}
        </Text>
        <Text
          style={[
            styles.messageTime,
            {
              color: isUser ? 'rgba(255,255,255,0.7)' : colors.muted,
            },
          ]}
        >
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
  }, [messages]);

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
          history: messages
            .slice(-6)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      let reply =
        'Entendo como você está se sentindo. Estou aqui para ouvir. Pode me contar mais?';
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
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Estou aqui para ouvir você. Às vezes, colocar em palavras o que sentimos já ajuda muito. O que está passando pela sua cabeça?',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, messages]);

  const dynamicStyles = useMemo(() => {
    return StyleSheet.create({
      header: {
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
      subtitle: {
        fontSize: 13,
        color: colors.muted,
        marginTop: 4,
        fontWeight: '500',
      },
    });
  }, [colors]);

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
          <Text style={dynamicStyles.title}>PSI Chat</Text>
          <Text style={dynamicStyles.subtitle}>
            Suporte emocional com IA empática
          </Text>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble message={item} colors={colors} />
          )}
          contentContainerStyle={styles.messagesList}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.1}
          onEndReached={() => flatListRef.current?.scrollToEnd()}
        />

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.typingContainer}>
            <View
              style={[
                styles.typingBubble,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
            </View>
          </View>
        )}

        {/* Input Area */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.surface, borderTopColor: colors.border },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.foreground,
              },
            ]}
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
            activeOpacity={0.7}
            style={[
              styles.sendButton,
              { opacity: !input.trim() || isTyping ? 0.5 : 1 },
            ]}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendButtonGradient}
            >
              <Text style={styles.sendButtonText}>
                {isTyping ? '...' : '→'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  messageBubble: {
    maxWidth: width - 80,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 4,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  typingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
