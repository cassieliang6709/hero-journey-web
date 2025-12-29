import { invokeEdgeFunction } from '@/lib/apiUtils';

interface AIResponse {
  content?: string;
  error?: string;
}

interface QuestionsResponse {
  questions?: string[];
  error?: string;
}

export const callAI = async (userMessage: string): Promise<string> => {
  const { data, error } = await invokeEdgeFunction<AIResponse>('ai-chat', {
    type: 'chat',
    userMessage
  });

  if (error || !data) {
    throw error || new Error('AI service unavailable');
  }

  return data.content || '我理解你的想法，让我们继续探讨吧。';
};

export const generateQuestions = async (
  userMessage: string,
  aiResponse: string
): Promise<string[]> => {
  const { data } = await invokeEdgeFunction<QuestionsResponse>('ai-chat', {
    type: 'questions',
    userMessage,
    aiResponse
  });

  return data?.questions || [];
};
