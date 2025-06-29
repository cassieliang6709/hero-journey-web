
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ListTodo } from 'lucide-react';

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
          variant="outline"
          className="flex items-center space-x-2 text-gray-700 border-gray-300 hover:bg-gray-50 hover:scale-105 transition-all animate-fade-in"
        >
          <ListTodo className="w-4 h-4" />
          <span>待办事项</span>
        </Button>
      </div>

      {/* 输入框 */}
      <form onSubmit={onSubmit} className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="输入你的想法..."
            className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-200 focus:scale-105"
            disabled={aiTyping}
          />
          <Button 
            type="submit" 
            className="bg-gray-900 hover:bg-gray-800 text-white px-3 hover:scale-105 transition-all"
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
