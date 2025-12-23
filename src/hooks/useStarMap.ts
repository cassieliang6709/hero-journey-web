import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  category: 'psychology' | 'health' | 'skill';
  position: { x: number; y: number };
  status: 'locked' | 'available' | 'active' | 'mastered';
  connections: string[];
  requirements?: string[];
}

interface DbNode {
  id: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  category: string;
  position_x: number;
  position_y: number;
  connections: string[];
  requirements: string[] | null;
  display_order: number;
  is_active: boolean;
}

interface UserProgress {
  node_id: string;
  status: string;
  progress_score: number;
}

// Query keys
export const starMapKeys = {
  all: ['starMap'] as const,
  nodes: (userId: string) => [...starMapKeys.all, 'nodes', userId] as const,
  progress: (userId: string) => [...starMapKeys.all, 'progress', userId] as const,
};

// Fetch nodes from database
const fetchNodes = async (isEnglish: boolean): Promise<DbNode[]> => {
  const { data, error } = await supabase
    .from('star_map_nodes')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) throw error;
  return data || [];
};

// Fetch user progress
const fetchProgress = async (userId: string): Promise<UserProgress[]> => {
  const { data, error } = await supabase
    .from('star_map_progress')
    .select('node_id, status, progress_score')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
};

export const useStarMap = (userId: string) => {
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const isEnglish = i18n.language === 'en';

  // Query for nodes
  const { data: dbNodes = [], isLoading: nodesLoading } = useQuery({
    queryKey: ['starMapNodes', isEnglish],
    queryFn: () => fetchNodes(isEnglish),
    staleTime: 1000 * 60 * 30, // 30 minutes (node config rarely changes)
    enabled: !!userId,
  });

  // Query for user progress
  const { data: progressData = [], isLoading: progressLoading, refetch } = useQuery({
    queryKey: starMapKeys.progress(userId),
    queryFn: () => fetchProgress(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId,
  });

  // Merge nodes with progress
  const nodes = useMemo<SkillNode[]>(() => {
    const progressMap = new Map<string, UserProgress>();
    progressData.forEach((p) => {
      progressMap.set(p.node_id, p);
    });

    return dbNodes.map((dbNode) => {
      const progress = progressMap.get(dbNode.id);

      let status: SkillNode['status'] = 'locked';
      if (progress) {
        status = progress.status as SkillNode['status'];
      } else {
        const isRootNode = dbNode.id === 'center' || dbNode.id.endsWith('-root');
        status = isRootNode ? 'active' : (dbNode.requirements?.length ? 'locked' : 'available');
      }

      return {
        id: dbNode.id,
        name: isEnglish ? dbNode.name_en : dbNode.name,
        description: isEnglish ? dbNode.description_en : dbNode.description,
        category: dbNode.category as SkillNode['category'],
        position: { x: dbNode.position_x, y: dbNode.position_y },
        status,
        connections: dbNode.connections || [],
        requirements: dbNode.requirements || undefined,
      };
    });
  }, [dbNodes, progressData, isEnglish]);

  // Calculate level
  const level = useMemo(() => {
    const masteredCount = nodes.filter(n => n.status === 'mastered').length;
    return Math.floor(masteredCount / 3) + 1;
  }, [nodes]);

  // Mutation for updating progress
  const updateProgressMutation = useMutation({
    mutationFn: async ({ nodeId, status }: { nodeId: string; status: SkillNode['status'] }) => {
      const node = nodes.find(n => n.id === nodeId);
      const { error } = await supabase
        .from('star_map_progress')
        .upsert({
          user_id: userId,
          node_id: nodeId,
          status,
          category: node?.category || 'skill',
          unlocked_at: status === 'available' ? new Date().toISOString() : undefined,
          mastered_at: status === 'mastered' ? new Date().toISOString() : undefined,
        }, {
          onConflict: 'user_id,node_id'
        });

      if (error) throw error;
      return { nodeId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: starMapKeys.progress(userId) });
    },
  });

  const unlockNode = useCallback(async (nodeId: string) => {
    await updateProgressMutation.mutateAsync({ nodeId, status: 'active' });
  }, [updateProgressMutation]);

  const completeNode = useCallback(async (nodeId: string) => {
    await updateProgressMutation.mutateAsync({ nodeId, status: 'mastered' });

    // Check if new nodes can be unlocked
    const updatedNodes = nodes.map(node =>
      node.id === nodeId ? { ...node, status: 'mastered' as const } : node
    );

    for (const node of updatedNodes) {
      if (node.status === 'locked' && node.requirements) {
        const allRequirementsMet = node.requirements.every(reqId =>
          updatedNodes.find(n => n.id === reqId)?.status === 'mastered'
        );
        if (allRequirementsMet) {
          await updateProgressMutation.mutateAsync({ nodeId: node.id, status: 'available' });
        }
      }
    }
  }, [nodes, updateProgressMutation]);

  const getNodeByKeywords = useCallback((keywords: string[]) => {
    return nodes.find(node =>
      keywords.some(keyword =>
        node.name.includes(keyword) ||
        node.description.includes(keyword)
      )
    );
  }, [nodes]);

  return {
    nodes,
    level,
    isLoading: nodesLoading || progressLoading,
    error: null,
    unlockNode,
    completeNode,
    getNodeByKeywords,
    refetch,
  };
};
