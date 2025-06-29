
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
    connections: []
  },

  // 心理优势分支
  {
    id: 'psychology-root',
    name: '心理优势',
    description: '心理优势能力发展',
    category: 'psychology',
    position: { x: 500, y: 150 },
    status: 'active',
    connections: ['psychology-emotion', 'psychology-thinking', 'psychology-confidence', 'psychology-stress']
  },
  {
    id: 'psychology-emotion',
    name: '情绪管理',
    description: '提升情绪识别和调节能力',
    category: 'psychology',
    position: { x: 350, y: 80 },
    status: 'available',
    connections: [],
    requirements: ['psychology-root']
  },
  {
    id: 'psychology-thinking',
    name: '思维模式',
    description: '培养积极思维和成长心态',
    category: 'psychology',
    position: { x: 650, y: 80 },
    status: 'available',
    connections: [],
    requirements: ['psychology-root']
  },
  {
    id: 'psychology-confidence',
    name: '自信建立',
    description: '增强自信心和自我价值感',
    category: 'psychology',
    position: { x: 400, y: 50 },
    status: 'available',
    connections: [],
    requirements: ['psychology-root']
  },
  {
    id: 'psychology-stress',
    name: '压力管理',
    description: '有效应对和管理压力',
    category: 'psychology',
    position: { x: 600, y: 50 },
    status: 'available',
    connections: [],
    requirements: ['psychology-root']
  },

  // 身体健康分支
  {
    id: 'health-root',
    name: '身体健康',
    description: '全面的身体健康管理',
    category: 'health',
    position: { x: 200, y: 550 },
    status: 'active',
    connections: ['health-exercise', 'health-diet', 'health-sleep', 'health-weight', 'health-fitness']
  },
  {
    id: 'health-exercise',
    name: '运动锻炼',
    description: '制定并执行运动计划',
    category: 'health',
    position: { x: 80, y: 650 },
    status: 'available',
    connections: [],
    requirements: ['health-root']
  },
  {
    id: 'health-diet',
    name: '饮食管理',
    description: '建立健康的饮食习惯',
    category: 'health',
    position: { x: 180, y: 680 },
    status: 'available',
    connections: [],
    requirements: ['health-root']
  },
  {
    id: 'health-sleep',
    name: '睡眠优化',
    description: '优化睡眠质量和作息规律',
    category: 'health',
    position: { x: 280, y: 650 },
    status: 'available',
    connections: [],
    requirements: ['health-root']
  },
  {
    id: 'health-weight',
    name: '体重管理',
    description: '科学的体重控制方法',
    category: 'health',
    position: { x: 120, y: 750 },
    status: 'available',
    connections: [],
    requirements: ['health-root']
  },
  {
    id: 'health-fitness',
    name: '体能提升',
    description: '全面提升身体素质',
    category: 'health',
    position: { x: 240, y: 780 },
    status: 'locked',
    connections: [],
    requirements: ['health-root']
  },

  // 技能发展分支
  {
    id: 'skill-root',
    name: '技能发展',
    description: '职场与生活技能全面提升',
    category: 'skill',
    position: { x: 800, y: 550 },
    status: 'active',
    connections: ['skill-interview', 'skill-communication', 'skill-career', 'skill-resume', 'skill-etiquette']
  },
  {
    id: 'skill-interview',
    name: '面试技巧',
    description: '掌握面试表达和技巧',
    category: 'skill',
    position: { x: 680, y: 650 },
    status: 'available',
    connections: [],
    requirements: ['skill-root']
  },
  {
    id: 'skill-communication',
    name: '沟通能力',
    description: '提升人际沟通技能',
    category: 'skill',
    position: { x: 780, y: 680 },
    status: 'available',
    connections: [],
    requirements: ['skill-root']
  },
  {
    id: 'skill-career',
    name: '职业规划',
    description: '制定清晰的职业发展路径',
    category: 'skill',
    position: { x: 880, y: 650 },
    status: 'available',
    connections: [],
    requirements: ['skill-root']
  },
  {
    id: 'skill-resume',
    name: '简历优化',
    description: '制作吸引人的简历',
    category: 'skill',
    position: { x: 720, y: 750 },
    status: 'available',
    connections: [],
    requirements: ['skill-root']
  },
  {
    id: 'skill-etiquette',
    name: '职场礼仪',
    description: '掌握职场基本礼仪',
    category: 'skill',
    position: { x: 840, y: 780 },
    status: 'locked',
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
