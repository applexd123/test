import React, { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { MobileSidebar } from './components/MobileSidebar';
import { SettingsModal } from './components/SettingsModal';
import { WebLinksModal } from './components/WebLinksModal';
import { useChat } from './hooks/useChat';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AppSettings } from './types';
import { availableModels } from './data/models';

const defaultSettings: AppSettings = {
  selectedModel: 'gpt-3.5-turbo',
  theme: 'dark',
  fontSize: 'medium',
  autoSave: true,
  showTimestamps: false,
};

function App() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', defaultSettings);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWebLinks, setShowWebLinks] = useState(false);
  
  const {
    sessions,
    currentSession,
    isLoading,
    createNewSession,
    deleteSession,
    sendMessage,
    setCurrentSessionId,
  } = useChat();

  // 创建初始会话
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    }
  }, [sessions.length, createNewSession]);

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
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`min-h-screen bg-chat-bg text-chat-text ${settings.fontSize === 'small' ? 'text-sm' : settings.fontSize === 'large' ? 'text-lg' : 'text-base'}`}>
      <div className="flex h-screen overflow-hidden">
        {/* 移动端侧边栏 */}
        <MobileSidebar
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
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
        />

        {/* 主聊天界面 */}
        <div className="flex-1 flex flex-col">
          <ChatInterface
            session={currentSession}
            isLoading={isLoading}
            settings={settings}
            onSendMessage={handleSendMessage}
            onToggleSidebar={() => setShowSidebar(true)}
            onOpenWebLink={handleOpenWebLink}
          />
        </div>
      </div>

      {/* 设置模态框 */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        availableModels={availableModels}
      />

      {/* 网页链接模态框 */}
      <WebLinksModal
        isOpen={showWebLinks}
        onClose={() => setShowWebLinks(false)}
        onOpenLink={handleOpenWebLink}
      />
    </div>
  );
}

export default App;