import { useState, useCallback, useEffect } from 'react';
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

export const useStarMap = (userId: string) => {
  const { i18n } = useTranslation();
  const [nodes, setNodes] = useState<SkillNode[]>([]);
  const [level, setLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isEnglish = i18n.language === 'en';

  // Fetch nodes from database and merge with user progress
  const loadNodes = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch node configurations
      const { data: dbNodes, error: nodesError } = await supabase
        .from('star_map_nodes')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (nodesError) throw nodesError;

      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('star_map_progress')
        .select('node_id, status, progress_score')
        .eq('user_id', userId);

      if (progressError) throw progressError;

      // Create progress map
      const progressMap = new Map<string, UserProgress>();
      (progressData || []).forEach((p) => {
        progressMap.set(p.node_id, p);
      });

      // Merge nodes with progress
      const mergedNodes: SkillNode[] = (dbNodes as DbNode[] || []).map((dbNode) => {
        const progress = progressMap.get(dbNode.id);
        
        // Determine status
        let status: SkillNode['status'] = 'locked';
        if (progress) {
          status = progress.status as SkillNode['status'];
        } else {
          // Default status based on node type
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

      setNodes(mergedNodes);

      // Calculate level based on mastered nodes
      const masteredCount = mergedNodes.filter(n => n.status === 'mastered').length;
      setLevel(Math.floor(masteredCount / 3) + 1);
    } catch (err) {
      console.error('Failed to load star map nodes:', err);
      setError('Failed to load star map');
    } finally {
      setIsLoading(false);
    }
  }, [userId, isEnglish]);

  // Load nodes on mount and when userId changes
  useEffect(() => {
    loadNodes();
  }, [loadNodes]);

  const updateNodeProgress = useCallback(async (nodeId: string, status: SkillNode['status']) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('star_map_progress')
        .upsert({
          user_id: userId,
          node_id: nodeId,
          status,
          category: nodes.find(n => n.id === nodeId)?.category || 'skill',
          unlocked_at: status === 'available' ? new Date().toISOString() : undefined,
          mastered_at: status === 'mastered' ? new Date().toISOString() : undefined,
        }, {
          onConflict: 'user_id,node_id'
        });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to update node progress:', err);
    }
  }, [userId, nodes]);

  const unlockNode = useCallback(async (nodeId: string) => {
    await updateNodeProgress(nodeId, 'active');
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, status: 'active' as const } : node
    ));
  }, [updateNodeProgress]);

  const completeNode = useCallback(async (nodeId: string) => {
    await updateNodeProgress(nodeId, 'mastered');
    
    setNodes(prev => {
      const updatedNodes = prev.map(node => 
        node.id === nodeId ? { ...node, status: 'mastered' as const } : node
      );
      
      // Check if new nodes can be unlocked
      updatedNodes.forEach(async (node) => {
        if (node.status === 'locked' && node.requirements) {
          const allRequirementsMet = node.requirements.every(reqId => 
            updatedNodes.find(n => n.id === reqId)?.status === 'mastered'
          );
          if (allRequirementsMet) {
            node.status = 'available';
            await updateNodeProgress(node.id, 'available');
          }
        }
      });
      
      return updatedNodes;
    });

    // Update level
    const masteredCount = nodes.filter(n => n.status === 'mastered').length + 1;
    const newLevel = Math.floor(masteredCount / 3) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
    }
  }, [nodes, level, updateNodeProgress]);

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
    isLoading,
    error,
    unlockNode,
    completeNode,
    getNodeByKeywords,
    refetch: loadNodes,
  };
};
