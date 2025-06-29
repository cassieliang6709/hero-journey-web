
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ListTodo, Sparkles } from 'lucide-react';

interface ChatInputProps {
  inputText: string;
  aiTyping: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoToTodoList: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  aiTyping,
  onInputChange,
  onSubmit,
  onGoToTodoList
}) => {
  return (
    <>
      {/* Todo List 按钮 */}
      <div className="px-4 pb-2">
        <Button
          onClick={onGoToTodoList}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <ListTodo className="w-4 h-4" />
          <span>待办事项</span>
          <Sparkles className="w-3 h-3 animate-pulse" />
        </Button>
      </div>

      {/* 输入框 */}
      <form onSubmit={onSubmit} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-200">
        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="输入你的想法..."
            className="flex-1 bg-white/80 backdrop-blur-sm border-purple-200 text-gray-900 placeholder:text-purple-400 focus:border-purple-400 focus:ring-purple-400 transition-all duration-200 hover:bg-white/90"
            disabled={aiTyping}
          />
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-0"
            disabled={aiTyping || !inputText.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </>
  );
};

export default ChatInput;
