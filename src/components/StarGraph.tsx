
import React, { useCallback } from 'react';
import { Graph } from 'react-d3-graph';

interface StarGraphProps {
  user: { username: string };
  selectedNode: string | null;
  onNodeClick: (nodeId: string) => void;
}

const StarGraph: React.FC<StarGraphProps> = ({ user, selectedNode, onNodeClick }) => {
  const data = {
    nodes: [
      // 中心节点
      { id: 'center', name: user.username, symbolType: 'star', size: 800, color: '#3b82f6' },
      
      // 心理优势分支
      { id: 'psychology-root', name: '心理优势', symbolType: 'circle', size: 600, color: '#8b5cf6' },
      { id: 'psychology-1', name: '情绪管理', symbolType: 'circle', size: 400, color: '#10b981' },
      { id: 'psychology-2', name: '思维模式', symbolType: 'circle', size: 400, color: '#3b82f6' },
      { id: 'psychology-3', name: '自信建立', symbolType: 'circle', size: 400, color: '#f59e0b' },
      
      // 身体健康分支
      { id: 'health-root', name: '身体健康', symbolType: 'circle', size: 600, color: '#ef4444' },
      { id: 'health-1', name: '运动锻炼', symbolType: 'circle', size: 400, color: '#3b82f6' },
      { id: 'health-2', name: '饮食管理', symbolType: 'circle', size: 400, color: '#10b981' },
      { id: 'health-3', name: '睡眠优化', symbolType: 'circle', size: 400, color: '#f59e0b' },
      { id: 'health-4', name: '体重管理', symbolType: 'circle', size: 400, color: '#f59e0b' },
      
      // 技能发展分支
      { id: 'skill-root', name: '技能发展', symbolType: 'circle', size: 600, color: '#06b6d4' },
      { id: 'skill-1', name: '面试技巧', symbolType: 'circle', size: 400, color: '#3b82f6' },
      { id: 'skill-2', name: '沟通能力', symbolType: 'circle', size: 400, color: '#f59e0b' },
      { id: 'skill-3', name: '职业规划', symbolType: 'circle', size: 400, color: '#f59e0b' },
      { id: 'skill-4', name: '简历优化', symbolType: 'circle', size: 400, color: '#f59e0b' },
      { id: 'skill-5', name: '职场礼仪', symbolType: 'circle', size: 400, color: '#6b7280' }
    ],
    links: [
      // 中心连接
      { source: 'center', target: 'psychology-root' },
      { source: 'center', target: 'health-root' },
      { source: 'center', target: 'skill-root' },
      
      // 心理分支连接
      { source: 'psychology-root', target: 'psychology-1' },
      { source: 'psychology-root', target: 'psychology-2' },
      { source: 'psychology-1', target: 'psychology-3' },
      { source: 'psychology-2', target: 'psychology-3' },
      
      // 健康分支连接
      { source: 'health-root', target: 'health-1' },
      { source: 'health-root', target: 'health-2' },
      { source: 'health-root', target: 'health-3' },
      { source: 'health-1', target: 'health-4' },
      { source: 'health-2', target: 'health-4' },
      
      // 技能分支连接
      { source: 'skill-root', target: 'skill-1' },
      { source: 'skill-root', target: 'skill-2' },
      { source: 'skill-root', target: 'skill-3' },
      { source: 'skill-1', target: 'skill-4' },
      { source: 'skill-2', target: 'skill-4' },
      { source: 'skill-3', target: 'skill-5' }
    ]
  };

  const config = {
    nodeHighlightBehavior: true,
    linkHighlightBehavior: true,
    height: 400,
    width: window.innerWidth - 32,
    d3: {
      alphaTarget: 0.05,
      gravity: -300,
      linkLength: 150,
      linkStrength: 2
    },
    node: {
      color: '#3b82f6',
      size: 400,
      fontSize: 12,
      fontColor: '#1f2937',
      labelProperty: 'name',
      renderLabel: true
    },
    link: {
      color: '#94a3b8',
      strokeWidth: 2,
      highlightColor: '#3b82f6'
    }
  };

  const onClickNode = useCallback((nodeId: string) => {
    onNodeClick(nodeId);
  }, [onNodeClick]);

  return (
    <div className="w-full h-96 bg-gradient-to-br from-indigo-100/30 via-purple-100/30 to-pink-100/30 rounded-lg overflow-hidden">
      <Graph
        id="star-graph"
        data={data}
        config={config}
        onClickNode={onClickNode}
      />
    </div>
  );
};

export default StarGraph;
