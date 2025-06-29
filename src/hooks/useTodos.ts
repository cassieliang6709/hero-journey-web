
import { useState, useEffect } from 'react';

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  progress?: {
    completed: number;
    total: number;
  };
  completedAt?: Date;
  starMapNodeId?: string; // 关联的星图节点ID
}

const STORAGE_KEY = 'user_todos';

const initialTodos: TodoItem[] = [
  { 
    id: 1, 
    text: '早上运动', 
    completed: false, 
    category: '身体',
    progress: { completed: 2, total: 5 },
    starMapNodeId: 'health-1'
  },
  { 
    id: 2, 
    text: '冥想练习', 
    completed: false, 
    category: '情绪',
    progress: { completed: 1, total: 3 },
    starMapNodeId: 'psychology-1'
  },
  { 
    id: 3, 
    text: '学习新技能', 
    completed: false, 
    category: '技能',
    progress: { completed: 4, total: 6 },
    starMapNodeId: 'skill-1'
  },
];

export const useTodos = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    // 从本地存储加载数据
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    return savedTodos ? JSON.parse(savedTodos) : initialTodos;
  });

  // 保存到本地存储
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { 
        ...todo, 
        completed: !todo.completed,
        completedAt: !todo.completed ? new Date() : undefined
      } : todo
    ));
  };

  const addTodo = (text: string, category: string = '新增', starMapNodeId?: string) => {
    const newTodo: TodoItem = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      category,
      starMapNodeId
    };
    
    setTodos(prev => [...prev, newTodo]);
    return newTodo;
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // 获取特定星图节点的完成任务统计
  const getNodeCompletionStats = (nodeId: string) => {
    const nodeTodos = todos.filter(todo => todo.starMapNodeId === nodeId);
    const completedTodos = nodeTodos.filter(todo => todo.completed);
    
    return {
      total: nodeTodos.length,
      completed: completedTodos.length,
      completedTodos: completedTodos,
      recentCompletions: completedTodos
        .filter(todo => todo.completedAt)
        .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
        .slice(0, 5)
    };
  };

  // 根据分类获取完成统计
  const getCategoryCompletionStats = (category: string) => {
    const categoryTodos = todos.filter(todo => 
      todo.category === category || 
      (category === '身体' && todo.category === '健身') ||
      (category === '情绪' && todo.category === '心理') ||
      (category === '技能' && todo.category === '学习')
    );
    const completedTodos = categoryTodos.filter(todo => todo.completed);
    
    return {
      total: categoryTodos.length,
      completed: completedTodos.length,
      completionRate: categoryTodos.length > 0 ? Math.round((completedTodos.length / categoryTodos.length) * 100) : 0
    };
  };

  return {
    todos,
    toggleTodo,
    addTodo,
    deleteTodo,
    getNodeCompletionStats,
    getCategoryCompletionStats
  };
};
