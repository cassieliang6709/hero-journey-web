
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, Minus, Home, Settings } from 'lucide-react';

interface SkillNode {
  id: string;
  name: string;
  description: string;
  category: 'psychology' | 'health' | 'skill';
  position: { x: number; y: number };
  status: 'locked' | 'available' | 'active' | 'mastered';
  connections: string[];
  requirements?: string[];
  icon?: string;
}

interface StarMapPageProps {
  user: { username: string };
  selectedAvatar: number;
  onBack: () => void;
}

const StarMapPage: React.FC<StarMapPageProps> = ({ user, selectedAvatar, onBack }) => {
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // 技能树节点数据
  const skillNodes: SkillNode[] = [
    // 中心节点 - 用户
    {
      id: 'center',
      name: user.username,
      description: '你的成长中心',
      category: 'psychology',
      position: { x: 400, y: 300 },
      status: 'active',
      connections: ['psychology-root', 'health-root', 'skill-root'],
      icon: '🌟'
    },

    // 心理优势分支
    {
      id: 'psychology-root',
      name: '心理优势',
      description: '基于Gallup测评的心理优势发展',
      category: 'psychology',
      position: { x: 200, y: 150 },
      status: 'active',
      connections: ['psychology-1', 'psychology-2'],
      icon: '💡'
    },
    {
      id: 'psychology-1',
      name: '思维模式',
      description: '培养积极思维和成长心态',
      category: 'psychology',
      position: { x: 100, y: 100 },
      status: 'available',
      connections: ['psychology-3'],
      requirements: ['psychology-root']
    },
    {
      id: 'psychology-2',
      name: '情绪管理',
      description: '提升情绪识别和调节能力',
      category: 'psychology',
      position: { x: 150, y: 50 },
      status: 'mastered',
      connections: ['psychology-3'],
      requirements: ['psychology-root']
    },
    {
      id: 'psychology-3',
      name: '人际关系',
      description: '建立健康的人际交往模式',
      category: 'psychology',
      position: { x: 80, y: 20 },
      status: 'locked',
      connections: [],
      requirements: ['psychology-1', 'psychology-2']
    },

    // 身体健康分支
    {
      id: 'health-root',
      name: '身体健康',
      description: '全面的身体健康管理',
      category: 'health',
      position: { x: 400, y: 150 },
      status: 'active',
      connections: ['health-1', 'health-2', 'health-3'],
      icon: '🏃'
    },
    {
      id: 'health-1',
      name: '睡眠管理',
      description: '优化睡眠质量和作息规律',
      category: 'health',
      position: { x: 350, y: 80 },
      status: 'mastered',
      connections: ['health-4'],
      requirements: ['health-root']
    },
    {
      id: 'health-2',
      name: '饮食营养',
      description: '建立健康的饮食习惯',
      category: 'health',
      position: { x: 450, y: 80 },
      status: 'active',
      connections: ['health-4'],
      requirements: ['health-root']
    },
    {
      id: 'health-3',
      name: '运动锻炼',
      description: '制定并执行运动计划',
      category: 'health',
      position: { x: 500, y: 100 },
      status: 'available',
      connections: ['health-4'],
      requirements: ['health-root']
    },
    {
      id: 'health-4',
      name: '体质测试',
      description: '定期进行身体素质评估',
      category: 'health',
      position: { x: 450, y: 30 },
      status: 'locked',
      connections: [],
      requirements: ['health-1', 'health-2', 'health-3']
    },

    // 技能发展分支
    {
      id: 'skill-root',
      name: '技能发展',
      description: '职场与生活技能全面提升',
      category: 'skill',
      position: { x: 600, y: 200 },
      status: 'active',
      connections: ['skill-1', 'skill-2'],
      icon: '🛠️'
    },
    {
      id: 'skill-1',
      name: '职场技能',
      description: '提升工作相关的专业技能',
      category: 'skill',
      position: { x: 700, y: 150 },
      status: 'available',
      connections: ['skill-3', 'skill-4'],
      requirements: ['skill-root']
    },
    {
      id: 'skill-2',
      name: '生活技能',
      description: '增强日常生活管理能力',
      category: 'skill',
      position: { x: 650, y: 100 },
      status: 'active',
      connections: ['skill-5'],
      requirements: ['skill-root']
    },
    {
      id: 'skill-3',
      name: '软技能',
      description: '沟通、领导力等软实力',
      category: 'skill',
      position: { x: 750, y: 100 },
      status: 'available',
      connections: ['skill-6'],
      requirements: ['skill-1']
    },
    {
      id: 'skill-4',
      name: '面试技巧',
      description: '掌握面试表达和技巧',
      category: 'skill',
      position: { x: 780, y: 150 },
      status: 'locked',
      connections: [],
      requirements: ['skill-1', 'skill-3']
    },
    {
      id: 'skill-5',
      name: '时间管理',
      description: '优化时间安排和效率',
      category: 'skill',
      position: { x: 680, y: 50 },
      status: 'mastered',
      connections: [],
      requirements: ['skill-2']
    },
    {
      id: 'skill-6',
      name: 'Gallup优势测试',
      description: '深入了解个人优势特质',
      category: 'skill',
      position: { x: 800, y: 80 },
      status: 'available',
      connections: [],
      requirements: ['skill-3']
    }
  ];

  const getNodeColor = (node: SkillNode) => {
    switch (node.status) {
      case 'locked': return 'bg-gray-300 border-gray-400';
      case 'available': return 'bg-yellow-400 border-yellow-500 shadow-yellow-400/50';
      case 'active': return 'bg-blue-500 border-blue-600 shadow-blue-500/50';
      case 'mastered': return 'bg-green-500 border-green-600 shadow-green-500/50';
      default: return 'bg-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'psychology': return 'from-purple-500 to-pink-500';
      case 'health': return 'from-green-500 to-blue-500';
      case 'skill': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getNodeSize = (node: SkillNode) => {
    if (node.id === 'center') return 'w-20 h-20';
    if (node.id.includes('root')) return 'w-16 h-16';
    return 'w-12 h-12';
  };

  const renderConnections = (): JSX.Element[] => {
    const connections: JSX.Element[] = [];
    
    skillNodes.forEach((node) => {
      node.connections.forEach((connectionId) => {
        const targetNode = skillNodes.find(n => n.id === connectionId);
        if (targetNode) {
          const startX = node.position.x + (node.id === 'center' ? 40 : node.id.includes('root') ? 32 : 24);
          const startY = node.position.y + (node.id === 'center' ? 40 : node.id.includes('root') ? 32 : 24);
          const endX = targetNode.position.x + (targetNode.id === 'center' ? 40 : targetNode.id.includes('root') ? 32 : 24);
          const endY = targetNode.position.y + (targetNode.id === 'center' ? 40 : targetNode.id.includes('root') ? 32 : 24);
          
          connections.push(
            <line
              key={`${node.id}-${connectionId}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={node.status === 'locked' ? "#94a3b8" : "#3b82f6"}
              strokeWidth="2"
              strokeDasharray={node.status === 'locked' ? "5,5" : "none"}
              opacity={node.status === 'locked' ? 0.5 : 0.8}
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
          className={`absolute ${getNodeSize(node)} ${getNodeColor(node)} rounded-full flex items-center justify-center text-white font-semibold shadow-lg border-2 cursor-pointer transition-all duration-200 hover:scale-110 ${
            selectedNode === node.id ? 'ring-4 ring-white' : ''
          }`}
          style={{
            left: node.position.x,
            top: node.position.y,
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center'
          }}
          onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
        >
          {node.icon ? (
            <span className="text-2xl">{node.icon}</span>
          ) : (
            <span className="text-xs font-bold">{node.name[0]}</span>
          )}
        </div>
        
        <div
          className={`absolute text-gray-800 text-xs text-center font-medium bg-white/90 px-2 py-1 rounded shadow-md transition-all duration-200 ${
            selectedNode === node.id ? 'bg-white scale-110' : ''
          }`}
          style={{
            left: node.position.x - 15,
            top: node.position.y + (node.id === 'center' ? 85 : node.id.includes('root') ? 70 : 55),
            width: node.id === 'center' ? 90 : node.id.includes('root') ? 80 : 70,
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center'
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
    setZoomLevel(prev => Math.max(prev - 0.1, 0.4));
  };

  const selectedNodeData = selectedNode ? skillNodes.find(n => n.id === selectedNode) : null;

  return (
    <div className="mobile-container gradient-bg min-h-screen overflow-hidden">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between p-4 glass-effect relative z-10">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-800 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Home className="w-5 h-5 text-gray-800" />
            <div>
              <h1 className="text-gray-800 font-semibold">优势星图</h1>
              <p className="text-gray-600 text-sm">Home Page</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="text-gray-800 p-1"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-xs text-gray-600 min-w-[3rem] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="text-gray-800 p-1"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 星图容器 */}
      <div className="relative h-full overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <svg
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
          }}
        >
          {renderConnections()}
        </svg>
        
        <div
          className="relative w-full h-full"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
          }}
        >
          {renderNodes()}
        </div>
      </div>

      {/* 节点详情面板 */}
      {selectedNodeData && (
        <Card className="absolute bottom-4 left-4 right-4 glass-effect p-4 animate-slide-in-right">
          <div className="flex items-start space-x-3">
            <div className={`w-12 h-12 ${getNodeColor(selectedNodeData)} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
              {selectedNodeData.icon ? (
                <span className="text-xl">{selectedNodeData.icon}</span>
              ) : (
                <span className="text-sm">{selectedNodeData.name[0]}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-gray-800 font-semibold">{selectedNodeData.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedNodeData.status === 'mastered' ? 'bg-green-100 text-green-800' :
                  selectedNodeData.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  selectedNodeData.status === 'available' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {selectedNodeData.status === 'mastered' ? '已掌握' :
                   selectedNodeData.status === 'active' ? '进行中' :
                   selectedNodeData.status === 'available' ? '可开始' : '未解锁'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{selectedNodeData.description}</p>
              {selectedNodeData.requirements && selectedNodeData.requirements.length > 0 && (
                <div className="text-xs text-gray-500">
                  前置条件: {selectedNodeData.requirements.map(req => 
                    skillNodes.find(n => n.id === req)?.name || req
                  ).join(', ')}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* 图例 */}
      <Card className="absolute top-20 right-4 glass-effect p-3 w-48">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">节点状态</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">已掌握</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">进行中</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-gray-700">可开始</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-gray-700">未解锁</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StarMapPage;
