import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';

interface MessageContentProps {
  content: string;
  onOpenWebLink: (url: string) => void;
  fontSize: number;
}

export function MessageContent({ content, onOpenWebLink, fontSize }: MessageContentProps) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  const hasMarkdown = /[*_`#\[\]]/g.test(content);

  const markdownStyles = StyleSheet.create({
    body: {
      color: '#d1d5db',
      fontSize,
    },
    paragraph: {
      marginBottom: 8,
      color: '#d1d5db',
      fontSize,
    },
    link: {
      color: '#60a5fa',
      textDecorationLine: 'underline',
    },
    code_inline: {
      backgroundColor: '#374151',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: fontSize - 2,
    },
    code_block: {
      backgroundColor: '#374151',
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
    },
    fence: {
      backgroundColor: '#374151',
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: '#6b7280',
      paddingLeft: 16,
      fontStyle: 'italic',
      marginVertical: 8,
    },
  });

  if (hasMarkdown) {
    return (
      <Markdown
        style={markdownStyles}
        onLinkPress={(url) => onOpenWebLink(url)}
      >
        {content}
      </Markdown>
    );
  }

  // Handle plain text with URLs
  const parts = content.split(urlRegex);
  
  return (
    <Text style={[styles.text, { fontSize }]}>
      {parts.map((part, index) => {
        if (urlRegex.test(part)) {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onOpenWebLink(part)}
              style={styles.linkContainer}
            >
              <Text style={[styles.link, { fontSize }]}>{part}</Text>
              <Ionicons name="open-outline" size={12} color="#60a5fa" />
            </TouchableOpacity>
          );
        }
        return <Text key={index} style={{ fontSize }}>{part}</Text>;
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#d1d5db',
    lineHeight: 24,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    color: '#60a5fa',
    textDecorationLine: 'underline',
    marginRight: 4,
  },
});