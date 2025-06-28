
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';  
import { ArrowLeft, Star, Check, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  date: string;
}

interface TodoPageProps {
  user: { username: string };
  onGoToStarMap: () => void;
  onBack: () => void;
}

const initialTodos: TodoItem[] = [
  { id: 1, text: '早上运动30分钟', completed: false, category: '身体', date: '2024-01-15' },
  { id: 2, text: '冥想15分钟', completed: false, category: '情绪', date: '2024-01-15' },
  { id: 3, text: '学习新技能1小时', completed: false, category: '技能', date: '2024-01-15' },
  { id: 4, text: '健康饮食记录', completed: false, category: '身体', date: '2024-01-15' },
  { id: 5, text: '感恩日记', completed: false, category: '情绪', date: '2024-01-15' },
  { id: 6, text: '阅读专业书籍', completed: false, category: '技能', date: '2024-01-15' },
  { id: 7, text: '跑步5公里', completed: true, category: '身体', date: '2024-01-14' },
  { id: 8, text: '写日记', completed: true, category: '情绪', date: '2024-01-14' },
  { id: 9, text: '练习编程', completed: false, category: '技能', date: '2024-01-16' },
];

const TodoPage: React.FC<TodoPageProps> = ({ user, onGoToStarMap, onBack }) => {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [showAllDates, setShowAllDates] = useState(false);

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const getDateOptions = () => {
    const dates = [...new Set(todos.map(todo => todo.date))].sort();
    return dates;
  };

  const getFilteredTodos = () => {
    if (showAllDates) {
      return todos;
    }
    return todos.filter(todo => todo.date === selectedDate);
  };

  const filteredTodos = getFilteredTodos();
  const completedCount = filteredTodos.filter(todo => todo.completed).length;
  const completionRate = filteredTodos.length > 0 ? Math.round((completedCount / filteredTodos.length) * 100) : 0;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '身体': return 'bg-green-500/20 text-green-700 border-green-300';
      case '情绪': return 'bg-blue-500/20 text-blue-700 border-blue-300';
      case '技能': return 'bg-purple-500/20 text-purple-700 border-purple-300';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-300';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const changeDate = (direction: 'prev' | 'next') => {
    const dates = getDateOptions();
    const currentIndex = dates.indexOf(selectedDate);
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedDate(dates[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < dates.length - 1) {
      setSelectedDate(dates[currentIndex + 1]);
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
            className="text-gray-800 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-gray-800 font-semibold">待办事项</h1>
            <p className="text-gray-600 text-sm">完成率: {completionRate}%</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onGoToStarMap}
          className="text-gray-800"
        >
          <Star className="w-5 h-5" />
        </Button>
      </div>

      {/* 日期选择器 */}
      <div className="p-4">
        <Card className="glass-effect p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800 font-medium">日期选择</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllDates(!showAllDates)}
              className="text-xs"
            >
              {showAllDates ? '显示当日' : '显示全部'}
            </Button>
          </div>
          
          {!showAllDates && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeDate('prev')}
                disabled={getDateOptions().indexOf(selectedDate) === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-lg font-semibold text-gray-800">
                {formatDate(selectedDate)}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeDate('next')}
                disabled={getDateOptions().indexOf(selectedDate) === getDateOptions().length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* 进度条 */}
      <div className="p-4">
        <Card className="glass-effect p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-800 font-medium">
              {showAllDates ? '总体进度' : '今日进度'}
            </span>
            <span className="text-hero-500 font-bold">{completedCount}/{filteredTodos.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="hero-gradient h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </Card>
      </div>

      {/* 任务列表 */}
      <div className="p-4 space-y-3">
        {filteredTodos.map((todo) => (
          <Card 
            key={todo.id}
            className={`p-4 cursor-pointer transition-all duration-200 ${
              todo.completed 
                ? 'glass-effect opacity-60' 
                : 'glass-effect hover:shadow-md'
            }`}
            onClick={() => toggleTodo(todo.id)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                todo.completed 
                  ? 'bg-hero-500 border-hero-500' 
                  : 'border-gray-400'
              }`}>
                {todo.completed && <Check className="w-4 h-4 text-white" />}
              </div>
              
              <div className="flex-1">
                <p className={`text-gray-800 ${todo.completed ? 'line-through' : ''}`}>
                  {todo.text}
                </p>
                {showAllDates && (
                  <p className="text-xs text-gray-500 mt-1">{formatDate(todo.date)}</p>
                )}
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(todo.category)}`}>
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
            <p className="text-gray-800 font-medium">做得很棒！</p>
            <p className="text-gray-600 text-sm">你已经完成了一半以上的任务</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TodoPage;
