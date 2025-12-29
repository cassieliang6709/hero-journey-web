import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfDay, isSameDay, isToday } from 'date-fns';
import { TodoItem } from '@/hooks/useTodos';

interface WeekCalendarProps {
  todos: TodoItem[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
  onMoveTodo: (todoId: string, targetDate: Date) => void;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({ 
  todos, 
  onDateSelect, 
  selectedDate, 
  onMoveTodo 
}) => {
  const [weekStart, setWeekStart] = useState(startOfDay(new Date()));

  const getDaysInWeek = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }
    return days;
  };

  const getTodosForDate = (date: Date) => {
    return todos.filter(todo => {
      if (!todo.createdAt) return false;
      return isSameDay(new Date(todo.createdAt), date);
    });
  };

  const nextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  const prevWeek = () => {
    setWeekStart(addDays(weekStart, -7));
  };

  const days = getDaysInWeek();

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">7天视图</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayTodos = getTodosForDate(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);
          
          return (
            <div
              key={day.toISOString()}
              className={`p-2 border rounded-lg cursor-pointer transition-colors min-h-[80px] ${
                isSelected 
                  ? 'bg-primary/20 border-primary' 
                  : isCurrentDay 
                  ? 'bg-accent border-accent-foreground/20'
                  : 'hover:bg-muted border-border'
              }`}
              onClick={() => onDateSelect(day)}
            >
              <div className="text-center">
                <div className="text-xs font-medium">
                  {format(day, 'MM/dd')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(day, 'E')}
                </div>
              </div>
              
              <div className="mt-2 space-y-1">
                {dayTodos.slice(0, 2).map((todo) => (
                  <Badge
                    key={todo.id}
                    variant={todo.completed ? "secondary" : "default"}
                    className="text-xs truncate w-full justify-center"
                  >
                    {todo.text.slice(0, 8)}...
                  </Badge>
                ))}
                {dayTodos.length > 2 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{dayTodos.length - 2}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default WeekCalendar;