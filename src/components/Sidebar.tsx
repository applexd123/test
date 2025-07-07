import React from 'react';
import { Plus, MessageSquare, Trash2, Settings, ExternalLink } from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onOpenSettings: () => void;
  onOpenWebLinks: () => void;
}

export function Sidebar({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onOpenSettings,
  onOpenWebLinks,
}: SidebarProps) {
  return (
    <div className="w-64 bg-chat-sidebar border-r border-chat-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-chat-border">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 bg-chat-input hover:bg-chat-hover rounded-lg transition-colors duration-200"
        >
          <Plus size={18} />
          <span className="text-chat-text font-medium">新建对话</span>
        </button>
      </div>

      {/* Chat Sessions */}
      <div className="flex-1 overflow-y-auto p-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 mb-1 ${
              currentSessionId === session.id
                ? 'bg-chat-hover text-white'
                : 'text-chat-text hover:bg-chat-hover'
            }`}
            onClick={() => onSelectSession(session.id)}
          >
            <MessageSquare size={16} className="flex-shrink-0" />
            <span className="flex-1 truncate text-sm">{session.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-all duration-200"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-chat-border space-y-2">
        <button
          onClick={onOpenWebLinks}
          className="w-full flex items-center gap-3 px-3 py-2 text-chat-text hover:bg-chat-hover rounded-lg transition-colors duration-200"
        >
          <ExternalLink size={16} />
          <span className="text-sm">相关网站</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2 text-chat-text hover:bg-chat-hover rounded-lg transition-colors duration-200"
        >
          <Settings size={16} />
          <span className="text-sm">设置</span>
        </button>
      </div>
    </div>
  );
}