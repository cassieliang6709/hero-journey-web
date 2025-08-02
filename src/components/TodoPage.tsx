
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Globe, Loader2, Plus, Brain, Sparkles, Calendar } from 'lucide-react';
import TodoStats from './todo/TodoStats';
import TodoList from './todo/TodoList';
import SuccessMessage from './todo/SuccessMessage';
import WeekCalendar from '@/components/WeekCalendar';
import { callAI } from '@/services/aiService';
import { useTodos } from '@/hooks/useTodos';
import { toast } from 'sonner';

interface TodoPageProps {
  user: { username: string };
  onGoToStarMap: () => void;
  onBack: () => void;
  onGoToPhysicalTest?: () => void;
  onGoToTalentTest?: () => void;
}

const TodoPage: React.FC<TodoPageProps> = ({ user, onGoToStarMap, onBack }) => {
  const { todos, loading, toggleTodo, addTodo } = useTodos();
  const [newTodoText, setNewTodoText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const completedCount = todos.filter(todo => todo.completed).length;
  const completionRate = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  const handleAddTodo = async () => {
    if (!newTodoText.trim() || isAdding) return;
    
    setIsAdding(true);
    const result = await addTodo(newTodoText, '新增');
    if (result) {
      setNewTodoText('');
    }
    setIsAdding(false);
  };


  const handleAIPriority = async () => {
    if (todos.filter(todo => !todo.completed).length < 3) {
      toast.info('任务较少，暂不需要AI排序');
      return;
    }

    setIsProcessingAI(true);
    try {
      const uncompletedTodos = todos.filter(todo => !todo.completed);
      const todoTexts = uncompletedTodos.map((todo, index) => `${index + 1}. ${todo.text} (分类: ${todo.category})`).join('\n');
      
      const prompt = `请帮我分析这些待办事项的优先级，并提供优化建议：

${todoTexts}

请按照以下格式返回：
1. 优先级排序（按重要性和紧急性）
2. 建议删除或延后的任务
3. 简短的理由

要求：
- 考虑任务的重要性、紧急性和执行难度
- 建议删除不必要或可延后的任务
- 保持回复简洁实用`;

      const aiResponse = await callAI(prompt);
      
      // 显示AI分析结果
      toast.success('AI优先级分析完成');
      
      // 这里可以进一步处理AI返回的结果
      // 比如解析出具体的排序建议并应用到任务列表
      console.log('AI优先级分析结果:', aiResponse);
      
      // 临时显示结果（实际项目中可以用modal显示）
      alert(`AI分析建议：\n\n${aiResponse}`);
      
    } catch (error) {
      console.error('AI优先级分析失败:', error);
      toast.error('AI分析失败，请稍后重试');
    } finally {
      setIsProcessingAI(false);
    }
  };

  if (loading) {
    return (
      <div className="mobile-container bg-white min-h-screen">
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
              <p className="text-gray-600 text-sm">加载中...</p>
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
        
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">加载待办事项...</span>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCalendar(!showCalendar)}
            className="text-gray-900 hover:bg-gray-100"
          >
            <Calendar className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoToStarMap}
            className="text-gray-900 hover:bg-gray-100"
          >
            <Globe className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="p-4 space-y-4">
        {/* 进度统计 */}
        <TodoStats 
          completedCount={completedCount}
          totalCount={todos.length}
          completionRate={completionRate}
        />

        {/* 7天日历视图 */}
        {showCalendar && (
          <WeekCalendar 
            todos={todos}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onMoveTodo={(todoId, targetDate) => {
              // TODO: 实现任务移动到指定日期的功能
              toast.info('任务移动功能开发中');
            }}
          />
        )}

        {/* AI优先级排序 */}
        {todos.filter(todo => !todo.completed).length > 3 && (
          <div className="mb-4">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleAIPriority}
              disabled={isProcessingAI}
              className="flex items-center gap-2"
            >
              {isProcessingAI ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isProcessingAI ? 'AI分析中...' : 'AI优先级排序'}
            </Button>
          </div>
        )}

        {/* 添加新待办事项 */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-purple-500" />
            <h3 className="text-gray-900 font-medium">创建新任务</h3>
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="输入新任务..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              disabled={isAdding}
            />
            <Button
              onClick={handleAddTodo}
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 text-white px-3"
              disabled={isAdding || !newTodoText.trim()}
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          
          <div className="text-xs text-gray-500 flex items-center">
            <Brain className="w-3 h-3 mr-1" />
            AI会自动将任务分类到对应星图节点
          </div>
        </div>

        {/* 任务列表 */}
        <TodoList 
          todos={todos.map(todo => ({
            id: todo.id,
            text: todo.text,
            completed: todo.completed,
            category: todo.category,
            progress: todo.progress
          }))}
          onToggleTodo={toggleTodo}
        />

        {/* 成功消息 */}
        <SuccessMessage completionRate={completionRate} />
      </div>
    </div>
  );
};

export default TodoPage;
