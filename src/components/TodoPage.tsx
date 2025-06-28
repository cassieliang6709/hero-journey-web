
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';  
import { ArrowLeft, Globe, Check, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  date: string;
  progress?: {
    completed: number;
    total: number;
  };
}

interface TodoPageProps {
  user: { username: string };
  onGoToStarMap: () => void;
  onBack: () => void;
  onGoToPhysicalTest?: () => void;
  onGoToTalentTest?: () => void;
}

const initialTodos: TodoItem[] = [
  { 
    id: 1, 
    text: '早上运动', 
    completed: false, 
    category: '身体', 
    date: '2024-01-15',
    progress: { completed: 2, total: 5 }
  },
  { 
    id: 2, 
    text: '冥想练习', 
    completed: false, 
    category: '情绪', 
    date: '2024-01-15',
    progress: { completed: 1, total: 3 }
  },
  { 
    id: 3, 
    text: '学习新技能', 
    completed: false, 
    category: '技能', 
    date: '2024-01-15',
    progress: { completed: 4, total: 6 }
  },
  { 
    id: 7, 
    text: '跑步锻炼', 
    completed: true, 
    category: '身体', 
    date: '2024-01-14',
    progress: { completed: 5, total: 5 }
  },
  { 
    id: 8, 
    text: '写日记', 
    completed: true, 
    category: '情绪', 
    date: '2024-01-14',
    progress: { completed: 3, total: 3 }
  },
  { 
    id: 9, 
    text: '练习编程', 
    completed: false, 
    category: '技能', 
    date: '2024-01-16',
    progress: { completed: 2, total: 4 }
  },
];

const TodoPage: React.FC<TodoPageProps> = ({ user, onGoToStarMap, onBack, onGoToPhysicalTest, onGoToTalentTest }) => {
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
      case '身体': return 'bg-gray-100 text-gray-800 border-gray-300';
      case '情绪': return 'bg-gray-100 text-gray-800 border-gray-300';
      case '技能': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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

  const CircularProgress = ({ percentage, size = 40 }: { percentage: number; size?: number }) => {
    const radius = (size - 4) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-gray-900 transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-900">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    );
  };

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
        {/* 日期选择器 */}
        <Card className="bg-white border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900 font-medium">日期选择</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllDates(!showAllDates)}
              className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
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
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-lg font-semibold text-gray-900">
                {formatDate(selectedDate)}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeDate('next')}
                disabled={getDateOptions().indexOf(selectedDate) === getDateOptions().length - 1}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </Card>

        {/* 进度条 */}
        <Card className="bg-white border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-900 font-medium">
              {showAllDates ? '总体进度' : '今日进度'}
            </span>
            <span className="text-gray-900 font-bold">{completedCount}/{filteredTodos.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gray-900 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </Card>

        {/* 任务列表 */}
        <div className="space-y-3">
          {filteredTodos.map((todo) => {
            const progressPercentage = todo.progress ? (todo.progress.completed / todo.progress.total) * 100 : 0;
            
            return (
              <Card 
                key={todo.id}
                className={`p-4 cursor-pointer transition-all duration-200 border ${
                  todo.completed 
                    ? 'bg-gray-50 border-gray-200 opacity-60' 
                    : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
                }`}
                onClick={() => toggleTodo(todo.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      todo.completed 
                        ? 'bg-gray-900 border-gray-900' 
                        : 'border-gray-400'
                    }`}>
                      {todo.completed && <Check className="w-4 h-4 text-white" />}
                    </div>
                    
                    <div className="flex-1">
                      <p className={`text-gray-900 ${todo.completed ? 'line-through' : ''}`}>
                        {todo.text}
                      </p>
                      {todo.progress && (
                        <p className="text-xs text-gray-500 mt-1">
                          {todo.progress.completed}/{todo.progress.total}
                        </p>
                      )}
                      {showAllDates && (
                        <p className="text-xs text-gray-500 mt-1">{formatDate(todo.date)}</p>
                      )}
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(todo.category)}`}>
                      {todo.category}
                    </span>
                  </div>
                  
                  {todo.progress && (
                    <div className="ml-3">
                      <CircularProgress percentage={progressPercentage} size={36} />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* 励志消息 */}
        {completionRate > 50 && (
          <Card className="bg-white border border-gray-200 p-4 text-center animate-fade-in">
            <span className="text-2xl mb-2 block">🎉</span>
            <p className="text-gray-900 font-medium">做得很棒！</p>
            <p className="text-gray-600 text-sm">你已经完成了一半以上的任务</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TodoPage;
