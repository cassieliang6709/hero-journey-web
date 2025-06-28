
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';  
import { ArrowLeft, Star, Check } from 'lucide-react';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  category: string;
}

interface TodoPageProps {
  user: { username: string };
  onGoToStarMap: () => void;
  onBack: () => void;
}

const initialTodos: TodoItem[] = [
  { id: 1, text: '早上运动30分钟', completed: false, category: '身体' },
  { id: 2, text: '冥想15分钟', completed: false, category: '情绪' },
  { id: 3, text: '学习新技能1小时', completed: false, category: '技能' },
  { id: 4, text: '健康饮食记录', completed: false, category: '身体' },
  { id: 5, text: '感恩日记', completed: false, category: '情绪' },
  { id: 6, text: '阅读专业书籍', completed: false, category: '技能' }
];

const TodoPage: React.FC<TodoPageProps> = ({ user, onGoToStarMap, onBack }) => {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const completionRate = Math.round((completedCount / todos.length) * 100);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '身体': return 'bg-green-500/20 text-green-400';
      case '情绪': return 'bg-blue-500/20 text-blue-400';
      case '技能': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="mobile-container gradient-bg min-h-screen">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between p-4 glass-effect">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-white font-semibold">今日任务</h1>
            <p className="text-gray-400 text-sm">完成率: {completionRate}%</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onGoToStarMap}
          className="text-white"
        >
          <Star className="w-5 h-5" />
        </Button>
      </div>

      {/* 进度条 */}
      <div className="p-4">
        <Card className="glass-effect p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">今日进度</span>
            <span className="text-hero-400 font-bold">{completedCount}/{todos.length}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div 
              className="hero-gradient h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </Card>
      </div>

      {/* 任务列表 */}
      <div className="p-4 space-y-3">
        {todos.map((todo) => (
          <Card 
            key={todo.id}
            className={`p-4 cursor-pointer transition-all duration-200 ${
              todo.completed 
                ? 'glass-effect opacity-60' 
                : 'glass-effect hover:bg-white/15'
            }`}
            onClick={() => toggleTodo(todo.id)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                todo.completed 
                  ? 'bg-hero-500 border-hero-500' 
                  : 'border-white/30'
              }`}>
                {todo.completed && <Check className="w-4 h-4 text-white" />}
              </div>
              
              <div className="flex-1">
                <p className={`text-white ${todo.completed ? 'line-through' : ''}`}>
                  {todo.text}
                </p>
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(todo.category)}`}>
                {todo.category}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* 励志消息 */}
      {completionRate > 50 && (
        <div className="p-4">
          <Card className="glass-effect p-4 text-center animate-fade-in">
            <span className="text-2xl mb-2 block">🎉</span>
            <p className="text-white font-medium">做得很棒！</p>
            <p className="text-gray-300 text-sm">你已经完成了一半以上的任务</p>
          </Card>
        </div>
      )}

      {/* 右上角星图提示 */}
      <div className="absolute top-20 right-4 text-gray-500 text-sm animate-pulse">
        点击 ⭐ 查看星图
      </div>
    </div>
  );
};

export default TodoPage;
