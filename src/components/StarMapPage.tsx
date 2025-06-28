import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Minus, Target, Calendar, Activity, Brain, Droplets, Moon, Dumbbell } from 'lucide-react';

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

  // 根据用户苦恼生成的任务完成数据
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

  // 扩大星图范围，确保所有节点都可见
  const skillNodes: SkillNode[] = [
    // 中心节点
    {
      id: 'center',
      name: user.username,
      description: '你的成长中心',
      category: 'psychology',
      position: { x: 500, y: 400 },
      status: 'active',
      connections: ['psychology-root', 'health-root', 'skill-root'],
      icon: '🌟'
    },

    // 心理优势分支
    {
      id: 'psychology-root',
      name: '心理优势',
      description: '基于心理学的优势发展',
      category: 'psychology',
      position: { x: 250, y: 250 },
      status: 'active',
      connections: ['psychology-1', 'psychology-2'],
      icon: '🧠'
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
      connections: ['health-1', 'health-2', 'health-3'],
      icon: '💪'
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
      connections: ['skill-1', 'skill-2', 'skill-3'],
      icon: '🎯'
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

  // 详细的任务管理数据
  const getTaskManagementData = () => {
    return [
      {
        title: '喝水',
        subtitle: '水是生命之源',
        date: '2025/04/25',
        progress: '4.16升',
        percentage: '66%',
        time: '17:59',
        icon: Droplets,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      },
      {
        title: '体能训练',
        subtitle: '强健体魄每一天',
        date: '2025/04/25',
        progress: '3/5组',
        percentage: '60%',
        time: '16:30',
        icon: Dumbbell,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      },
      {
        title: '睡眠质量',
        subtitle: '优质睡眠助成长',
        date: '2025/04/25',
        progress: '7.5小时',
        percentage: '85%',
        time: '06:30',
        icon: Moon,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      }
    ];
  };

  const taskData = getTaskManagementData();

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
      case 'locked': return 'bg-slate-200 border-slate-300 text-slate-600';
      case 'available': return 'bg-amber-100 border-amber-300 text-amber-800 shadow-amber-200/50';
      case 'active': return 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400 text-white shadow-blue-300/50';
      case 'mastered': return 'bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-400 text-white shadow-emerald-300/50';
      default: return 'bg-slate-200';
    }
  };

  const getNodeSize = (node: SkillNode) => {
    if (node.id === 'center') return 'w-24 h-24 text-3xl';
    if (node.id.includes('root')) return 'w-20 h-20 text-2xl';
    return 'w-16 h-16 text-lg';
  };

  const renderConnections = (): JSX.Element[] => {
    const connections: JSX.Element[] = [];
    
    skillNodes.forEach((node) => {
      node.connections.forEach((connectionId) => {
        const targetNode = skillNodes.find(n => n.id === connectionId);
        if (targetNode) {
          const getNodeCenter = (n: SkillNode) => {
            const size = n.id === 'center' ? 48 : n.id.includes('root') ? 40 : 32;
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
              stroke={node.status === 'locked' ? "#cbd5e1" : "#3b82f6"}
              strokeWidth="3"
              strokeDasharray={node.status === 'locked' ? "8,4" : "none"}
              opacity={node.status === 'locked' ? 0.4 : 0.7}
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
          className={`absolute ${getNodeSize(node)} ${getNodeColor(node)} rounded-full flex items-center justify-center font-bold shadow-lg border-2 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl ${
            selectedNode === node.id ? 'ring-4 ring-white ring-opacity-80 scale-110' : ''
          }`}
          style={{
            left: node.position.x,
            top: node.position.y,
          }}
          onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
        >
          {node.icon || node.name[0]}
        </div>
        
        <div
          className={`absolute text-slate-800 text-sm text-center font-semibold bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md transition-all duration-300 ${
            selectedNode === node.id ? 'bg-white scale-110 shadow-lg' : ''
          }`}
          style={{
            left: node.position.x - 20,
            top: node.position.y + (node.id === 'center' ? 100 : node.id.includes('root') ? 85 : 70),
            width: node.id === 'center' ? 120 : node.id.includes('root') ? 100 : 90,
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
    <div className="mobile-container min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-slate-700 p-0 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <h1 className="text-slate-800 font-bold text-lg">成长星图</h1>
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-blue-100 text-blue-700 border-blue-200">
              lv1
            </Badge>
            <p className="text-slate-600 text-sm">针对: {currentConcern}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="text-slate-700 p-2 border-slate-200 hover:bg-slate-50"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
            className="text-xs text-slate-600 min-w-[3rem] text-center px-3 border-slate-200 hover:bg-slate-50"
          >
            全景
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="text-slate-700 p-2 border-slate-200 hover:bg-slate-50"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 星图容器 - 可拖动 */}
      <div 
        ref={containerRef}
        className="relative h-96 overflow-hidden bg-gradient-to-br from-indigo-100/30 via-purple-100/30 to-pink-100/30 mb-4 cursor-move"
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

      {/* 任务管理数据 */}
      <div className="px-4 mb-4">
        <h3 className="text-slate-800 font-medium text-sm mb-3">任务管理</h3>
        <div className="space-y-3">
          {taskData.map((task, index) => (
            <Card key={index} className={`${task.bgColor} ${task.borderColor} border-2 shadow-sm`}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${task.bgColor}`}>
                      <task.icon className={`w-4 h-4 ${task.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 text-sm">{task.title}</h4>
                      <p className="text-slate-600 text-xs">{task.subtitle}</p>
                      <p className="text-slate-500 text-xs">{task.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline space-x-1 mb-1">
                      <span className="text-lg font-bold text-slate-800">{task.progress}</span>
                      <span className={`text-sm font-semibold ${task.color}`}>{task.percentage}</span>
                    </div>
                    <p className="text-slate-500 text-xs">{task.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 测试入口 */}
      <div className="px-4 mb-6">
        <h3 className="text-slate-800 font-medium text-sm mb-3">能力评估</h3>
        <div className="space-y-3">
          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-4 rounded-xl shadow-lg border-0"
            onClick={() => {
              console.log('体能测试入口');
              onGoToPhysicalTest?.();
            }}
          >
            <Activity className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium text-base">体能测试</div>
              <div className="text-xs opacity-90">评估身体素质，制定运动计划</div>
            </div>
          </Button>
          
          <Button 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-4 rounded-xl shadow-lg border-0"
            onClick={() => {
              console.log('优势天赋测试入口');
              onGoToTalentTest?.();
            }}
          >
            <Brain className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium text-base">优势天赋测试</div>
              <div className="text-xs opacity-90">发现个人天赋优势，制定成长路径</div>
            </div>
          </Button>
        </div>
      </div>

      {/* 节点详情面板 */}
      {selectedNodeData && (
        <Card className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm border-white/20 shadow-xl p-4 animate-fade-in">
          <div className="flex items-start space-x-4">
            <div className={`w-16 h-16 ${getNodeColor(selectedNodeData)} rounded-full flex items-center justify-center text-2xl font-bold shadow-lg`}>
              {selectedNodeData.icon || selectedNodeData.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-slate-800 font-bold text-lg">{selectedNodeData.name}</h3>
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  selectedNodeData.status === 'mastered' ? 'bg-emerald-100 text-emerald-800' :
                  selectedNodeData.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  selectedNodeData.status === 'available' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {selectedNodeData.status === 'mastered' ? '已掌握' :
                   selectedNodeData.status === 'active' ? '进行中' :
                   selectedNodeData.status === 'available' ? '可开始' : '未解锁'}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-3">{selectedNodeData.description}</p>
              {selectedNodeData.requirements && selectedNodeData.requirements.length > 0 && (
                <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                  前置条件: {selectedNodeData.requirements.map(req => 
                    skillNodes.find(n => n.id === req)?.name || req
                  ).join(', ')}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StarMapPage;
