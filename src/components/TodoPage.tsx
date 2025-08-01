
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Globe, Loader2, Plus, Brain } from 'lucide-react';
import TodoStats from './todo/TodoStats';
import TodoList from './todo/TodoList';
import SuccessMessage from './todo/SuccessMessage';
import { useTodos } from '@/hooks/useTodos';

interface TodoPageProps {
  user: { username: string };
  onGoToStarMap: () => void;
  onBack: () => void;
  onGoToPhysicalTest?: () => void;
  onGoToTalentTest?: () => void;
}

const TodoPage: React.FC<TodoPageProps> = ({ user, onGoToStarMap, onBack }) => {
  const { todos, loading, toggleTodo, addTodo } = useTodos();
  const [newTodoText, setNewTodoText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const completedCount = todos.filter(todo => todo.completed).length;
  const completionRate = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  const handleAddTodo = async () => {
    if (!newTodoText.trim() || isAdding) return;
    
    setIsAdding(true);
    const result = await addTodo(newTodoText, '新增');
    if (result) {
      setNewTodoText('');
    }
    setIsAdding(false);
  };

  if (loading) {
    return (
      <div className="mobile-container bg-white min-h-screen">
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-900 p-0 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-gray-900 font-semibold">待办事项</h1>
              <p className="text-gray-600 text-sm">加载中...</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoToStarMap}
            className="text-gray-900 hover:bg-gray-100"
          >
            <Globe className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">加载待办事项...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container bg-white min-h-screen">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-900 p-0 hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-gray-900 font-semibold">待办事项</h1>
            <p className="text-gray-600 text-sm">完成率: {completionRate}%</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onGoToStarMap}
          className="text-gray-900 hover:bg-gray-100"
        >
          <Globe className="w-5 h-5" />
        </Button>
      </div>

      {/* 主要内容区域 */}
      <div className="p-4 space-y-4">
        {/* 进度统计 */}
        <TodoStats 
          completedCount={completedCount}
          totalCount={todos.length}
          completionRate={completionRate}
        />

        {/* 添加新待办事项 */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-purple-500" />
            <h3 className="text-gray-900 font-medium">创建新任务</h3>
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="输入新任务..."
              className="flex-1"
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
          
          <div className="text-xs text-gray-500 flex items-center">
            <Brain className="w-3 h-3 mr-1" />
            AI会自动将任务分类到对应星图节点
          </div>
        </div>

        {/* 任务列表 */}
        <TodoList 
          todos={todos.map(todo => ({
            id: todo.id,
            text: todo.text,
            completed: todo.completed,
            category: todo.category,
            progress: todo.progress
          }))}
          onToggleTodo={toggleTodo}
        />

        {/* 成功消息 */}
        <SuccessMessage completionRate={completionRate} />
      </div>
    </div>
  );
};

export default TodoPage;
