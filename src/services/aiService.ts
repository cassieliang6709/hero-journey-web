import { supabase } from '@/integrations/supabase/client';

export const callAI = async (userMessage: string): Promise<string> => {
  console.log('调用 AI Chat Edge Function');
  
  try {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: { type: 'chat', userMessage }
    });

    if (error) {
      console.error('AI调用错误:', error);
      throw error;
    }

    if (data?.error) {
      console.error('AI服务错误:', data.error);
      throw new Error(data.error);
    }

    return data?.content || '我理解你的想法，让我们继续探讨吧。';
  } catch (error) {
    console.error('AI调用详细错误:', error);
    throw error;
  }
};

export const generateQuestions = async (userMessage: string, aiResponse: string): Promise<string[]> => {
  console.log('生成问题建议');
  
  try {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: { type: 'questions', userMessage, aiResponse }
    });

    if (error) {
      console.error('生成问题失败:', error);
      return [];
    }

    return data?.questions || [];
  } catch (error) {
    console.error('生成问题失败:', error);
    return [];
  }
};
