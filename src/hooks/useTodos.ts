
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

  // 从Supabase加载待办事项
  const loadTodos = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading todos:', error);
        toast.error('加载待办事项失败');
        return;
      }

      const formattedTodos: TodoItem[] = (data || []).map(todo => ({
        id: todo.id,
        text: todo.text,
        completed: todo.completed,
        category: todo.category,
        progress: todo.progress_completed && todo.progress_total ? {
          completed: todo.progress_completed,
          total: todo.progress_total
        } : undefined,
        completedAt: todo.completed_at ? new Date(todo.completed_at) : undefined,
        starMapNodeId: todo.star_map_node_id || undefined,
        userId: todo.user_id,
        createdAt: new Date(todo.created_at),
        updatedAt: new Date(todo.updated_at)
      }));

      setTodos(formattedTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
      toast.error('加载待办事项失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadTodos();
  }, []);

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const newCompleted = !todo.completed;
      const updateData: any = {
        completed: newCompleted,
        updated_at: new Date().toISOString()
      };

      if (newCompleted) {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      const { error } = await supabase
        .from('todos')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error toggling todo:', error);
        toast.error('更新待办事项失败');
        return;
      }

      setTodos(prevTodos => 
        prevTodos.map(t => 
          t.id === id 
            ? { 
                ...t, 
                completed: newCompleted,
                completedAt: newCompleted ? new Date() : undefined,
                updatedAt: new Date()
              }
            : t
        )
      );
      
      toast.success(newCompleted ? '任务已完成' : '任务已取消完成');
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast.error('更新待办事项失败');
    }
  };

  const addTodo = async (text: string, category: string = '新增', starMapNodeId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('请先登录');
        return null;
      }

      const newTodoData = {
        text: text.trim(),
        completed: false,
        category,
        star_map_node_id: starMapNodeId,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('todos')
        .insert([newTodoData])
        .select()
        .single();

      if (error) {
        console.error('Error adding todo:', error);
        toast.error('添加待办事项失败');
        return null;
      }

      const newTodo: TodoItem = {
        id: data.id,
        text: data.text,
        completed: data.completed,
        category: data.category,
        starMapNodeId: data.star_map_node_id || undefined,
        userId: data.user_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setTodos(prevTodos => [newTodo, ...prevTodos]);
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
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting todo:', error);
        toast.error('删除待办事项失败');
        return;
      }

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
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
