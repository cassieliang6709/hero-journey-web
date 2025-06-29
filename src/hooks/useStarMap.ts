
import { useState, useCallback } from 'react';

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

const initialNodes: SkillNode[] = [
  // 中心节点
  {
    id: 'center',
    name: '成长中心',
    description: '你的成长中心',
    category: 'psychology',
    position: { x: 500, y: 400 },
    status: 'active',
    connections: ['psychology-root', 'health-root', 'skill-root']
  },
  // 心理优势分支
  {
    id: 'psychology-root',
    name: '心理优势',
    description: '基于心理学的优势发展',
    category: 'psychology',
    position: { x: 500, y: 200 },
    status: 'active',
    connections: ['psychology-1', 'psychology-2']
  },
  {
    id: 'psychology-1',
    name: '情绪管理',
    description: '提升情绪识别和调节能力',
    category: 'psychology',
    position: { x: 350, y: 100 },
    status: 'available',
    connections: ['psychology-3'],
    requirements: ['psychology-root']
  },
  {
    id: 'psychology-2',
    name: '思维模式',
    description: '培养积极思维和成长心态',
    category: 'psychology',
    position: { x: 650, y: 100 },
    status: 'available',
    connections: ['psychology-4'],
    requirements: ['psychology-root']
  },
  // 身体健康分支
  {
    id: 'health-root',
    name: '身体健康',
    description: '全面的身体健康管理',
    category: 'health',
    position: { x: 250, y: 600 },
    status: 'active',
    connections: ['health-1', 'health-2', 'health-3']
  },
  {
    id: 'health-1',
    name: '运动锻炼',
    description: '制定并执行运动计划',
    category: 'health',
    position: { x: 100, y: 700 },
    status: 'available',
    connections: ['health-4'],
    requirements: ['health-root']
  },
  {
    id: 'health-2',
    name: '饮食管理',
    description: '建立健康的饮食习惯',
    category: 'health',
    position: { x: 250, y: 750 },
    status: 'available',
    connections: ['health-4'],
    requirements: ['health-root']
  },
  // 技能发展分支
  {
    id: 'skill-root',
    name: '技能发展',
    description: '职场与生活技能全面提升',
    category: 'skill',
    position: { x: 750, y: 600 },
    status: 'active',
    connections: ['skill-1', 'skill-2', 'skill-3']
  },
  {
    id: 'skill-1',
    name: '面试技巧',
    description: '掌握面试表达和技巧',
    category: 'skill',
    position: { x: 600, y: 700 },
    status: 'available',
    connections: [],
    requirements: ['skill-root']
  },
  {
    id: 'skill-2',
    name: '沟通能力',
    description: '提升人际沟通技能',
    category: 'skill',
    position: { x: 750, y: 750 },
    status: 'available',
    connections: [],
    requirements: ['skill-root']
  }
];

export const useStarMap = (userId: string) => {
  const [nodes, setNodes] = useState<SkillNode[]>(initialNodes);
  const [level, setLevel] = useState(1);

  const unlockNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, status: 'active' as const } : node
    ));
  }, []);

  const completeNode = useCallback((nodeId: string) => {
    setNodes(prev => {
      const updatedNodes = prev.map(node => 
        node.id === nodeId ? { ...node, status: 'mastered' as const } : node
      );
      
      // 检查是否有新节点可以解锁
      updatedNodes.forEach(node => {
        if (node.status === 'locked' && node.requirements) {
          const allRequirementsMet = node.requirements.every(reqId => 
            updatedNodes.find(n => n.id === reqId)?.status === 'mastered'
          );
          if (allRequirementsMet) {
            node.status = 'available';
          }
        }
      });
      
      return updatedNodes;
    });

    // 增加经验值，可能升级
    const masteredCount = nodes.filter(n => n.status === 'mastered').length;
    const newLevel = Math.floor(masteredCount / 3) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
    }
  }, [nodes, level]);

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
    unlockNode,
    completeNode,
    getNodeByKeywords
  };
};
