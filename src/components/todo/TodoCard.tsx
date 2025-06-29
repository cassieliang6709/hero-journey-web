
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListTodo, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  category: string;
}

interface TodoCardProps {
  onClose: () => void;
  onGoToTodoList: () => void;
  aiMessage?: string; // 新增属性接收AI消息
}

const TodoCard: React.FC<TodoCardProps> = ({ onClose, onGoToTodoList, aiMessage }) => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: '早上运动', completed: false, category: '身体' },
    { id: 2, text: '冥想练习', completed: false, category: '情绪' },
    { id: 3, text: '学习新技能', completed: false, category: '技能' },
  ]);
  const [newTodoText, setNewTodoText] = useState('');

  // 当收到AI消息时，自动生成待办事项
  useEffect(() => {
    if (aiMessage && aiMessage.includes('📝')) {
      generateTodosFromAiMessage(aiMessage);
    }
  }, [aiMessage]);

  const generateTodosFromAiMessage = (message: string) => {
    // 提取包含📝的行作为待办事项
    const lines = message.split('\n');
    const todoLines = lines.filter(line => line.includes('📝'));
    
    if (todoLines.length > 0) {
      const newTodos: TodoItem[] = todoLines.map((line, index) => {
        // 移除📝符号并清理文本
        const text = line.replace('📝', '').trim();
        
        // 根据内容判断分类
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
      
      setTodos(newTodos);
      toast.success('已为你生成创业活动待办清单！', { duration: 3000 });
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
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
    
    setTodos(prev => [...prev, newTodo]);
    setNewTodoText('');
    toast.success('待办事项已添加', { duration: 2000 });
  };

  return (
    <div className="flex justify-center animate-fade-in">
      <Card className="w-full max-w-sm bg-white border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900 font-medium flex items-center">
            <ListTodo className="w-4 h-4 mr-2" />
            待办事项
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        {/* 待办事项列表 */}
        <div className="space-y-2 mb-3 max-h-60 overflow-y-auto">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
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
        
        {/* 添加新待办事项 */}
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
