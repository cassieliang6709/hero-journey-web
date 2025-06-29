
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  progress?: {
    completed: number;
    total: number;
  };
  completedAt?: Date;
  starMapNodeId?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 从本地存储加载待办事项
  const loadTodos = async () => {
    try {
      setLoading(true);
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos).map((todo: any) => ({
          ...todo,
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          createdAt: todo.createdAt ? new Date(todo.createdAt) : undefined,
          updatedAt: todo.updatedAt ? new Date(todo.updatedAt) : undefined,
        }));
        setTodos(parsedTodos);
      }
    } catch (error) {
      console.error('Error loading todos:', error);
      toast.error('加载待办事项失败');
    } finally {
      setLoading(false);
    }
  };

  // 保存待办事项到本地存储
  const saveTodos = (updatedTodos: TodoItem[]) => {
    try {
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error saving todos:', error);
      toast.error('保存待办事项失败');
    }
  };

  // 初始化加载
  useEffect(() => {
    loadTodos();
  }, []);

  const toggleTodo = async (id: string) => {
    try {
      const updatedTodos = todos.map(todo => {
        if (todo.id === id) {
          const newCompleted = !todo.completed;
          return {
            ...todo,
            completed: newCompleted,
            completedAt: newCompleted ? new Date() : undefined,
            updatedAt: new Date()
          };
        }
        return todo;
      });

      setTodos(updatedTodos);
      saveTodos(updatedTodos);
      
      const todo = todos.find(t => t.id === id);
      toast.success(todo?.completed ? '任务已取消完成' : '任务已完成');
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast.error('更新待办事项失败');
    }
  };

  const addTodo = async (text: string, category: string = '新增', starMapNodeId?: string) => {
    try {
      const newTodo: TodoItem = {
        id: `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: text.trim(),
        completed: false,
        category,
        starMapNodeId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedTodos = [newTodo, ...todos];
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
      
      toast.success('待办事项已添加');
      return newTodo;
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('添加待办事项失败');
      return null;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
      toast.success('待办事项已删除');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('删除待办事项失败');
    }
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
    loading,
    toggleTodo,
    addTodo,
    deleteTodo,
    getNodeCompletionStats,
    getCategoryCompletionStats,
    refreshTodos: loadTodos
  };
};
