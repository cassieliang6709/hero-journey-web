import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Star, Plus, Check } from 'lucide-react';
import { TaskSuggestion } from '@/types/taskSuggestion';
import { useTodos } from '@/hooks/useTodos';
import { toast } from 'sonner';

interface TaskSuggestionCardProps {
  suggestions: TaskSuggestion[];
  onClose: () => void;
  onTaskComplete?: (taskTitle: string) => void;
}

const TaskSuggestionCard: React.FC<TaskSuggestionCardProps> = ({ suggestions, onClose, onTaskComplete }) => {
  const { addTodo } = useTodos();
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [addedTasks, setAddedTasks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);

  const handleAddTask = async (suggestion: TaskSuggestion) => {
    if (addedTasks.has(suggestion.id)) return;
    
    setLoading(suggestion.id);
    try {
      const result = await addTodo(suggestion.title, suggestion.category || '新增');
      if (result) {
        setAddedTasks(prev => new Set([...prev, suggestion.id]));
        toast.success(`任务"${suggestion.title}"已添加到待办列表`);
      }
    } catch (error) {
      toast.error('添加任务失败，请重试');
    } finally {
      setLoading(null);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    const suggestion = suggestions.find(s => s.id === taskId);
    
    if (completedTasks.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
      // 触发AI奖励反馈
      if (suggestion && onTaskComplete) {
        onTaskComplete(suggestion.title);
      }
    }
    
    setCompletedTasks(newCompleted);
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'bg-green-100 text-green-800';
    if (difficulty <= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 2) return '简单';
    if (difficulty <= 3) return '中等';
    return '困难';
  };

  return (
    <Card className="w-full animate-fade-in border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            为你推荐的任务
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((suggestion, index) => {
          const isCompleted = completedTasks.has(suggestion.id);
          const isAdded = addedTasks.has(suggestion.id);
          const isLoading = loading === suggestion.id;
          
          return (
            <div
              key={suggestion.id}
              className={`p-3 border border-border rounded-lg bg-card transition-all duration-200 ${
                isCompleted ? 'bg-green-50/50 border-green-200' : 'hover:bg-accent/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="pt-1">
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => handleCompleteTask(suggestion.id)}
                    className="w-4 h-4"
                  />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h4 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {suggestion.title}
                    </h4>
                  </div>
                  
                  <p className={`text-sm ${isCompleted ? 'line-through text-muted-foreground/70' : 'text-muted-foreground'}`}>
                    {suggestion.description}
                  </p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className={getDifficultyColor(suggestion.difficulty)}>
                      {getDifficultyText(suggestion.difficulty)}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {suggestion.estimatedTime}
                    </div>
                    {suggestion.category && (
                      <Badge variant="outline" className="text-xs">{suggestion.category}</Badge>
                    )}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddTask(suggestion)}
                  disabled={isAdded || isLoading}
                  className={`min-w-[60px] ${isAdded ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' : ''}`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isAdded ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Plus className="w-3 h-3" />
                  )}
                  <span className="ml-1 text-xs">{isAdded ? '已添加' : '添加'}</span>
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TaskSuggestionCard;