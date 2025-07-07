import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { ChatInterface } from '../components/ChatInterface';
import { MobileSidebar } from '../components/MobileSidebar';
import { SettingsModal } from '../components/SettingsModal';
import { WebLinksModal } from '../components/WebLinksModal';
import { useChat } from '../hooks/useChat';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AppSettings } from '../types';
import { availableModels } from '../data/models';

const defaultSettings: AppSettings = {
  selectedModel: 'gpt-3.5-turbo',
  theme: 'dark',
  fontSize: 'medium',
  autoSave: true,
  showTimestamps: false,
};

export default function App() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', defaultSettings);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWebLinks, setShowWebLinks] = useState(false);
  
  const {
    sessions,
    currentSession,
    isLoading,
    sessionsLoading,
    createNewSession,
    deleteSession,
    sendMessage,
    setCurrentSessionId,
  } = useChat();

  useEffect(() => {
    if (!sessionsLoading && sessions.length === 0) {
      createNewSession();
    }
  }, [sessions.length, createNewSession, sessionsLoading]);

  const handleNewChat = () => {
    createNewSession();
    setShowSidebar(false);
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setShowSidebar(false);
  };

  const handleSendMessage = (content: string) => {
    const selectedModel = availableModels.find(m => m.id === settings.selectedModel);
    sendMessage(content, selectedModel?.name || 'GPT-3.5 Turbo');
  };

  const handleOpenWebLink = (url: string) => {
    // In a real app, you would use Linking.openURL(url)
    console.log('Opening URL:', url);
  };

  return (
    <View style={styles.container}>
      <ChatInterface
        session={currentSession}
        isLoading={isLoading}
        settings={settings}
        onSendMessage={handleSendMessage}
        onToggleSidebar={() => setShowSidebar(true)}
        onOpenWebLink={handleOpenWebLink}
      />

      <Modal
        visible={showSidebar}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSidebar(false)}
      >
        <MobileSidebar
          sessions={sessions}
          currentSessionId={currentSession?.id || null}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onDeleteSession={deleteSession}
          onOpenSettings={() => {
            setShowSettings(true);
            setShowSidebar(false);
          }}
          onOpenWebLinks={() => {
            setShowWebLinks(true);
            setShowSidebar(false);
          }}
          onClose={() => setShowSidebar(false)}
        />
      </Modal>

      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSettings(false)}
      >
        <SettingsModal
          settings={settings}
          onUpdateSettings={setSettings}
          availableModels={availableModels}
          onClose={() => setShowSettings(false)}
        />
      </Modal>

      <Modal
        visible={showWebLinks}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowWebLinks(false)}
      >
        <WebLinksModal
          onOpenLink={handleOpenWebLink}
          onClose={() => setShowWebLinks(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541',
  },
});