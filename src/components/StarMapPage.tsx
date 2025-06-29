import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

interface SkillNode {
  id: string;
  name: string;
  description: string;
  category: 'psychology' | 'health' | 'skill';
  position: { x: number; y: number };
  status: 'locked' | 'available' | 'active' | 'mastered';
  connections: string[];
  requirements?: string[];
}

interface StarMapPageProps {
  user: { username: string };
  selectedAvatar: number;
  onBack: () => void;
  onGoToPhysicalTest?: () => void;
  onGoToTalentTest?: () => void;
}

const StarMapPage: React.FC<StarMapPageProps> = ({ 
  user, 
  selectedAvatar, 
  onBack, 
  onGoToPhysicalTest, 
  onGoToTalentTest 
}) => {
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 重新设计的技能节点数据 - 上面1个分支，下面2个分支
  const skillNodes: SkillNode[] = [
    // 中心节点
    {
      id: 'center',
      name: user.username,
      description: '你的成长中心',
      category: 'psychology',
      position: { x: 500, y: 400 },
      status: 'active',
      connections: ['psychology-root', 'health-root', 'skill-root']
    },

    // 心理优势分支 - 上方
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
      status: 'mastered',
      connections: ['psychology-3'],
      requirements: ['psychology-root']
    },
    {
      id: 'psychology-2',
      name: '思维模式',
      description: '培养积极思维和成长心态',
      category: 'psychology',
      position: { x: 650, y: 100 },
      status: 'active',
      connections: ['psychology-4'],
      requirements: ['psychology-root']
    },
    {
      id: 'psychology-3',
      name: '自信建立',
      description: '增强自信心和自我价值感',
      category: 'psychology',
      position: { x: 280, y: 50 },
      status: 'available',
      connections: [],
      requirements: ['psychology-1']
    },
    {
      id: 'psychology-4',
      name: '压力管理',
      description: '有效应对和管理压力',
      category: 'psychology',
      position: { x: 720, y: 50 },
      status: 'available',
      connections: [],
      requirements: ['psychology-2']
    },

    // 身体健康分支 - 左下方
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
      status: 'active',
      connections: ['health-4'],
      requirements: ['health-root']
    },
    {
      id: 'health-2',
      name: '饮食管理',
      description: '建立健康的饮食习惯',
      category: 'health',
      position: { x: 250, y: 750 },
      status: 'mastered',
      connections: ['health-4'],
      requirements: ['health-root']
    },
    {
      id: 'health-3',
      name: '睡眠优化',
      description: '优化睡眠质量和作息规律',
      category: 'health',
      position: { x: 400, y: 700 },
      status: 'available',
      connections: ['health-5'],
      requirements: ['health-root']
    },
    {
      id: 'health-4',
      name: '体重管理',
      description: '科学的体重控制方法',
      category: 'health',
      position: { x: 150, y: 800 },
      status: 'available',
      connections: [],
      requirements: ['health-1', 'health-2']
    },
    {
      id: 'health-5',
      name: '体能提升',
      description: '全面提升身体素质',
      category: 'health',
      position: { x: 350, y: 800 },
      status: 'locked',
      connections: [],
      requirements: ['health-3']
    },

    // 技能发展分支 - 右下方
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
      status: 'active',
      connections: ['skill-4'],
      requirements: ['skill-root']
    },
    {
      id: 'skill-2',
      name: '沟通能力',
      description: '提升人际沟通技能',
      category: 'skill',
      position: { x: 750, y: 750 },
      status: 'available',
      connections: ['skill-4'],
      requirements: ['skill-root']
    },
    {
      id: 'skill-3',
      name: '职业规划',
      description: '制定清晰的职业发展路径',
      category: 'skill',
      position: { x: 900, y: 700 },
      status: 'available',
      connections: ['skill-5'],
      requirements: ['skill-root']
    },
    {
      id: 'skill-4',
      name: '简历优化',
      description: '制作吸引人的简历',
      category: 'skill',
      position: { x: 650, y: 800 },
      status: 'available',
      connections: [],
      requirements: ['skill-1', 'skill-2']
    },
    {
      id: 'skill-5',
      name: '职场礼仪',
      description: '掌握职场基本礼仪',
      category: 'skill',
      position: { x: 850, y: 800 },
      status: 'locked',
      connections: [],
      requirements: ['skill-3']
    }
  ];

  // 鼠标拖动处理
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  }, [panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newOffset = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };
    setPanOffset(newOffset);
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getNodeGradient = (node: SkillNode) => {
    const baseGradients = {
      psychology: 'from-purple-400 via-pink-400 to-purple-500',
      health: 'from-green-400 via-emerald-400 to-green-500',
      skill: 'from-blue-400 via-cyan-400 to-blue-500'
    };
    
    const statusOpacity = {
      locked: 'opacity-30',
      available: 'opacity-60',
      active: 'opacity-90',
      mastered: 'opacity-100'
    };

    return `bg-gradient-to-br ${baseGradients[node.category]} ${statusOpacity[node.status]}`;
  };

  const getNodeSize = (node: SkillNode) => {
    if (node.id === 'center') return 'w-16 h-16';
    if (node.id.includes('root')) return 'w-12 h-12';
    return 'w-10 h-10';
  };

  const getConnectionColor = (fromNode: SkillNode, toNode: SkillNode) => {
    if (fromNode.status === 'locked' || toNode.status === 'locked') {
      return '#64748b'; // gray-500
    }
    
    // 根据节点类别返回渐变色
    const colors = {
      psychology: '#a855f7', // purple-500
      health: '#10b981', // emerald-500
      skill: '#3b82f6' // blue-500
    };
    
    return colors[fromNode.category] || '#64748b';
  };

  const renderConnections = (): JSX.Element[] => {
    const connections: JSX.Element[] = [];
    
    skillNodes.forEach((node) => {
      node.connections.forEach((connectionId) => {
        const targetNode = skillNodes.find(n => n.id === connectionId);
        if (targetNode) {
          const getNodeCenter = (n: SkillNode) => {
            const size = n.id === 'center' ? 32 : n.id.includes('root') ? 24 : 20;
            return { x: n.position.x + size, y: n.position.y + size };
          };
          
          const start = getNodeCenter(node);
          const end = getNodeCenter(targetNode);
          const strokeColor = getConnectionColor(node, targetNode);
          
          connections.push(
            <defs key={`defs-${node.id}-${connectionId}`}>
              <linearGradient 
                id={`gradient-${node.id}-${connectionId}`} 
                x1="0%" y1="0%" x2="100%" y2="100%"
              >
                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
                <stop offset="100%" stopColor={strokeColor} stopOpacity="0.4" />
              </linearGradient>
            </defs>
          );
          
          connections.push(
            <line
              key={`${node.id}-${connectionId}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={`url(#gradient-${node.id}-${connectionId})`}
              strokeWidth="3"
              strokeDasharray={node.status === 'locked' ? "6,3" : "none"}
              opacity={node.status === 'locked' ? 0.3 : 0.8}
            />
          );
        }
      });
    });
    
    return connections;
  };

  const renderNodes = (): JSX.Element[] => {
    return skillNodes.map((node) => (
      <div key={node.id}>
        <div
          className={`absolute ${getNodeSize(node)} ${getNodeGradient(node)} rounded-full flex items-center justify-center border-2 border-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl ${
            selectedNode === node.id ? 'ring-4 ring-white scale-110 shadow-2xl' : ''
          }`}
          style={{
            left: node.position.x,
            top: node.position.y,
            boxShadow: node.status === 'mastered' ? '0 0 20px rgba(255,255,255,0.6)' : undefined
          }}
          onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
        />
        
        <div
          className={`absolute text-white text-xs text-center font-medium bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg transition-all duration-300 ${
            selectedNode === node.id ? 'bg-black/90 scale-105' : ''
          }`}
          style={{
            left: node.position.x - 15,
            top: node.position.y + (node.id === 'center' ? 70 : node.id.includes('root') ? 55 : 45),
            width: node.id === 'center' ? 90 : node.id.includes('root') ? 80 : 70,
          }}
        >
          {node.name}
        </div>
      </div>
    ));
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.3));
  };

  const resetView = () => {
    setZoomLevel(0.8);
    setPanOffset({ x: -100, y: -50 });
  };

  const selectedNodeData = selectedNode ? skillNodes.find(n => n.id === selectedNode) : null;

  return (
    <div className="mobile-container min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* 星空背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars absolute inset-0"></div>
        <div className="stars2 absolute inset-0"></div>
        <div className="stars3 absolute inset-0"></div>
      </div>

      {/* 顶部导航 */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white p-0 hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <h1 className="text-white font-bold text-lg">星图</h1>
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-white/20 text-white border-white/30">
              lv1
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="text-white border-white/30 hover:bg-white/10"
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 星图容器 */}
      <div 
        ref={containerRef}
        className="relative h-96 overflow-hidden mb-4 cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center',
            width: '1200px',
            height: '900px'
          }}
        >
          {renderConnections()}
        </svg>
        
        <div
          className="relative w-full h-full pointer-events-none"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center',
            width: '1200px',
            height: '900px'
          }}
        >
          <div className="pointer-events-auto">
            {renderNodes()}
          </div>
        </div>
      </div>

      {/* 能力评估 */}
      <div className="relative z-10 px-4 mb-4">
        <div className="bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">能力评估</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <div>
                  <div className="text-white font-medium">体能测试</div>
                  <div className="text-white/70 text-sm">评估身体素质</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onGoToPhysicalTest}
                className="text-white border-white/30 hover:bg-white/10"
              >
                开始测试
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <div>
                  <div className="text-white font-medium">优势天赋测试</div>
                  <div className="text-white/70 text-sm">发现个人天赋优势</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onGoToTalentTest}
                className="text-white border-white/30 hover:bg-white/10"
              >
                开始测试
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 节点详情面板 */}
      {selectedNodeData && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-lg border border-white/20 shadow-2xl p-4 rounded-lg animate-fade-in z-20">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 ${getNodeGradient(selectedNodeData)} rounded-full border-2 border-white shadow-lg`}>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-white font-bold text-lg">{selectedNodeData.name}</h3>
                <span className={`px-3 py-1 text-xs rounded-full font-medium border ${
                  selectedNodeData.status === 'mastered' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300' :
                  selectedNodeData.status === 'active' ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white border-blue-300' :
                  selectedNodeData.status === 'available' ? 'bg-white/20 text-white border-white/30' :
                  'bg-gray-500/20 text-gray-300 border-gray-400/30'
                }`}>
                  {selectedNodeData.status === 'mastered' ? '已掌握' :
                   selectedNodeData.status === 'active' ? '进行中' :
                   selectedNodeData.status === 'available' ? '可开始' : '未解锁'}
                </span>
              </div>
              <p className="text-white/80 text-sm mb-3">{selectedNodeData.description}</p>
              {selectedNodeData.requirements && selectedNodeData.requirements.length > 0 && (
                <div className="text-xs text-white/60 bg-white/10 p-2 rounded-lg border border-white/20">
                  前置条件: {selectedNodeData.requirements.map(req => 
                    skillNodes.find(n => n.id === req)?.name || req
                  ).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StarMapPage;
