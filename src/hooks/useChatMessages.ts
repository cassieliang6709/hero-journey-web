import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SkillNode } from './useStarMap';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  completedNode?: SkillNode;
}

export const useChatMessages = (userId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoadedInitialMessages, setHasLoadedInitialMessages] = useState(false);

  const loadMessages = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Failed to load chat messages:', error);
        return;
      }

      const formattedMessages = (data || []).map(msg => ({
        id: msg.id,
        text: msg.message_text,
        isUser: msg.is_user_message,
        timestamp: new Date(msg.created_at || Date.now())
      }));

      setMessages(formattedMessages);
      setHasLoadedInitialMessages(true);
    } catch (error) {
      console.error('Chat messages load error:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 自动加载历史记录
  useEffect(() => {
    if (userId && !hasLoadedInitialMessages) {
      loadMessages();
    }
  }, [userId, hasLoadedInitialMessages, loadMessages]);

  const saveMessage = async (text: string, isUser: boolean) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            user_id: userId,
            message_text: text,
            is_user_message: isUser
          }
        ]);

      if (error) {
        console.error('Failed to save message:', error);
      }
    } catch (error) {
      console.error('Save message error:', error);
    }
  };

  const addMessage = async (text: string, isUser: boolean, completedNode?: SkillNode) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      completedNode
    };

    setMessages(prev => [...prev, newMessage]);
    await saveMessage(text, isUser);
  };

  const clearMessages = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Failed to clear chat messages:', error);
        return false;
      }

      setMessages([]);
      setHasLoadedInitialMessages(false);
      return true;
    } catch (error) {
      console.error('Clear chat messages error:', error);
      return false;
    }
  };

  const addWelcomeMessage = useCallback(async (welcomeText?: string) => {
    // 只在没有消息且已加载初始消息后添加欢迎消息
    if (messages.length === 0 && hasLoadedInitialMessages && welcomeText) {
      await addMessage(welcomeText, false);
    }
  }, [messages.length, hasLoadedInitialMessages]);

  return {
    messages,
    loading,
    addMessage,
    clearMessages,
    addWelcomeMessage,
    refreshMessages: loadMessages
  };
};
