
import React from 'react';
import { Card } from '@/components/ui/card';

interface SuccessMessageProps {
  completionRate: number;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ completionRate }) => {
  if (completionRate <= 50) {
    return null;
  }

  return (
    <Card className="bg-white border border-gray-200 p-4 text-center animate-fade-in">
      <span className="text-2xl mb-2 block">🎉</span>
      <p className="text-gray-900 font-medium">做得很棒！</p>
      <p className="text-gray-600 text-sm">你已经完成了一半以上的任务</p>
    </Card>
  );
};

export default SuccessMessage;
