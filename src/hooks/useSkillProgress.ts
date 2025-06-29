
import { useState, useEffect } from 'react';
import { getSkillNodeByTodo } from '@/data/skillMapping';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  category: string;
}

interface SkillProgress {
  [skillNodeId: string]: {
    completed: boolean;
    unlockedAt?: string;
    relatedTodos: number[];
  };
}

export const useSkillProgress = (userId: string) => {
  const [skillProgress, setSkillProgress] = useState<SkillProgress>({});

  // 从localStorage加载技能进度
  useEffect(() => {
    const savedProgress = localStorage.getItem(`skillProgress_${userId}`);
    if (savedProgress) {
      setSkillProgress(JSON.parse(savedProgress));
    }
  }, [userId]);

  // 保存技能进度到localStorage
  const saveProgress = (progress: SkillProgress) => {
    localStorage.setItem(`skillProgress_${userId}`, JSON.stringify(progress));
    setSkillProgress(progress);
  };

  // 当待办事项完成时更新技能进度
  const updateSkillProgress = (todo: TodoItem) => {
    const skillNodeId = getSkillNodeByTodo(todo.text, todo.category);
    if (!skillNodeId) return;

    setSkillProgress(prev => {
      const newProgress = { ...prev };
      
      if (!newProgress[skillNodeId]) {
        newProgress[skillNodeId] = {
          completed: false,
          relatedTodos: []
        };
      }

      if (todo.completed) {
        // 添加到相关任务列表
        if (!newProgress[skillNodeId].relatedTodos.includes(todo.id)) {
          newProgress[skillNodeId].relatedTodos.push(todo.id);
        }
        
        // 如果这是第一个完成的相关任务，解锁技能
        if (!newProgress[skillNodeId].completed) {
          newProgress[skillNodeId].completed = true;
          newProgress[skillNodeId].unlockedAt = new Date().toISOString();
        }
      } else {
        // 从相关任务列表中移除
        newProgress[skillNodeId].relatedTodos = newProgress[skillNodeId].relatedTodos.filter(
          id => id !== todo.id
        );
        
        // 如果没有相关任务了，锁定技能
        if (newProgress[skillNodeId].relatedTodos.length === 0) {
          newProgress[skillNodeId].completed = false;
          delete newProgress[skillNodeId].unlockedAt;
        }
      }

      saveProgress(newProgress);
      return newProgress;
    });
  };

  // 检查技能是否已解锁
  const isSkillUnlocked = (skillNodeId: string): boolean => {
    return skillProgress[skillNodeId]?.completed || false;
  };

  // 获取技能相关的已完成任务数量
  const getSkillCompletedTasks = (skillNodeId: string): number => {
    return skillProgress[skillNodeId]?.relatedTodos.length || 0;
  };

  return {
    skillProgress,
    updateSkillProgress,
    isSkillUnlocked,
    getSkillCompletedTasks
  };
};
