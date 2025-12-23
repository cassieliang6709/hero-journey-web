import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { classifyTodoToNode } from '@/services/todoClassificationService';
import { useCallback } from 'react';

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

// Query keys for cache management
export const todoKeys = {
  all: ['todos'] as const,
  list: () => [...todoKeys.all, 'list'] as const,
};

// Fetch function
const fetchTodos = async (): Promise<TodoItem[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to load todos');
  }

  return (data || []).map(todo => ({
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
};

export const useTodos = () => {
  const queryClient = useQueryClient();

  // Query for fetching todos
  const { data: todos = [], isLoading: loading, refetch } = useQuery({
    queryKey: todoKeys.list(),
    queryFn: fetchTodos,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation for toggling todo
  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const todo = todos.find(t => t.id === id);
      if (!todo) throw new Error('Todo not found');

      const newCompleted = !todo.completed;
      const updateData: Record<string, unknown> = {
        completed: newCompleted,
        updated_at: new Date().toISOString(),
        completed_at: newCompleted ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('todos')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      return { id, newCompleted };
    },
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: todoKeys.list() });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData<TodoItem[]>(todoKeys.list());

      // Optimistically update
      queryClient.setQueryData<TodoItem[]>(todoKeys.list(), (old) =>
        old?.map(t =>
          t.id === id
            ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date() : undefined }
            : t
        )
      );

      return { previousTodos };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(todoKeys.list(), context?.previousTodos);
      toast.error('更新待办事项失败');
    },
    onSuccess: ({ newCompleted }) => {
      toast.success(newCompleted ? '任务已完成' : '任务已取消完成');
    },
  });

  // Mutation for adding todo
  const addMutation = useMutation({
    mutationFn: async ({ text, category = '新增', starMapNodeId }: { text: string; category?: string; starMapNodeId?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please login first');

      let finalNodeId = starMapNodeId;
      let finalCategory = category;

      if (!starMapNodeId) {
        try {
          const classification = await classifyTodoToNode(text);
          finalNodeId = classification.nodeId;
          finalCategory = classification.nodeName;
          toast.success(`任务已分类到: ${classification.nodeName}`);
        } catch (error) {
          console.error('AI classification failed:', error);
          toast.info('使用默认分类');
        }
      }

      const { data, error } = await supabase
        .from('todos')
        .insert([{
          text: text.trim(),
          completed: false,
          category: finalCategory,
          star_map_node_id: finalNodeId,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<TodoItem[]>(todoKeys.list(), (old) => [{
        id: data.id,
        text: data.text,
        completed: data.completed,
        category: data.category,
        starMapNodeId: data.star_map_node_id || undefined,
        userId: data.user_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }, ...(old || [])]);
    },
    onError: () => {
      toast.error('添加待办事项失败');
    },
  });

  // Mutation for deleting todo
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.list() });
      const previousTodos = queryClient.getQueryData<TodoItem[]>(todoKeys.list());
      queryClient.setQueryData<TodoItem[]>(todoKeys.list(), (old) =>
        old?.filter(t => t.id !== id)
      );
      return { previousTodos };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(todoKeys.list(), context?.previousTodos);
      toast.error('删除待办事项失败');
    },
    onSuccess: () => {
      toast.success('待办事项已删除');
    },
  });

  // Helper functions that maintain the same API
  const toggleTodo = useCallback((id: string) => {
    toggleMutation.mutate(id);
  }, [toggleMutation]);

  const addTodo = useCallback(async (text: string, category: string = '新增', starMapNodeId?: string) => {
    try {
      const result = await addMutation.mutateAsync({ text, category, starMapNodeId });
      return {
        id: result.id,
        text: result.text,
        completed: result.completed,
        category: result.category,
        starMapNodeId: result.star_map_node_id || undefined,
        userId: result.user_id,
        createdAt: new Date(result.created_at),
        updatedAt: new Date(result.updated_at)
      } as TodoItem;
    } catch {
      return null;
    }
  }, [addMutation]);

  const deleteTodo = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  // Get node completion stats
  const getNodeCompletionStats = useCallback((nodeId: string) => {
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
  }, [todos]);

  // Get category completion stats
  const getCategoryCompletionStats = useCallback((category: string) => {
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
  }, [todos]);

  return {
    todos,
    loading,
    toggleTodo,
    addTodo,
    deleteTodo,
    getNodeCompletionStats,
    getCategoryCompletionStats,
    refreshTodos: refetch
  };
};
