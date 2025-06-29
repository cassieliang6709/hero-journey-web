
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Globe, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import TodoStats from './todo/TodoStats';
import SuccessMessage from './todo/SuccessMessage';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  category: string;
}

interface TodoGroup {
  id: string;
  title: string;
  description: string;
  emoji: string;
  todos: TodoItem[];
  isOpen: boolean;
}

interface TodoPageProps {
  user: { username: string };
  onGoToStarMap: () => void;
  onBack: () => void;
  onGoToPhysicalTest?: () => void;
  onGoToTalentTest?: () => void;
}

const TodoPage: React.FC<TodoPageProps> = ({ user, onGoToStarMap, onBack }) => {
  const [todoGroups, setTodoGroups] = useState<TodoGroup[]>([
    {
      id: 'friday',
      title: '周五｜Pitch & 组队日',
      description: '打下技术基础',
      emoji: '🎯',
      isOpen: true,
      todos: [
        { id: 101, text: '准备30秒技术标签式自我介绍', completed: false, category: '准备' },
        { id: 102, text: '梳理自己的核心技能 → 明确技术边界', completed: false, category: '准备' },
        { id: 103, text: '浏览项目/团队列表，筛选技术匹配度高的项目', completed: false, category: '筛选' },
        { id: 104, text: '主动出击：沟通技术实现方案，锚定技术价值', completed: false, category: '沟通' },
        { id: 105, text: '优先加入含PM + 设计师的完整团队', completed: false, category: '组队' }
      ]
    },
    {
      id: 'saturday',
      title: '周六｜开发日',
      description: '守住魔法点，快速落地 MVP',
      emoji: '🚀',
      isOpen: false,
      todos: [
        { id: 201, text: '明确 MVP 范围并锁死', completed: false, category: 'MVP' },
        { id: 202, text: '优先开发项目中最有"魔力"的核心流程', completed: false, category: 'MVP' },
        { id: 203, text: '模块化搭建：能拆则拆，能替则替', completed: false, category: '开发' },
        { id: 204, text: '每小时汇报一次进度+阻塞+需求', completed: false, category: '开发' }
      ]
    },
    {
      id: 'sunday',
      title: '周日｜Demo Day',
      description: '表达价值，稳定为王',
      emoji: '🎤',
      isOpen: false,
      todos: [
        { id: 301, text: '提炼 1-2 个技术亮点（用非技术语言表达）', completed: false, category: '路演' },
        { id: 302, text: '进行技术彩排（环境/网络/投影测试）', completed: false, category: '路演' },
        { id: 303, text: '准备崩溃备用方案（截图/录屏方案）', completed: false, category: '路演' }
      ]
    }
  ]);

  const [newTodoText, setNewTodoText] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('friday');

  const toggleGroup = (groupId: string) => {
    setTodoGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, isOpen: !group.isOpen } : group
    ));
  };

  const toggleTodo = (groupId: string, todoId: number) => {
    setTodoGroups(prev => prev.map(group => 
      group.id === groupId 
        ? {
            ...group,
            todos: group.todos.map(todo => 
              todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
            )
          }
        : group
    ));
  };

  const addNewTodo = () => {
    if (!newTodoText.trim()) return;
    
    const newTodo: TodoItem = {
      id: Date.now(),
      text: newTodoText.trim(),
      completed: false,
      category: '新增'
    };
    
    setTodoGroups(prev => prev.map(group => 
      group.id === selectedGroupId 
        ? { ...group, todos: [...group.todos, newTodo] }
        : group
    ));
    
    setNewTodoText('');
    toast.success('待办事项已添加', { duration: 2000 });
  };

  const getTotalTodos = () => {
    return todoGroups.reduce((total, group) => total + group.todos.length, 0);
  };

  const getCompletedTodos = () => {
    return todoGroups.reduce((total, group) => 
      total + group.todos.filter(todo => todo.completed).length, 0
    );
  };

  const completedCount = getCompletedTodos();
  const totalCount = getTotalTodos();
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
            <h1 className="text-gray-900 font-semibold">创业活动待办清单</h1>
            <p className="text-gray-600 text-sm">完成率: {completionRate}%</p>
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

      {/* 主要内容区域 */}
      <div className="p-4 space-y-4">
        {/* 进度统计 */}
        <TodoStats 
          completedCount={completedCount}
          totalCount={totalCount}
          completionRate={completionRate}
        />

        {/* 折叠式待办事项组 */}
        <div className="space-y-3">
          {todoGroups.map((group) => (
            <Collapsible key={group.id} open={group.isOpen} onOpenChange={() => toggleGroup(group.id)}>
              <Card className="border border-gray-200">
                <CollapsibleTrigger asChild>
                  <div className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{group.emoji}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{group.title}</h4>
                        <p className="text-sm text-gray-500">{group.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">
                        {group.todos.filter(t => t.completed).length}/{group.todos.length}
                      </span>
                      {group.isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-3">
                    {group.todos.map((todo) => (
                      <Card
                        key={todo.id}
                        className={`p-3 cursor-pointer transition-all duration-200 border ${
                          todo.completed 
                            ? 'bg-gray-50 border-gray-200 opacity-60' 
                            : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
                        }`}
                        onClick={() => toggleTodo(group.id, todo.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              todo.completed 
                                ? 'bg-gray-900 border-gray-900' 
                                : 'border-gray-400'
                            }`}>
                              {todo.completed && <Check className="w-3 h-3 text-white" />}
                            </div>
                            
                            <p className={`text-gray-900 flex-1 ${todo.completed ? 'line-through' : ''}`}>
                              {todo.text}
                            </p>
                          </div>
                          
                          <span className="px-2 py-1 rounded-full text-xs border bg-gray-100 text-gray-800 border-gray-300 ml-3">
                            {todo.category}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>

        {/* 添加新待办事项 */}
        <Card className="p-4">
          <h3 className="font-medium text-gray-900 mb-3">添加新任务</h3>
          <div className="space-y-2">
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded px-3 py-2"
            >
              {todoGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.emoji} {group.title}
                </option>
              ))}
            </select>
            
            <div className="flex space-x-2">
              <Input
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="输入新的待办任务..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addNewTodo()}
              />
              <Button
                onClick={addNewTodo}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                添加
              </Button>
            </div>
          </div>
        </Card>

        {/* 成功消息 */}
        <SuccessMessage completionRate={completionRate} />
      </div>
    </div>
  );
};

export default TodoPage;
