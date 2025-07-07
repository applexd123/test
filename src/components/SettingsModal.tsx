import React from 'react';
import { X, Check } from 'lucide-react';
import { AppSettings, ModelConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  availableModels: ModelConfig[];
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  availableModels,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const handleModelChange = (modelId: string) => {
    onUpdateSettings({ ...settings, selectedModel: modelId });
  };

  const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large') => {
    onUpdateSettings({ ...settings, fontSize });
  };

  const handleToggleTimestamps = () => {
    onUpdateSettings({ ...settings, showTimestamps: !settings.showTimestamps });
  };

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
          <h2 className="text-xl font-semibold text-chat-text">设置</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-chat-hover rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6">
          {/* 模型选择 */}
          <div>
            <h3 className="text-lg font-medium text-chat-text mb-4">AI模型</h3>
            <div className="space-y-3">
              {availableModels.map((model) => (
                <div
                  key={model.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    settings.selectedModel === model.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-chat-border hover:border-chat-text-secondary'
                  }`}
                  onClick={() => handleModelChange(model.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-chat-text">{model.name}</div>
                      <div className="text-sm text-chat-text-secondary">{model.description}</div>
                      <div className="text-xs text-chat-text-secondary mt-1">
                        {model.provider} • 最大令牌: {model.maxTokens}
                      </div>
                    </div>
                    {settings.selectedModel === model.id && (
                      <Check size={20} className="text-blue-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 字体大小 */}
          <div>
            <h3 className="text-lg font-medium text-chat-text mb-4">字体大小</h3>
            <div className="flex gap-3">
              {[
                { value: 'small', label: '小' },
                { value: 'medium', label: '中' },
                { value: 'large', label: '大' },
              ].map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleFontSizeChange(size.value as any)}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                    settings.fontSize === size.value
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-chat-border text-chat-text hover:border-chat-text-secondary'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* 其他设置 */}
          <div>
            <h3 className="text-lg font-medium text-chat-text mb-4">其他设置</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-chat-text">显示时间戳</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.showTimestamps}
                    onChange={handleToggleTimestamps}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showTimestamps ? 'bg-blue-500' : 'bg-gray-600'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      settings.showTimestamps ? 'translate-x-6' : 'translate-x-0.5'
                    } mt-0.5`} />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}