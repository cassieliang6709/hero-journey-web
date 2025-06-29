
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListTodo, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useTodos } from '@/hooks/useTodos';

interface TodoCardProps {
  onClose: () => void;
  onGoToTodoList: () => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ onClose, onGoToTodoList }) => {
  const { todos, toggleTodo, addTodo } = useTodos();
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;
    
    addTodo(newTodoText, '新增');
    setNewTodoText('');
    toast.success('待办事项已添加', { duration: 2000 });
  };

  return (
    <div className="flex justify-center animate-fade-in">
      <Card className="w-full max-w-sm bg-white border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900 font-medium flex items-center">
            <ListTodo className="w-4 h-4 mr-2" />
            待办事项
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        {/* 待办事项列表 */}
        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  todo.completed 
                    ? 'bg-gray-900 border-gray-900' 
                    : 'border-gray-400'
                }`}
              >
                {todo.completed && <Check className="w-3 h-3 text-white" />}
              </button>
              <span className={`text-sm flex-1 ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {todo.text}
              </span>
              <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded">
                {todo.category}
              </span>
            </div>
          ))}
        </div>
        
        {/* 添加新待办事项 */}
        <div className="flex space-x-2">
          <Input
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="添加新任务..."
            className="flex-1 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <Button
            onClick={handleAddTodo}
            size="sm"
            className="bg-gray-900 hover:bg-gray-800 text-white px-3"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* 查看完整待办页面按钮 */}
        <Button
          onClick={onGoToTodoList}
          variant="outline"
          className="w-full mt-3 text-sm text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          查看完整待办列表
        </Button>
      </Card>
    </div>
  );
};

export default TodoCard;
