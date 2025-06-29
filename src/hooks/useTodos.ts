
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
}

const STORAGE_KEY = 'user_todos';

const initialTodos: TodoItem[] = [
  { 
    id: 1, 
    text: '早上运动', 
    completed: false, 
    category: '身体',
    progress: { completed: 2, total: 5 }
  },
  { 
    id: 2, 
    text: '冥想练习', 
    completed: false, 
    category: '情绪',
    progress: { completed: 1, total: 3 }
  },
  { 
    id: 3, 
    text: '学习新技能', 
    completed: false, 
    category: '技能',
    progress: { completed: 4, total: 6 }
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
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addTodo = (text: string, category: string = '新增') => {
    const newTodo: TodoItem = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      category
    };
    
    setTodos(prev => [...prev, newTodo]);
    return newTodo;
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return {
    todos,
    toggleTodo,
    addTodo,
    deleteTodo
  };
};
