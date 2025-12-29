import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SkillNode } from './useStarMap';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  completedNode?: SkillNode;
}

// Query keys
export const chatKeys = {
  all: ['chat'] as const,
  messages: (userId: string) => [...chatKeys.all, 'messages', userId] as const,
};

// Fetch messages
const fetchMessages = async (userId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data || []).map(msg => ({
    id: msg.id,
    text: msg.message_text,
    isUser: msg.is_user_message,
    timestamp: new Date(msg.created_at || Date.now())
  }));
};

export const useChatMessages = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  // Query for messages
  const { 
    data: messages = [], 
    isLoading: loading,
    isFetched: hasLoadedInitialMessages,
    refetch 
  } = useQuery({
    queryKey: chatKeys.messages(userId || ''),
    queryFn: () => fetchMessages(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation for saving message
  const saveMutation = useMutation({
    mutationFn: async ({ text, isUser }: { text: string; isUser: boolean }) => {
      if (!userId) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          user_id: userId,
          message_text: text,
          is_user_message: isUser
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Mutation for clearing messages
  const clearMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('No user ID');

      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData<Message[]>(chatKeys.messages(userId || ''), []);
    },
  });

  const addMessage = useCallback(async (text: string, isUser: boolean, completedNode?: SkillNode) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      completedNode
    };

    // Optimistically update cache
    queryClient.setQueryData<Message[]>(chatKeys.messages(userId || ''), (old) => 
      [...(old || []), newMessage]
    );

    // Save to database
    try {
      await saveMutation.mutateAsync({ text, isUser });
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  }, [userId, queryClient, saveMutation]);

  const clearMessages = useCallback(async () => {
    if (!userId) return false;

    try {
      await clearMutation.mutateAsync();
      return true;
    } catch (error) {
      console.error('Clear chat messages error:', error);
      return false;
    }
  }, [userId, clearMutation]);

  const addWelcomeMessage = useCallback(async (welcomeText?: string) => {
    // Only add welcome message if no messages and initial load complete
    if (messages.length === 0 && hasLoadedInitialMessages && welcomeText) {
      await addMessage(welcomeText, false);
    }
  }, [messages.length, hasLoadedInitialMessages, addMessage]);

  return {
    messages,
    loading,
    addMessage,
    clearMessages,
    addWelcomeMessage,
    refreshMessages: refetch
  };
};
