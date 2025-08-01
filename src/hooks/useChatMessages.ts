
import { useState, useEffect } from 'react';
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

  const loadMessages = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('加载聊天记录失败:', error);
        toast.error('加载聊天记录失败');
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
      console.error('加载聊天记录错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 自动加载历史记录
  useEffect(() => {
    if (userId && !hasLoadedInitialMessages) {
      loadMessages();
    }
  }, [userId, hasLoadedInitialMessages]);

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
        console.error('保存消息失败:', error);
        toast.error('保存消息失败');
      }
    } catch (error) {
      console.error('保存消息错误:', error);
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
        console.error('清空聊天记录失败:', error);
        toast.error('清空聊天记录失败');
        return;
      }

      setMessages([]);
      setHasLoadedInitialMessages(false);
      toast.success('聊天记录已清空');
    } catch (error) {
      console.error('清空聊天记录错误:', error);
      toast.error('清空聊天记录失败');
    }
  };

  const addWelcomeMessage = async () => {
    // 只在没有消息且已加载初始消息后添加欢迎消息
    if (messages.length === 0 && hasLoadedInitialMessages) {
      await addMessage(`你好呀！我会陪着你一起通过微小的行动解码这个世界`, false);
    }
  };

  return {
    messages,
    loading,
    addMessage,
    clearMessages,
    addWelcomeMessage,
    refreshMessages: loadMessages
  };
};
