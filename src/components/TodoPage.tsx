import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Globe, Loader2, Plus, Brain, Sparkles, Calendar } from 'lucide-react';
import TodoStats from './todo/TodoStats';
import TodoList from './todo/TodoList';
import SuccessMessage from './todo/SuccessMessage';
import WeekCalendar from '@/components/WeekCalendar';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
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
  const { t } = useTranslation('todo');
  const { t: tCommon } = useTranslation('common');
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
      toast.info(t('aiPriority.tooFewTasks'));
      return;
    }

    setIsProcessingAI(true);
    try {
      const uncompletedTodos = todos.filter(todo => !todo.completed);
      const todoTexts = uncompletedTodos.map((todo, index) => `${index + 1}. ${todo.text} (${t('category')}: ${todo.category})`).join('\n');
      
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
      
      toast.success(t('aiPriority.complete'));
      alert(`${t('aiPriority.title')}：\n\n${aiResponse}`);
      
    } catch (error) {
      console.error('AI优先级分析失败:', error);
      toast.error(t('aiPriority.failed'));
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
              <h1 className="text-gray-900 font-semibold">{t('title')}</h1>
              <p className="text-gray-600 text-sm">{tCommon('loading')}</p>
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
          <span className="ml-2 text-gray-500">{tCommon('loadingTodos')}</span>
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
            <h1 className="text-gray-900 font-semibold">{t('title')}</h1>
            <p className="text-gray-600 text-sm">{tCommon('completionRate')}: {completionRate}%</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
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
              toast.info(tCommon('taskMoveInProgress'));
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
              {isProcessingAI ? t('aiPriority.analyzing') : t('aiPriority.button')}
            </Button>
          </div>
        )}

        {/* 添加新待办事项 */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-purple-500" />
            <h3 className="text-gray-900 font-medium">{t('createNewTask')}</h3>
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder={t('addTaskPlaceholder')}
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
            {t('aiClassifyHint')}
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
