
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Minus, Star, Sparkles } from 'lucide-react';

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

  const getNodeColor = (node: SkillNode) => {
    const baseColors = {
      psychology: 'from-purple-400 to-pink-500',
      health: 'from-green-400 to-emerald-500', 
      skill: 'from-blue-400 to-indigo-500'
    };

    const statusColors = {
      locked: 'from-gray-200 to-gray-300 border-gray-400 text-gray-600',
      available: `bg-gradient-to-br ${baseColors[node.category]} border-white text-white opacity-60`,
      active: `bg-gradient-to-br ${baseColors[node.category]} border-white text-white shadow-lg`,
      mastered: `bg-gradient-to-br ${baseColors[node.category]} border-yellow-300 text-white shadow-xl ring-2 ring-yellow-300/50`
    };

    return statusColors[node.status];
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
          
          const isActive = node.status !== 'locked' && targetNode.status !== 'locked';
          
          connections.push(
            <line
              key={`${node.id}-${connectionId}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={isActive ? "url(#connectionGradient)" : "#d1d5db"}
              strokeWidth={isActive ? "3" : "2"}
              strokeDasharray={node.status === 'locked' ? "4,2" : "none"}
              opacity={node.status === 'locked' ? 0.4 : 0.8}
              className="drop-shadow-sm"
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
            selectedNode === node.id ? 'ring-4 ring-yellow-400/60 scale-110' : ''
          } ${node.status === 'mastered' ? 'animate-pulse-glow' : ''}`}
          style={{
            left: node.position.x,
            top: node.position.y,
          }}
          onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
        >
          {node.status === 'mastered' && (
            <Star className="w-4 h-4 text-yellow-300 fill-current animate-spin" style={{animationDuration: '3s'}} />
          )}
        </div>
        
        <div
          className={`absolute text-gray-800 text-xs text-center font-medium bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg border border-purple-200 transition-all duration-300 ${
            selectedNode === node.id ? 'bg-gradient-to-r from-purple-100 to-pink-100 scale-105 border-purple-300' : ''
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
    <div className="mobile-container min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 border-b border-purple-300">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white p-0 hover:bg-white/20 rounded-full hover:scale-110 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <h1 className="text-white font-bold text-lg drop-shadow-lg">星图</h1>
            <Badge className="text-xs px-2 py-1 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              lv1
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="text-white p-2 hover:bg-white/20 rounded-full hover:scale-110 transition-all"
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 星图容器 */}
      <div 
        ref={containerRef}
        className="relative h-96 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 mb-4 cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 星空背景效果 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{top: '20%', left: '10%'}}></div>
          <div className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{top: '30%', left: '80%', animationDelay: '1s'}}></div>
          <div className="absolute w-1 h-1 bg-pink-300 rounded-full animate-pulse" style={{top: '70%', left: '20%', animationDelay: '2s'}}></div>
          <div className="absolute w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{top: '60%', left: '90%', animationDelay: '0.5s'}}></div>
        </div>

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center',
            width: '1200px',
            height: '900px'
          }}
        >
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
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
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-white to-purple-50 border border-purple-200 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <h3 className="text-gray-900 font-semibold mb-3 flex items-center">
            <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
            能力评估
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <div>
                  <div className="text-gray-900 font-medium">体能测试</div>
                  <div className="text-gray-600 text-sm">评估身体素质</div>
                </div>
              </div>
              <Button
                onClick={onGoToPhysicalTest}
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                开始测试
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <div>
                  <div className="text-gray-900 font-medium">优势天赋测试</div>
                  <div className="text-gray-600 text-sm">发现个人天赋优势</div>
                </div>
              </div>
              <Button
                onClick={onGoToTalentTest}
                className="bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                开始测试
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 节点详情面板 */}
      {selectedNodeData && (
        <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-white to-purple-50 border border-purple-200 shadow-2xl p-4 rounded-xl animate-fade-in backdrop-blur-sm">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 ${getNodeColor(selectedNodeData)} rounded-full border-2 shadow-lg flex items-center justify-center`}>
              {selectedNodeData.status === 'mastered' && (
                <Star className="w-6 h-6 text-yellow-300 fill-current" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-gray-900 font-bold text-lg">{selectedNodeData.name}</h3>
                <span className={`px-3 py-1 text-xs rounded-full font-medium shadow-sm ${
                  selectedNodeData.status === 'mastered' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200' :
                  selectedNodeData.status === 'active' ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200' :
                  selectedNodeData.status === 'available' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200' :
                  'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {selectedNodeData.status === 'mastered' ? '🌟 已掌握' :
                   selectedNodeData.status === 'active' ? '🔄 进行中' :
                   selectedNodeData.status === 'available' ? '✨ 可开始' : '🔒 未解锁'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{selectedNodeData.description}</p>
              {selectedNodeData.requirements && selectedNodeData.requirements.length > 0 && (
                <div className="text-xs text-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 p-2 rounded-lg border border-purple-200">
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
