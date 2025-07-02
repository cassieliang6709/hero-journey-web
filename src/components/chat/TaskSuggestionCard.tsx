import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Plus, Check } from 'lucide-react';
import { TaskSuggestion } from '@/types/taskSuggestion';
import { useTodos } from '@/hooks/useTodos';
import { toast } from 'sonner';

interface TaskSuggestionCardProps {
  suggestions: TaskSuggestion[];
  onClose: () => void;
}

const TaskSuggestionCard: React.FC<TaskSuggestionCardProps> = ({ suggestions, onClose }) => {
  const { addTodo } = useTodos();
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
            AI为你推荐的任务
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => {
          const isAdded = addedTasks.has(suggestion.id);
          const isLoading = loading === suggestion.id;
          
          return (
            <div
              key={suggestion.id}
              className="p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <h4 className="font-medium text-foreground">{suggestion.title}</h4>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className={getDifficultyColor(suggestion.difficulty)}>
                      {getDifficultyText(suggestion.difficulty)}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {suggestion.estimatedTime}
                    </div>
                    {suggestion.category && (
                      <Badge variant="outline">{suggestion.category}</Badge>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddTask(suggestion)}
                  disabled={isAdded || isLoading}
                  className={isAdded ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isAdded ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isAdded ? '已添加' : '添加'}
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