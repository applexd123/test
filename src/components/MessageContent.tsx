import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink } from 'lucide-react';

interface MessageContentProps {
  content: string;
  onOpenWebLink: (url: string) => void;
}

export function MessageContent({ content, onOpenWebLink }: MessageContentProps) {
  // 检测URL的正则表达式
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // 自定义链接渲染器
  const LinkRenderer = ({ href, children }: { href?: string; children: React.ReactNode }) => {
    if (!href) return <span>{children}</span>;
    
    return (
      <button
        onClick={() => onOpenWebLink(href)}
        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline transition-colors"
      >
        {children}
        <ExternalLink size={12} />
      </button>
    );
  };

  // 处理纯文本中的链接
  const processTextWithLinks = (text: string) => {
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <button
            key={index}
            onClick={() => onOpenWebLink(part)}
            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline transition-colors"
          >
            {part}
            <ExternalLink size={12} />
          </button>
        );
      }
      return part;
    });
  };

  // 检查内容是否包含Markdown语法
  const hasMarkdown = /[*_`#\[\]]/g.test(content);

  if (hasMarkdown) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: LinkRenderer,
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
          code: ({ inline, children }) => 
            inline ? (
              <code className="bg-gray-700 px-1 py-0.5 rounded text-sm">{children}</code>
            ) : (
              <pre className="bg-gray-700 p-3 rounded-lg overflow-x-auto mb-2">
                <code>{children}</code>
              </pre>
            ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-500 pl-4 italic mb-2">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }

  // 纯文本处理
  return (
    <div className="whitespace-pre-wrap">
      {processTextWithLinks(content)}
    </div>
  );
}