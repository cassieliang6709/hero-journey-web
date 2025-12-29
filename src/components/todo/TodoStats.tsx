
import React from 'react';
import { Card } from '@/components/ui/card';

interface TodoStatsProps {
  completedCount: number;
  totalCount: number;
  completionRate: number;
}

const TodoStats: React.FC<TodoStatsProps> = ({ 
  completedCount, 
  totalCount, 
  completionRate 
}) => {
  return (
    <Card className="bg-white border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-900 font-medium">总体进度</span>
        <span className="text-gray-900 font-bold">{completedCount}/{totalCount}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gray-900 h-3 rounded-full transition-all duration-500"
          style={{ width: `${completionRate}%` }}
        />
      </div>
    </Card>
  );
};

export default TodoStats;
