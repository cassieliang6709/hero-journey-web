import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Minus, Loader2 } from 'lucide-react';
import { useTodos } from '@/hooks/useTodos';
import { useStarMap, SkillNode } from '@/hooks/useStarMap';
import NodeCompletionHistory from '@/components/todo/NodeCompletionHistory';
import CategoryDetailPage from '@/components/CategoryDetailPage';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface StarMapPageProps {
  user: { id: string; username: string };
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
  const { t } = useTranslation('starmap');
  const [zoomLevel, setZoomLevel] = useState(0.6);
  const [panOffset, setPanOffset] = useState({ x: -300, y: -250 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showNodeHistory, setShowNodeHistory] = useState<string | null>(null);
  const [showCategoryDetail, setShowCategoryDetail] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { getNodeCompletionStats, getCategoryCompletionStats } = useTodos();
  const { nodes: skillNodes, level, isLoading, error } = useStarMap(user.id);

  // Update center node name to use username
  const nodesWithUser = skillNodes.map(node => 
    node.id === 'center' ? { ...node, name: user.username } : node
  );

  // 统一的开始拖拽处理函数
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX - panOffset.x, y: clientY - panOffset.y });
  }, [panOffset]);

  // 统一的拖拽移动处理函数
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const newOffset = {
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    };
    setPanOffset(newOffset);
  }, [isDragging, dragStart]);

  // 统一的结束拖拽处理函数
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 鼠标事件处理
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  }, [handleDragStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleDragMove(e.clientX, e.clientY);
  }, [isDragging, handleDragMove]);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // 触摸事件处理
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      handleDragStart(touch.clientX, touch.clientY);
    }
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  }, [isDragging, handleDragMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleDragEnd();
  }, [handleDragEnd]);

  // 处理节点双击事件
  const handleNodeDoubleClick = (nodeId: string) => {
    setShowNodeHistory(nodeId);
  };

  // 处理分类节点点击事件
  const handleCategoryNodeClick = (nodeId: string) => {
    if (nodeId.includes('root')) {
      const categoryId = nodeId.replace('-root', '');
      const categoryNames = {
        psychology: '心理优势',
        health: '身体健康', 
        skill: '技能发展'
      };
      
      setShowCategoryDetail(categoryId);
    } else {
      setSelectedNode(selectedNode === nodeId ? null : nodeId);
    }
  };

  // 如果显示分类详情页面，则渲染该页面
  if (showCategoryDetail) {
    const categoryNames = {
      psychology: '心理优势',
      health: '身体健康',
      skill: '技能发展'
    };
    
    return (
      <CategoryDetailPage
        categoryId={showCategoryDetail}
        categoryName={categoryNames[showCategoryDetail as keyof typeof categoryNames]}
        onBack={() => setShowCategoryDetail(null)}
      />
    );
  }

  // 根据任务完成情况动态更新节点状态
  const getNodeStatusWithTodos = (node: SkillNode) => {
    const stats = getNodeCompletionStats(node.id);
    console.log(`节点 ${node.id} 的完成统计:`, stats);
    
    if (stats.total === 0) {
      return node.status; // 没有任务时保持原状态
    }
    
    if (stats.completed > 0) {
      if (stats.completed >= Math.max(3, Math.ceil(stats.total * 0.8))) {
        console.log(`节点 ${node.id} 应该被标记为mastered`);
        return 'mastered';
      } else {
        console.log(`节点 ${node.id} 应该被标记为active`);
        return 'active';
      }
    }
    
    return node.status;
  };

  const getNodeGradient = (node: SkillNode) => {
    const baseGradients = {
      psychology: 'from-purple-400 via-pink-400 to-purple-500',
      health: 'from-green-400 via-emerald-400 to-green-500',
      skill: 'from-blue-400 via-cyan-400 to-blue-500'
    };
    
    const actualStatus = getNodeStatusWithTodos(node);
    const statusOpacity = {
      locked: 'opacity-30',
      available: 'opacity-60',
      active: 'opacity-90',
      mastered: 'opacity-100'
    };

    return `bg-gradient-to-br ${baseGradients[node.category]} ${statusOpacity[actualStatus]}`;
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
    
    nodesWithUser.forEach((node) => {
      // 只渲染同类别内的连接
      node.connections.forEach((connectionId) => {
        const targetNode = nodesWithUser.find(n => n.id === connectionId);
        if (targetNode && targetNode.category === node.category) {
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
              strokeWidth="2"
              strokeDasharray={node.status === 'locked' ? "4,2" : "none"}
              opacity={node.status === 'locked' ? 0.3 : 0.6}
            />
          );
        }
      });
    });
    
    return connections;
  };

  const renderNodes = (): JSX.Element[] => {
    return nodesWithUser.map((node) => {
      const stats = getNodeCompletionStats(node.id);
      const actualStatus = getNodeStatusWithTodos(node);
      
      return (
        <div key={node.id}>
          <div
            className={`absolute ${getNodeSize(node)} ${getNodeGradient(node)} rounded-full flex items-center justify-center border-2 border-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl ${
              selectedNode === node.id ? 'ring-4 ring-white scale-110 shadow-2xl' : ''
            }`}
            style={{
              left: node.position.x,
              top: node.position.y,
              boxShadow: actualStatus === 'mastered' ? '0 0 20px rgba(255,255,255,0.6)' : undefined
            }}
            onClick={() => handleCategoryNodeClick(node.id)}
            onDoubleClick={() => !node.id.includes('root') && handleNodeDoubleClick(node.id)}
          >
            {/* 显示完成数量的小徽章 */}
            {stats.completed > 0 && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                {stats.completed}
              </div>
            )}
            
            {/* 掌握状态的光环效果 */}
            {actualStatus === 'mastered' && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse opacity-30"></div>
            )}
          </div>
          
          <div
            className={`absolute text-white text-xs text-center font-medium bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg transition-all duration-300 ${
              selectedNode === node.id ? 'bg-black/90 scale-105' : ''
            }`}
            style={{
              left: node.position.x - 10,
              top: node.position.y + (node.id === 'center' ? 70 : node.id.includes('root') ? 55 : 45),
              width: node.id === 'center' ? 90 : node.id.includes('root') ? 80 : 70,
            }}
          >
            {node.name}
            {/* 为根节点添加点击提示 */}
            {node.id.includes('root') && (
              <div className="text-xs text-white/60 mt-1">{t('clickToViewDetails')}</div>
            )}
          </div>
        </div>
      );
    });
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.3));
  };

  const resetView = () => {
    setZoomLevel(0.6);
    setPanOffset({ x: -300, y: -250 });
  };

  const selectedNodeData = selectedNode ? nodesWithUser.find(n => n.id === selectedNode) : null;

  // Loading state
  if (isLoading) {
    return (
      <div className="mobile-container min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/70">{t('loading', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mobile-container min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={onBack} variant="outline" className="text-white border-white/30">
            {t('back', 'Go Back')}
          </Button>
        </div>
      </div>
    );
  }

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
            className="text-white p-2 hover:bg-white/10 hover:scale-105 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <h1 className="text-white font-bold text-lg">{t('title')}</h1>
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-white/20 text-white border-white/30">
              {t('level')}{level}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <LanguageSwitcher />
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="text-white border-white/30 hover:bg-white/10 bg-white/10"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="text-white border-white/30 hover:bg-white/10 bg-white/10"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
            className="text-white border-white/30 hover:bg-white/10 bg-white/10 text-xs px-2"
          >
            {t('reset')}
          </Button>
        </div>
      </div>

      {/* 星图容器 - 支持触摸和鼠标交互 */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden cursor-move select-none touch-none"
        style={{ 
          height: 'calc(100vh - 80px - 160px)',
          minHeight: '400px'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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

      {/* 节点详情面板 */}
      {selectedNodeData && !selectedNodeData.id.includes('root') && (
        <div className="absolute bottom-32 left-4 right-4 bg-black/40 backdrop-blur-lg border border-white/20 shadow-2xl p-4 rounded-lg animate-fade-in z-20">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 ${getNodeGradient(selectedNodeData)} rounded-full border-2 border-white shadow-lg`}>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-white font-bold text-lg">{selectedNodeData.name}</h3>
                <span className={`px-3 py-1 text-xs rounded-full font-medium border ${
                  getNodeStatusWithTodos(selectedNodeData) === 'mastered' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300' :
                  getNodeStatusWithTodos(selectedNodeData) === 'active' ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white border-blue-300' :
                  selectedNodeData.status === 'available' ? 'bg-white/20 text-white border-white/30' :
                  'bg-gray-500/20 text-gray-300 border-gray-400/30'
                }`}>
                  {getNodeStatusWithTodos(selectedNodeData) === 'mastered' ? t('nodeStatus.mastered') :
                   getNodeStatusWithTodos(selectedNodeData) === 'active' ? t('nodeStatus.inProgress') :
                   selectedNodeData.status === 'available' ? t('nodeStatus.available') : t('nodeStatus.locked')}
                </span>
              </div>
              <p className="text-white/80 text-sm mb-3">{selectedNodeData.description}</p>
              <div className="text-xs text-white/60 bg-white/10 p-2 rounded-lg border border-white/20 mb-2">
                {t('taskCompletion')}: {getNodeCompletionStats(selectedNodeData.id).completed}/{getNodeCompletionStats(selectedNodeData.id).total}
                {getNodeCompletionStats(selectedNodeData.id).total > 0 && (
                  <span className="ml-2">
                    ({Math.round((getNodeCompletionStats(selectedNodeData.id).completed / getNodeCompletionStats(selectedNodeData.id).total) * 100)}%)
                  </span>
                )}
              </div>
              {selectedNodeData.requirements && selectedNodeData.requirements.length > 0 && (
                <div className="text-xs text-white/60 bg-white/10 p-2 rounded-lg border border-white/20">
                  {t('prerequisite')}: {selectedNodeData.requirements.map(req => 
                    nodesWithUser.find(n => n.id === req)?.name || req
                  ).join(', ')}
                </div>
              )}
              <div className="mt-2 text-xs text-white/60">
                💡 {t('doubleClickHint')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 能力评估 - 固定在底部 */}
      <div className="fixed bottom-0 left-0 right-0 z-10 px-4 pb-2">
        <div className="max-w-md mx-auto">
          <div className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-lg p-3 shadow-2xl">
            <h3 className="text-white font-semibold mb-2 text-sm">{t('abilityAssessment')}</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{t('physicalTest')}</div>
                    <div className="text-white/70 text-xs">{t('assessPhysical')}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onGoToPhysicalTest}
                  className="text-white border-white/30 hover:bg-white/10 bg-white/10 text-xs px-2 py-1 h-7"
                >
                  {t('startTest')}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-sm"></div>
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{t('talentTest')}</div>
                    <div className="text-white/70 text-xs">{t('discoverTalent')}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onGoToTalentTest}
                  className="text-white border-white/30 hover:bg-white/10 bg-white/10 text-xs px-2 py-1 h-7"
                >
                  {t('startTest')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 节点完成历史弹窗 */}
      {showNodeHistory && (
        <NodeCompletionHistory
          nodeId={showNodeHistory}
          nodeName={nodesWithUser.find(n => n.id === showNodeHistory)?.name || ''}
          completionStats={getNodeCompletionStats(showNodeHistory)}
          onClose={() => setShowNodeHistory(null)}
        />
      )}
    </div>
  );
};

export default StarMapPage;
