import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatSession, AppSettings } from '../types';
import { MessageContent } from './MessageContent';

interface ChatInterfaceProps {
  session: ChatSession | null;
  isLoading: boolean;
  settings: AppSettings;
  onSendMessage: (content: string) => void;
  onToggleSidebar: () => void;
  onOpenWebLink: (url: string) => void;
}

export function ChatInterface({
  session,
  isLoading,
  settings,
  onSendMessage,
  onToggleSidebar,
  onOpenWebLink,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [session?.messages]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const getFontSize = () => {
    switch (settings.fontSize) {
      case 'small': return 14;
      case 'large': return 18;
      default: return 16;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onToggleSidebar} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#d1d5db" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {session?.title || '新对话'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        style={styles.flex} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {session?.messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-outline" size={48} color="#8e8ea0" />
              <Text style={styles.emptyTitle}>开始新对话</Text>
              <Text style={styles.emptySubtitle}>选择一个AI模型开始聊天</Text>
            </View>
          ) : (
            session?.messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage,
                ]}
              >
                {message.role === 'assistant' && (
                  <View style={styles.assistantAvatar}>
                    <Ionicons name="chatbubble" size={16} color="white" />
                  </View>
                )}
                
                <View
                  style={[
                    styles.messageBubble,
                    message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                    { fontSize: getFontSize() },
                  ]}
                >
                  <MessageContent 
                    content={message.content} 
                    onOpenWebLink={onOpenWebLink}
                    fontSize={getFontSize()}
                  />
                  {settings.showTimestamps && (
                    <Text style={styles.timestamp}>
                      {message.timestamp.toLocaleTimeString()}
                    </Text>
                  )}
                </View>

                {message.role === 'user' && (
                  <View style={styles.userAvatar}>
                    <Ionicons name="person" size={16} color="white" />
                  </View>
                )}
              </View>
            ))
          )}

          {isLoading && (
            <View style={[styles.messageContainer, styles.assistantMessage]}>
              <View style={styles.assistantAvatar}>
                <Ionicons name="chatbubble" size={16} color="white" />
              </View>
              <View style={styles.loadingBubble}>
                <View style={styles.loadingDots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.textInput, { fontSize: getFontSize() }]}
              value={input}
              onChangeText={setInput}
              placeholder="输入消息..."
              placeholderTextColor="#8e8ea0"
              multiline
              maxLength={1000}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!input.trim() || isLoading}
              style={[
                styles.sendButton,
                (!input.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
            >
              <Ionicons name="send" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#565869',
    backgroundColor: '#202123',
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#d1d5db',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#d1d5db',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8e8ea0',
    textAlign: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10a37f',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#2563eb',
    color: 'white',
  },
  assistantBubble: {
    backgroundColor: '#40414f',
    color: '#d1d5db',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
  },
  loadingBubble: {
    backgroundColor: '#40414f',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8e8ea0',
    marginHorizontal: 2,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#565869',
    backgroundColor: '#202123',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#40414f',
    borderWidth: 1,
    borderColor: '#565869',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#d1d5db',
    maxHeight: 120,
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#6b7280',
  },
});