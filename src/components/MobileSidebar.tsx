import React from 'react';
import { X, Plus, MessageSquare, Trash2, Settings, ExternalLink } from 'lucide-react';
import { ChatSession } from '../types';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onOpenSettings: () => void;
  onOpenWebLinks: () => void;
}

export function MobileSidebar({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onOpenSettings,
  onOpenWebLinks,
}: MobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* 侧边栏 */}
      <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-chat-sidebar border-r border-chat-border z-50 flex flex-col animate-slide-in-left">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-chat-border">
          <h2 className="text-lg font-semibold text-chat-text">聊天记录</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-chat-hover rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 新建对话按钮 */}
        <div className="p-4 border-b border-chat-border">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-chat-input hover:bg-chat-hover rounded-lg transition-colors duration-200"
          >
            <Plus size={18} />
            <span className="text-chat-text font-medium">新建对话</span>
          </button>
        </div>

        {/* 对话列表 */}
        <div className="flex-1 overflow-y-auto p-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors duration-200 mb-2 ${
                currentSessionId === session.id
                  ? 'bg-chat-hover text-white'
                  : 'text-chat-text hover:bg-chat-hover'
              }`}
              onClick={() => onSelectSession(session.id)}
            >
              <MessageSquare size={16} className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-medium">{session.title}</div>
                <div className="text-xs text-chat-text-secondary">
                  {session.updatedAt.toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-600 rounded transition-all duration-200"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* 底部菜单 */}
        <div className="p-4 border-t border-chat-border space-y-2">
          <button
            onClick={onOpenWebLinks}
            className="w-full flex items-center gap-3 px-3 py-3 text-chat-text hover:bg-chat-hover rounded-lg transition-colors duration-200"
          >
            <ExternalLink size={16} />
            <span className="text-sm">相关网站</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-3 text-chat-text hover:bg-chat-hover rounded-lg transition-colors duration-200"
          >
            <Settings size={16} />
            <span className="text-sm">设置</span>
          </button>
        </div>
      </div>
    </>
  );
}