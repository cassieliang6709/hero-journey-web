
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListTodo, Plus, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
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

interface TodoCardProps {
  onClose: () => void;
  onGoToTodoList: () => void;
  aiMessage?: string;
}

const TodoCard: React.FC<TodoCardProps> = ({ onClose, onGoToTodoList, aiMessage }) => {
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
        { id: 105, text: '优先加入含PM + 设计师的完整团队', completed: false, category: '组队' },
        { id: 106, text: '确定使用的技术栈（坚持熟悉工具）', completed: false, category: '技术' },
        { id: 107, text: '评估项目的技术可行性（是否能MVP demo）', completed: false, category: '技术' },
        { id: 108, text: '定义 MVP 的核心功能点', completed: false, category: '技术' },
        { id: 109, text: '创建 Git 仓库 / 初始化项目环境', completed: false, category: '技术' },
        { id: 110, text: '配置开发环境、API Key、必要服务', completed: false, category: '技术' }
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
        { id: 203, text: '遇到难点 → 静态数据 or 云服务模拟替代', completed: false, category: 'MVP' },
        { id: 204, text: '模块化搭建：能拆则拆，能替则替', completed: false, category: '开发' },
        { id: 205, text: '每小时汇报一次【进度】+【阻塞】+【需求】', completed: false, category: '开发' },
        { id: 206, text: '实时同步设计稿 → 最后2小时锁定版本', completed: false, category: '开发' },
        { id: 207, text: '18:00前完成演示流程（哪怕是静态）', completed: false, category: '演示' },
        { id: 208, text: '录一份备用视频 / 准备截图备用方案', completed: false, category: '演示' }
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
        { id: 302, text: '进行技术彩排（环境 / 网络 / 投影测试）', completed: false, category: '路演' },
        { id: 303, text: '准备"崩溃备用方案"（截图/录屏方案）', completed: false, category: '路演' },
        { id: 304, text: '技术提问 → 回答结构：【功能亮点】+【用户价值】', completed: false, category: '问答' },
        { id: 305, text: '不懂的问题直接绕：回到用户、数据、效率提升', completed: false, category: '问答' }
      ]
    },
    {
      id: 'survival',
      title: '生存锦囊',
      description: '全程通用策略',
      emoji: '🧘‍♀️',
      isOpen: false,
      todos: [
        { id: 401, text: '设闹钟提醒喝水 / 吃饭 / 拉伸', completed: false, category: '能量' },
        { id: 402, text: '每3小时至少休息10分钟，闭眼或走动', completed: false, category: '能量' },
        { id: 403, text: '拿不准就写下来，别用脑子缓存琐事', completed: false, category: '能量' },
        { id: 404, text: '准备技术栈备胎（如React主力，Vue做兼容展示）', completed: false, category: '工具' },
        { id: 405, text: '准备离线文档包 & 常用代码片段库', completed: false, category: '工具' },
        { id: 406, text: '带U盘（装开发环境、字体、演示PPT等）', completed: false, category: '工具' }
      ]
    }
  ]);

  const [newTodoText, setNewTodoText] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('friday');

  // 当收到AI消息时，自动生成待办事项
  useEffect(() => {
    if (aiMessage && aiMessage.includes('📝')) {
      generateTodosFromAiMessage(aiMessage);
    }
  }, [aiMessage]);

  const generateTodosFromAiMessage = (message: string) => {
    const lines = message.split('\n');
    const todoLines = lines.filter(line => line.includes('📝'));
    
    if (todoLines.length > 0) {
      const newTodos: TodoItem[] = todoLines.map((line, index) => {
        const text = line.replace('📝', '').trim();
        
        let category = '技能';
        if (text.includes('组队') || text.includes('沟通') || text.includes('自我介绍')) {
          category = '社交';
        } else if (text.includes('技术') || text.includes('开发') || text.includes('代码')) {
          category = '技术';
        } else if (text.includes('路演') || text.includes('演示') || text.includes('表达')) {
          category = '展示';
        } else if (text.includes('休息') || text.includes('喝水') || text.includes('拉伸')) {
          category = '健康';
        }
        
        return {
          id: Date.now() + index,
          text,
          completed: false,
          category
        };
      });
      
      // 添加到第一个组
      setTodoGroups(prev => prev.map((group, index) => 
        index === 0 ? { ...group, todos: newTodos } : group
      ));
      
      toast.success('已为你生成创业活动待办清单！', { duration: 3000 });
    }
  };

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

  return (
    <div className="flex justify-center animate-fade-in">
      <Card className="w-full max-w-lg bg-white border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900 font-medium flex items-center">
              <ListTodo className="w-4 h-4 mr-2" />
              创业活动待办清单
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {getCompletedTodos()}/{getTotalTodos()} 已完成
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        
        {/* 折叠式待办事项组 */}
        <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
          {todoGroups.map((group) => (
            <Collapsible key={group.id} open={group.isOpen} onOpenChange={() => toggleGroup(group.id)}>
              <Card className="border border-gray-200">
                <CollapsibleTrigger asChild>
                  <div className="p-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{group.emoji}</span>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{group.title}</h4>
                        <p className="text-xs text-gray-500">{group.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {group.todos.filter(t => t.completed).length}/{group.todos.length}
                      </span>
                      {group.isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-3 pb-3 space-y-2">
                    {group.todos.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                      >
                        <button
                          onClick={() => toggleTodo(group.id, todo.id)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            todo.completed 
                              ? 'bg-gray-900 border-gray-900' 
                              : 'border-gray-400'
                          }`}
                        >
                          {todo.completed && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <span className={`text-sm flex-1 ${
                          todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {todo.text}
                        </span>
                        <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded">
                          {todo.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
        
        {/* 添加新待办事项 */}
        <div className="space-y-2">
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
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
              placeholder="添加新任务..."
              className="flex-1 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addNewTodo()}
            />
            <Button
              onClick={addNewTodo}
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 text-white px-3"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* 查看完整待办页面按钮 */}
        <Button
          onClick={onGoToTodoList}
          variant="outline"
          className="w-full mt-3 text-sm text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          查看完整待办列表
        </Button>
      </Card>
    </div>
  );
};

export default TodoCard;
