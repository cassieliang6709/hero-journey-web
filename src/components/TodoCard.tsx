
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  date: string;
}

interface TodoCardProps {
  todo: TodoItem;
  onToggle: (id: number) => void;
  getCategoryColor: (category: string) => string;
  formatDate: (date: string) => string;
  showDate?: boolean;
}

const TodoCard: React.FC<TodoCardProps> = ({ 
  todo, 
  onToggle, 
  getCategoryColor, 
  formatDate, 
  showDate = false 
}) => {
  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
        todo.completed 
          ? 'glass-effect opacity-60' 
          : 'glass-effect hover:shadow-lg'
      }`}
      onClick={() => onToggle(todo.id)}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed 
            ? 'bg-hero-500 border-hero-500 scale-110' 
            : 'border-gray-400 hover:border-hero-400'
        }`}>
          {todo.completed && <Check className="w-4 h-4 text-white" />}
        </div>
        
        <div className="flex-1">
          <p className={`text-gray-800 transition-all duration-200 ${
            todo.completed ? 'line-through opacity-70' : ''
          }`}>
            {todo.text}
          </p>
          {showDate && (
            <p className="text-xs text-gray-500 mt-1">{formatDate(todo.date)}</p>
          )}
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs border font-medium ${getCategoryColor(todo.category)}`}>
          {todo.category}
        </span>
      </div>
    </Card>
  );
};

export default TodoCard;
