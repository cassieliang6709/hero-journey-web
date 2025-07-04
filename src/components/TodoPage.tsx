
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Loader2 } from 'lucide-react';
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
  const { todos, loading, toggleTodo } = useTodos();

  const completedCount = todos.filter(todo => todo.completed).length;
  const completionRate = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

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
