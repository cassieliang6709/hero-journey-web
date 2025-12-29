
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListTodo, Plus, Check, Loader2, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { useTodos } from '@/hooks/useTodos';

interface TodoCardProps {
  onClose: () => void;
  onGoToTodoList: () => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ onClose, onGoToTodoList }) => {
  const { todos, loading, toggleTodo, addTodo } = useTodos();
  const [newTodoText, setNewTodoText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTodo = async () => {
    if (!newTodoText.trim() || isAdding) return;
    
    setIsAdding(true);
    
    // 显示AI分类提示
    toast.info('🧠 AI正在智能分类任务...');
    
    console.log('准备添加任务:', newTodoText);
    const result = await addTodo(newTodoText, '新增');
    if (result) {
      console.log('任务添加成功:', result);
      setNewTodoText('');
      // 显示分类结果
      if (result.starMapNodeId) {
        toast.success(`✨ 任务已分类到: ${result.category}`);
      }
    } else {
      console.log('任务添加失败');
    }
    setIsAdding(false);
  };

  const handleToggle = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    console.log('切换任务状态:', { id, todo });
    await toggleTodo(id);
  };

  if (loading) {
    return (
      <div className="flex justify-center animate-fade-in">
        <Card className="w-full max-w-sm bg-white border border-gray-200 p-4">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">加载中...</span>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex justify-center animate-fade-in">
      <Card className="w-full max-w-sm bg-white border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900 font-medium flex items-center">
            <ListTodo className="w-4 h-4 mr-2" />
            待办事项
            <Brain className="w-4 h-4 ml-1 text-purple-500" />
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
                onClick={() => handleToggle(todo.id)}
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
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded">
                  {todo.category}
                </span>
                {todo.starMapNodeId && (
                  <span className="text-xs text-purple-500 mt-1">
                    🎯 {todo.starMapNodeId}
                  </span>
                )}
              </div>
            </div>
          ))}
          {todos.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              还没有待办事项
            </div>
          )}
        </div>
        
        {/* 添加新待办事项 */}
        <div className="flex space-x-2">
          <Input
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="添加新任务..."
            className="flex-1 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            disabled={isAdding}
          />
          <Button
            onClick={handleAddTodo}
            size="sm"
            className="bg-gray-900 hover:bg-gray-800 text-white px-3"
            disabled={isAdding || !newTodoText.trim()}
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* AI分类提示 */}
        <div className="text-xs text-gray-500 mt-2 flex items-center justify-center">
          <Brain className="w-3 h-3 mr-1" />
          AI会自动将任务分类到对应星图节点
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
