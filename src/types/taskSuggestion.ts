export interface TaskSuggestion {
  id: string;
  title: string;
  description: string;
  difficulty: number; // 1-5
  estimatedTime: string;
  category?: string;
  messageId: string; // 关联的AI消息ID
}

export interface ParsedMessage {
  text: string;
  taskSuggestions: TaskSuggestion[];
}