import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { webLinks } from '../data/webLinks';

interface WebLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLink: (url: string) => void;
}

export function WebLinksModal({ isOpen, onClose, onOpenLink }: WebLinksModalProps) {
  if (!isOpen) return null;

  // 按类别分组链接
  const groupedLinks = webLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, typeof webLinks>);

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* 模态框 */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-chat-sidebar border border-chat-border rounded-2xl z-50 max-h-[80vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-chat-border">
          <h2 className="text-xl font-semibold text-chat-text">相关网站</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-chat-hover rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6">
          {Object.entries(groupedLinks).map(([category, links]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-lg font-medium text-chat-text mb-3">{category}</h3>
              <div className="space-y-2">
                {links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => onOpenLink(link.url)}
                    className="w-full p-4 bg-chat-input hover:bg-chat-hover rounded-lg transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{link.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-chat-text">{link.title}</span>
                          <ExternalLink size={14} className="text-chat-text-secondary group-hover:text-chat-text transition-colors" />
                        </div>
                        <p className="text-sm text-chat-text-secondary">{link.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}