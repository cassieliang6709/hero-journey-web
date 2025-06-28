import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import TaskDrawer from './TaskDrawer';

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

  // 技能节点数据
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

    // 心理优势分支
    {
      id: 'psychology-root',
      name: '心理优势',
      description: '基于心理学的优势发展',
      category: 'psychology',
      position: { x: 250, y: 250 },
      status: 'active',
      connections: ['psychology-1', 'psychology-2']
    },
    {
      id: 'psychology-1',
      name: '情绪管理',
      description: '提升情绪识别和调节能力',
      category: 'psychology',
      position: { x: 100, y: 150 },
      status: 'mastered',
      connections: ['psychology-3'],
      requirements: ['psychology-root']
    },
    {
      id: 'psychology-2',
      name: '思维模式',
      description: '培养积极思维和成长心态',
      category: 'psychology',
      position: { x: 200, y: 100 },
      status: 'active',
      connections: ['psychology-3'],
      requirements: ['psychology-root']
    },
    {
      id: 'psychology-3',
      name: '自信建立',
      description: '增强自信心和自我价值感',
      category: 'psychology',
      position: { x: 80, y: 50 },
      status: 'available',
      connections: [],
      requirements: ['psychology-1', 'psychology-2']
    },

    // 身体健康分支
    {
      id: 'health-root',
      name: '身体健康',
      description: '全面的身体健康管理',
      category: 'health',
      position: { x: 500, y: 200 },
      status: 'active',
      connections: ['health-1', 'health-2', 'health-3']
    },
    {
      id: 'health-1',
      name: '运动锻炼',
      description: '制定并执行运动计划',
      category: 'health',
      position: { x: 400, y: 80 },
      status: 'active',
      connections: ['health-4'],
      requirements: ['health-root']
    },
    {
      id: 'health-2',
      name: '饮食管理',
      description: '建立健康的饮食习惯',
      category: 'health',
      position: { x: 550, y: 80 },
      status: 'mastered',
      connections: ['health-4'],
      requirements: ['health-root']
    },
    {
      id: 'health-3',
      name: '睡眠优化',
      description: '优化睡眠质量和作息规律',
      category: 'health',
      position: { x: 650, y: 150 },
      status: 'available',
      connections: ['health-4'],
      requirements: ['health-root']
    },
    {
      id: 'health-4',
      name: '体重管理',
      description: '科学的体重控制方法',
      category: 'health',
      position: { x: 500, y: 30 },
      status: 'available',
      connections: [],
      requirements: ['health-1', 'health-2']
    },

    // 技能发展分支
    {
      id: 'skill-root',
      name: '技能发展',
      description: '职场与生活技能全面提升',
      category: 'skill',
      position: { x: 750, y: 250 },
      status: 'active',
      connections: ['skill-1', 'skill-2', 'skill-3']
    },
    {
      id: 'skill-1',
      name: '面试技巧',
      description: '掌握面试表达和技巧',
      category: 'skill',
      position: { x: 850, y: 150 },
      status: 'active',
      connections: ['skill-4'],
      requirements: ['skill-root']
    },
    {
      id: 'skill-2',
      name: '沟通能力',
      description: '提升人际沟通技能',
      category: 'skill',
      position: { x: 800, y: 120 },
      status: 'available',
      connections: ['skill-4'],
      requirements: ['skill-root']
    },
    {
      id: 'skill-3',
      name: '职业规划',
      description: '制定清晰的职业发展路径',
      category: 'skill',
      position: { x: 900, y: 100 },
      status: 'available',
      connections: ['skill-5'],
      requirements: ['skill-root']
    },
    {
      id: 'skill-4',
      name: '简历优化',
      description: '制作吸引人的简历',
      category: 'skill',
      position: { x: 920, y: 60 },
      status: 'available',
      connections: [],
      requirements: ['skill-1', 'skill-2']
    },
    {
      id: 'skill-5',
      name: '职场礼仪',
      description: '掌握职场基本礼仪',
      category: 'skill',
      position: { x: 850, y: 50 },
      status: 'locked',
      connections: [],
      requirements: ['skill-3']
    }
  ];

  // 扩大星图范围，确保所有节点都可见
  const getUserConcerns = () => {
    const concerns = [
      "好害怕面试好焦虑",
      "最近胖了10斤",
      "心情低落",
      "感觉身体好差，没有精力",
      "最近找不到工作很烦"
    ];
    return concerns[Math.floor(Math.random() * concerns.length)];
  };

  const currentConcern = getUserConcerns();

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

  const getNodeColor = (node: SkillNode) => {
    switch (node.status) {
      case 'locked': return 'bg-gray-200 border-gray-300 text-gray-600';
      case 'available': return 'bg-gray-100 border-gray-400 text-gray-800';
      case 'active': return 'bg-gray-900 border-gray-900 text-white';
      case 'mastered': return 'bg-gray-800 border-gray-800 text-white';
      default: return 'bg-gray-200';
    }
  };

  const getNodeSize = (node: SkillNode) => {
    if (node.id === 'center') return 'w-16 h-16';
    if (node.id.includes('root')) return 'w-12 h-12';
    return 'w-10 h-10';
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
          
          connections.push(
            <line
              key={`${node.id}-${connectionId}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={node.status === 'locked' ? "#d1d5db" : "#374151"}
              strokeWidth="2"
              strokeDasharray={node.status === 'locked' ? "4,2" : "none"}
              opacity={node.status === 'locked' ? 0.4 : 0.7}
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
          className={`absolute ${getNodeSize(node)} ${getNodeColor(node)} rounded-full flex items-center justify-center border-2 cursor-pointer transition-all duration-300 hover:scale-110 ${
            selectedNode === node.id ? 'ring-2 ring-gray-400 scale-110' : ''
          }`}
          style={{
            left: node.position.x,
            top: node.position.y,
          }}
          onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
        />
        
        <div
          className={`absolute text-gray-800 text-xs text-center font-medium bg-white/95 px-2 py-1 rounded shadow-sm transition-all duration-300 ${
            selectedNode === node.id ? 'bg-white scale-105' : ''
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
    <div className="mobile-container min-h-screen bg-white">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-900 p-0 hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <h1 className="text-gray-900 font-bold text-lg">成长星图</h1>
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-700 border-gray-200">
              lv1
            </Badge>
            <p className="text-gray-600 text-sm">针对: {currentConcern}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="text-gray-700 p-2 border-gray-200 hover:bg-gray-50"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
            className="text-xs text-gray-600 min-w-[3rem] text-center px-3 border-gray-200 hover:bg-gray-50"
          >
            全景
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="text-gray-700 p-2 border-gray-200 hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 星图容器 */}
      <div 
        ref={containerRef}
        className="relative h-96 overflow-hidden bg-gray-50 mb-4 cursor-move"
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
            height: '800px'
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
            height: '800px'
          }}
        >
          <div className="pointer-events-auto">
            {renderNodes()}
          </div>
        </div>
      </div>

      {/* 抽屉式卡片 */}
      <div className="px-4 mb-6">
        <TaskDrawer 
          onGoToPhysicalTest={onGoToPhysicalTest}
          onGoToTalentTest={onGoToTalentTest}
        />
      </div>

      {/* 节点详情面板 */}
      {selectedNodeData && (
        <div className="absolute bottom-4 left-4 right-4 bg-white border border-gray-200 shadow-lg p-4 rounded-lg animate-fade-in">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 ${getNodeColor(selectedNodeData)} rounded-full border-2`}>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-gray-900 font-bold text-lg">{selectedNodeData.name}</h3>
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  selectedNodeData.status === 'mastered' ? 'bg-gray-100 text-gray-800' :
                  selectedNodeData.status === 'active' ? 'bg-gray-900 text-white' :
                  selectedNodeData.status === 'available' ? 'bg-gray-100 text-gray-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {selectedNodeData.status === 'mastered' ? '已掌握' :
                   selectedNodeData.status === 'active' ? '进行中' :
                   selectedNodeData.status === 'available' ? '可开始' : '未解锁'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{selectedNodeData.description}</p>
              {selectedNodeData.requirements && selectedNodeData.requirements.length > 0 && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
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
