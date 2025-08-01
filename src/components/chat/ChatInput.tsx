
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ListTodo, Plus, Check, Loader2 } from 'lucide-react';
import { useTodos } from '@/hooks/useTodos';
import { toast } from 'sonner';

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
  const { todos, loading, toggleTodo, addTodo } = useTodos();
  const [newTodoText, setNewTodoText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // 只显示前3个未完成的任务
  const recentTodos = todos.filter(todo => !todo.completed).slice(0, 3);

  const handleAddTodo = async () => {
    if (!newTodoText.trim() || isAdding) return;
    
    setIsAdding(true);
    toast.info('🧠 AI正在智能分类任务...');
    
    const result = await addTodo(newTodoText, '新增');
    if (result) {
      setNewTodoText('');
      if (result.starMapNodeId) {
        toast.success(`✨ 任务已分类到: ${result.category}`);
      }
    }
    setIsAdding(false);
  };

  const handleToggle = async (id: string) => {
    await toggleTodo(id);
  };

  return (
    <>
      {/* 待办事项列表 */}
      <div className="px-4 pb-2 space-y-2">
        {/* 标题和查看全部按钮 */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            <ListTodo className="w-4 h-4 mr-1" />
            待办事项
          </h3>
          <Button
            onClick={onGoToTodoList}
            variant="ghost"
            size="sm"
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            查看全部
          </Button>
        </div>

        {/* 任务列表 */}
        {loading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            <span className="ml-2 text-xs text-gray-500">加载中...</span>
          </div>
        ) : (
          <>
            {recentTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center space-x-2 p-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200"
              >
                <button
                  onClick={() => handleToggle(todo.id)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    todo.completed 
                      ? 'bg-gray-900 border-gray-900' 
                      : 'border-gray-400 hover:border-gray-600'
                  }`}
                >
                  {todo.completed && <Check className="w-3 h-3 text-white" />}
                </button>
                <span className={`text-xs flex-1 ${
                  todo.completed ? 'line-through text-gray-500' : 'text-gray-700'
                }`}>
                  {todo.text}
                </span>
                <span className="text-xs text-gray-500 px-1 py-0.5 bg-gray-100 rounded">
                  {todo.category}
                </span>
              </div>
            ))}

            {/* 添加新任务 */}
            <div className="flex space-x-2">
              <Input
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="添加新任务..."
                className="flex-1 text-xs h-8 bg-white/80 backdrop-blur-sm border-gray-200"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                disabled={isAdding}
              />
              <Button
                onClick={handleAddTodo}
                size="sm"
                className="h-8 w-8 p-0 bg-gray-900 hover:bg-gray-800 text-white"
                disabled={isAdding || !newTodoText.trim()}
              >
                {isAdding ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
              </Button>
            </div>

            {recentTodos.length === 0 && (
              <div className="text-center py-2 text-xs text-gray-500">
                还没有待办事项，添加一个开始吧！
              </div>
            )}
          </>
        )}
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
