import { useState, useCallback } from 'react';
import { Message, ChatSession } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useChat() {
  const [sessions, setSessions, sessionsLoading] = useLocalStorage<ChatSession[]>('chat-sessions', []);
  const [currentSessionId, setCurrentSessionId] = useLocalStorage<string | null>('current-session', null);
  const [isLoading, setIsLoading] = useState(false);

  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession;
  }, [setSessions, setCurrentSessionId]);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId);
      setCurrentSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
  }, [sessions, currentSessionId, setSessions, setCurrentSessionId]);

  const sendMessage = useCallback(async (content: string, model: string) => {
    if (!currentSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      model,
    };

    const updatedTitle = currentSession.messages.length === 0 
      ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
      : currentSession.title;

    setSessions(prev => prev.map(session => 
      session.id === currentSession.id
        ? {
            ...session,
            title: updatedTitle,
            messages: [...session.messages, userMessage],
            updatedAt: new Date(),
          }
        : session
    ));

    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateMockResponse(content, model),
        role: 'assistant',
        timestamp: new Date(),
        model,
      };

      setSessions(prev => prev.map(session => 
        session.id === currentSession.id
          ? {
              ...session,
              messages: [...session.messages, assistantMessage],
              updatedAt: new Date(),
            }
          : session
      ));

      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  }, [currentSession, setSessions]);

  return {
    sessions,
    currentSession,
    isLoading,
    sessionsLoading,
    createNewSession,
    deleteSession,
    sendMessage,
    setCurrentSessionId,
  };
}

function generateMockResponse(userMessage: string, model: string): string {
  const responses = [
    `作为${model}，我理解您的问题。让我为您详细解答...`,
    `这是一个很好的问题！基于${model}的能力，我可以为您提供以下见解...`,
    `感谢您的提问。使用${model}模型，我分析了您的需求，建议如下...`,
    `根据${model}的训练数据和能力，我认为这个问题可以从以下几个角度来看...`,
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return `${randomResponse}\n\n这是一个模拟响应，展示了${model}模型的回复格式。在实际应用中，这里会连接到真实的AI API来生成响应。\n\n您的问题："${userMessage}"\n\n我会根据这个问题提供相关的帮助和建议。`;
}