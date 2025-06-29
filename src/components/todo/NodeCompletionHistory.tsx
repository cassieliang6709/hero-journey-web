
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar } from 'lucide-react';
import { TodoItem } from '@/hooks/useTodos';

interface NodeCompletionHistoryProps {
  nodeId: string;
  nodeName: string;
  completionStats: {
    total: number;
    completed: number;
    completedTodos: TodoItem[];
    recentCompletions: TodoItem[];
  };
  onClose: () => void;
}

const NodeCompletionHistory: React.FC<NodeCompletionHistoryProps> = ({
  nodeId,
  nodeName,
  completionStats,
  onClose
}) => {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border border-gray-200 p-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-gray-900 font-semibold">{nodeName}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-700">{completionStats.completed}</div>
            <div className="text-sm text-green-600">已完成</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-700">{completionStats.total}</div>
            <div className="text-sm text-blue-600">总任务</div>
          </div>
        </div>

        {/* 最近完成的任务 */}
        {completionStats.recentCompletions.length > 0 && (
          <div>
            <h4 className="text-gray-700 font-medium mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              最近完成
            </h4>
            <div className="space-y-2">
              {completionStats.recentCompletions.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">{todo.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {todo.completedAt && formatDate(todo.completedAt)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    {todo.category}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {completionStats.completed === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>还没有完成的任务</p>
            <p className="text-sm mt-1">开始完成相关任务来点亮这个节点吧！</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default NodeCompletionHistory;
