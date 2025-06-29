import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useSkillProgress } from '@/hooks/useSkillProgress';

interface SkillNode {
  id: string;
  name: string;
  description: string;
  category: 'pitch' | 'team' | 'mvp' | 'dev' | 'demo' | 'emergency' | 'health' | 'center';
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
  const [zoomLevel, setZoomLevel] = useState(0.6);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { isSkillUnlocked, getSkillCompletedTasks } = useSkillProgress(user.username || 'default');

  // 创业技能发展星图节点
  const skillNodes: SkillNode[] = [
    // 中心节点
    {
      id: 'center',
      name: user.username,
      description: '创业技能发展中心',
      category: 'center',
      position: { x: 600, y: 400 },
      status: 'active',
      connections: ['pitch-root', 'team-root', 'mvp-root', 'dev-root', 'demo-root', 'emergency-root']
    },

    // Pitch表达分支 - 上方
    {
      id: 'pitch-root',
      name: 'Pitch表达',
      description: '自我介绍与沟通表达能力',
      category: 'pitch',
      position: { x: 600, y: 150 },
      status: 'active',
      connections: ['pitch-intro', 'pitch-communication', 'pitch-alignment']
    },
    {
      id: 'pitch-intro',
      name: '技术标签化自我介绍',
      description: '快速自我介绍（技术标签化）',
      category: 'pitch',
      position: { x: 450, y: 80 },
      status: 'available',
      connections: [],
      requirements: ['pitch-root']
    },
    {
      id: 'pitch-communication',
      name: '需求扫描沟通',
      description: '倾听&扫描他人需求',
      category: 'pitch',
      position: { x: 600, y: 50 },
      status: 'available',
      connections: [],
      requirements: ['pitch-root']
    },
    {
      id: 'pitch-alignment',
      name: '价值对齐沟通',
      description: '价值对齐型沟通',
      category: 'pitch',
      position: { x: 750, y: 80 },
      status: 'available',
      connections: [],
      requirements: ['pitch-root']
    },

    // 团队组建分支 - 左上
    {
      id: 'team-root',
      name: '团队组建',
      description: '团队识别与协作匹配',
      category: 'team',
      position: { x: 300, y: 200 },
      status: 'active',
      connections: ['team-identification', 'team-value', 'team-collaboration']
    },
    {
      id: 'team-identification',
      name: '技术角色识别',
      description: '技术角色识别',
      category: 'team',
      position: { x: 150, y: 120 },
      status: 'available',
      connections: [],
      requirements: ['team-root']
    },
    {
      id: 'team-value',
      name: '技术价值锚定',
      description: '技术价值锚定',
      category: 'team',
      position: { x: 250, y: 100 },
      status: 'available',
      connections: [],
      requirements: ['team-root']
    },
    {
      id: 'team-collaboration',
      name: '主动协作匹配',
      description: '主动沟通&协作匹配',
      category: 'team',
      position: { x: 350, y: 120 },
      status: 'available',
      connections: [],
      requirements: ['team-root']
    },

    // MVP搭建分支 - 右上
    {
      id: 'mvp-root',
      name: 'MVP搭建',
      description: 'MVP原型快速搭建能力',
      category: 'mvp',
      position: { x: 900, y: 200 },
      status: 'active',
      connections: ['mvp-definition', 'mvp-feasibility', 'mvp-strategy']
    },
    {
      id: 'mvp-definition',
      name: 'MVP功能定义',
      description: 'MVP功能定义',
      category: 'mvp',
      position: { x: 850, y: 120 },
      status: 'available',
      connections: [],
      requirements: ['mvp-root']
    },
    {
      id: 'mvp-feasibility',
      name: '技术可行性判断',
      description: '技术可行性判断',
      category: 'mvp',
      position: { x: 950, y: 100 },
      status: 'available',
      connections: [],
      requirements: ['mvp-root']
    },
    {
      id: 'mvp-strategy',
      name: '极简开发策略',
      description: '极简开发策略（mock数据/云服务优先）',
      category: 'mvp',
      position: { x: 1050, y: 120 },
      status: 'available',
      connections: [],
      requirements: ['mvp-root']
    },

    // 协作开发分支 - 左下
    {
      id: 'dev-root',
      name: '协作开发',
      description: '团队协作开发流程',
      category: 'dev',
      position: { x: 300, y: 600 },
      status: 'active',
      connections: ['dev-git', 'dev-sync', 'dev-interface']
    },
    {
      id: 'dev-git',
      name: 'Git协作',
      description: 'Git协作（代码仓管理）',
      category: 'dev',
      position: { x: 150, y: 680 },
      status: 'available',
      connections: [],
      requirements: ['dev-root']
    },
    {
      id: 'dev-sync',
      name: '进度同步节奏',
      description: '每小时同步进度节奏',
      category: 'dev',
      position: { x: 300, y: 720 },
      status: 'available',
      connections: [],
      requirements: ['dev-root']
    },
    {
      id: 'dev-interface',
      name: '设计技术对齐',
      description: '设计-技术接口对齐',
      category: 'dev',
      position: { x: 450, y: 680 },
      status: 'available',
      connections: [],
      requirements: ['dev-root']
    },

    // 技术路演分支 - 右下
    {
      id: 'demo-root',
      name: '技术路演',
      description: '技术演示与表达能力',
      category: 'demo',
      position: { x: 900, y: 600 },
      status: 'active',
      connections: ['demo-expression', 'demo-rehearsal', 'demo-qa']
    },
    {
      id: 'demo-expression',
      name: '技术亮点表达',
      description: '技术亮点转化为用户语言',
      category: 'demo',
      position: { x: 850, y: 680 },
      status: 'available',
      connections: [],
      requirements: ['demo-root']
    },
    {
      id: 'demo-rehearsal',
      name: '演示彩排',
      description: '演示彩排与临场稳定性',
      category: 'demo',
      position: { x: 950, y: 720 },
      status: 'available',
      connections: [],
      requirements: ['demo-root']
    },
    {
      id: 'demo-qa',
      name: '技术答辩',
      description: '技术答辩的结构化回应',
      category: 'demo',
      position: { x: 1050, y: 680 },
      status: 'available',
      connections: [],
      requirements: ['demo-root']
    },

    // 应急恢复力分支 - 下方
    {
      id: 'emergency-root',
      name: '应急恢复力',
      description: '应急处理与风险预案',
      category: 'emergency',
      position: { x: 600, y: 750 },
      status: 'active',
      connections: ['emergency-fallback', 'emergency-backup', 'emergency-toolkit']
    },
    {
      id: 'emergency-fallback',
      name: '崩溃预案',
      description: '崩溃5秒切换预案（截图/录屏）',
      category: 'emergency',
      position: { x: 450, y: 820 },
      status: 'available',
      connections: [],
      requirements: ['emergency-root']
    },
    {
      id: 'emergency-backup',
      name: '技术替代路径',
      description: '技术替代路径（备胎技术栈）',
      category: 'emergency',
      position: { x: 600, y: 850 },
      status: 'available',
      connections: [],
      requirements: ['emergency-root']
    },
    {
      id: 'emergency-toolkit',
      name: '急救包准备',
      description: '离线文档/U盘急救包准备',
      category: 'emergency',
      position: { x: 750, y: 820 },
      status: 'available',
      connections: [],
      requirements: ['emergency-root']
    },

    // 健康管理 - 左侧
    {
      id: 'health-energy',
      name: '能量管理',
      description: '保持体力与精力的平衡',
      category: 'health',
      position: { x: 150, y: 400 },
      status: 'active',
      connections: []
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
    const isUnlockedByTodos = isSkillUnlocked(node.id);
    
    if (isUnlockedByTodos) {
      return 'bg-yellow-400 border-yellow-500 text-white animate-pulse';
    }
    
    const colors = {
      center: 'bg-purple-600 border-purple-700 text-white',
      pitch: 'bg-blue-500 border-blue-600 text-white',
      team: 'bg-green-500 border-green-600 text-white',
      mvp: 'bg-orange-500 border-orange-600 text-white',
      dev: 'bg-red-500 border-red-600 text-white',
      demo: 'bg-pink-500 border-pink-600 text-white',
      emergency: 'bg-gray-600 border-gray-700 text-white',
      health: 'bg-cyan-500 border-cyan-600 text-white'
    };
    
    switch (node.status) {
      case 'locked': return 'bg-gray-200 border-gray-300 text-gray-600';
      case 'available': return colors[node.category] || 'bg-gray-400';
      case 'active': return colors[node.category] || 'bg-gray-600';
      case 'mastered': return colors[node.category] || 'bg-gray-800';
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
    return skillNodes.map((node) => {
      const isUnlockedByTodos = isSkillUnlocked(node.id);
      const completedTasks = getSkillCompletedTasks(node.id);
      
      return (
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
          
          {isUnlockedByTodos && (
            <div
              className="absolute w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce"
              style={{
                left: node.position.x + (node.id === 'center' ? 48 : node.id.includes('root') ? 36 : 28),
                top: node.position.y - 4,
              }}
            >
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          )}
          
          <div
            className={`absolute text-gray-800 text-xs text-center font-medium bg-white/95 px-2 py-1 rounded shadow-sm transition-all duration-300 ${
              selectedNode === node.id ? 'bg-white scale-105' : ''
            } ${isUnlockedByTodos ? 'bg-yellow-50 border border-yellow-200' : ''}`}
            style={{
              left: node.position.x - 20,
              top: node.position.y + (node.id === 'center' ? 70 : node.id.includes('root') ? 55 : 45),
              width: node.id === 'center' ? 100 : node.id.includes('root') ? 80 : 80,
            }}
          >
            {node.name}
            {completedTasks > 0 && (
              <div className="text-xs text-yellow-600 font-bold">
                +{completedTasks}任务
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.3));
  };

  const resetView = () => {
    setZoomLevel(0.6);
    setPanOffset({ x: -100, y: -50 });
  };

  const selectedNodeData = selectedNode ? skillNodes.find(n => n.id === selectedNode) : null;
  const selectedNodeUnlocked = selectedNodeData ? isSkillUnlocked(selectedNodeData.id) : false;
  const selectedNodeTasks = selectedNodeData ? getSkillCompletedTasks(selectedNodeData.id) : 0;

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
            <h1 className="text-gray-900 font-bold text-lg">创业技能星图</h1>
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-700 border-gray-200">
              创业模式
            </Badge>
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
        className="relative h-96 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 mb-4 cursor-move"
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
            width: '1400px',
            height: '1000px'
          }}
        >
          {renderConnections()}
        </svg>
        
        <div
          className="relative w-full h-full pointer-events-none"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center',
            width: '1400px',
            height: '1000px'
          }}
        >
          <div className="pointer-events-auto">
            {renderNodes()}
          </div>
        </div>
      </div>

      {/* 技能分类说明 */}
      <div className="px-4 mb-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-gray-900 font-semibold mb-3">创业技能分类</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Pitch表达</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>团队组建</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>MVP搭建</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>协作开发</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span>技术路演</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              <span>应急恢复</span>
            </div>
          </div>
        </div>
      </div>

      {/* 能力评估 */}
      <div className="px-4 mb-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-gray-900 font-semibold mb-3">能力评估</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <div>
                  <div className="text-gray-900 font-medium">体能测试</div>
                  <div className="text-gray-600 text-sm">评估身体素质</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onGoToPhysicalTest}
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                开始测试
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <div>
                  <div className="text-gray-900 font-medium">优势天赋测试</div>
                  <div className="text-gray-600 text-sm">发现个人天赋优势</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onGoToTalentTest}
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                开始测试
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 节点详情面板 */}
      {selectedNodeData && (
        <div className="absolute bottom-4 left-4 right-4 bg-white border border-gray-200 shadow-lg p-4 rounded-lg animate-fade-in">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 ${getNodeColor(selectedNodeData)} rounded-full border-2 relative`}>
              {selectedNodeUnlocked && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-gray-900 font-bold text-lg">{selectedNodeData.name}</h3>
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  selectedNodeUnlocked ? 'bg-yellow-100 text-yellow-800' :
                  selectedNodeData.status === 'mastered' ? 'bg-gray-100 text-gray-800' :
                  selectedNodeData.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  selectedNodeData.status === 'available' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {selectedNodeUnlocked ? '已解锁' :
                   selectedNodeData.status === 'mastered' ? '已掌握' :
                   selectedNodeData.status === 'active' ? '进行中' :
                   selectedNodeData.status === 'available' ? '可开始' : '未解锁'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{selectedNodeData.description}</p>
              
              {selectedNodeUnlocked && selectedNodeTasks > 0 && (
                <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded-lg mb-2">
                  🎉 通过完成 {selectedNodeTasks} 个相关任务解锁了此技能！
                </div>
              )}
              
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
