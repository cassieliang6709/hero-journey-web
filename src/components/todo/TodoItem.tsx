
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import CircularProgress from './CircularProgress';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  progress?: {
    completed: number;
    total: number;
  };
  onToggle: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  id, 
  text, 
  completed, 
  category, 
  progress, 
  onToggle 
}) => {
  const progressPercentage = progress ? (progress.completed / progress.total) * 100 : 0;
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case '身体': return 'bg-gray-100 text-gray-800 border-gray-300';
      case '情绪': return 'bg-gray-100 text-gray-800 border-gray-300';
      case '技能': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 border ${
        completed 
          ? 'bg-gray-50 border-gray-200 opacity-60' 
          : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
      }`}
      onClick={() => onToggle(id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            completed 
              ? 'bg-gray-900 border-gray-900' 
              : 'border-gray-400'
          }`}>
            {completed && <Check className="w-4 h-4 text-white" />}
          </div>
          
          <div className="flex-1">
            <p className={`text-gray-900 ${completed ? 'line-through' : ''}`}>
              {text}
            </p>
            {progress && (
              <p className="text-xs text-gray-500 mt-1">
                {progress.completed}/{progress.total}
              </p>
            )}
          </div>
          
          <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(category)}`}>
            {category}
          </span>
        </div>
        
        {progress && (
          <div className="ml-3">
            <CircularProgress percentage={progressPercentage} size={36} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default TodoItem;
