
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

interface TreeNode {
  id: string;
  name: string;
  type: 'user' | 'domain' | 'method' | 'task';
  children?: TreeNode[];
  position: { x: number; y: number };
  completed?: boolean;
}

interface StarMapPageProps {
  user: { username: string };
  selectedAvatar: number;
  onBack: () => void;
}

const avatars = ['🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '👑', '⚡', '🔥', '🌟'];

const StarMapPage: React.FC<StarMapPageProps> = ({ user, selectedAvatar, onBack }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // 构建树形数据结构
  const treeData: TreeNode = {
    id: 'user',
    name: user.username,
    type: 'user',
    position: { x: 180, y: 100 },
    children: [
      {
        id: 'body',
        name: '身体',
        type: 'domain',
        position: { x: 80, y: 200 },
        children: [
          {
            id: 'exercise',
            name: '运动',
            type: 'method',
            position: { x: 40, y: 300 },
            children: [
              { id: 'morning-run', name: '晨跑', type: 'task', position: { x: 20, y: 380 }, completed: true },
              { id: 'yoga', name: '瑜伽', type: 'task', position: { x: 60, y: 380 }, completed: false }
            ]
          },
          {
            id: 'nutrition',
            name: '营养',
            type: 'method',
            position: { x: 120, y: 300 },
            children: [
              { id: 'healthy-diet', name: '健康饮食', type: 'task', position: { x: 100, y: 380 }, completed: false },
              { id: 'water-intake', name: '充足饮水', type: 'task', position: { x: 140, y: 380 }, completed: true }
            ]
          }
        ]
      },
      {
        id: 'emotion',
        name: '情绪',
        type: 'domain',
        position: { x: 180, y: 200 },
        children: [
          {
            id: 'mindfulness',
            name: '正念',
            type: 'method',
            position: { x: 160, y: 300 },
            children: [
              { id: 'meditation', name: '冥想', type: 'task', position: { x: 140, y: 380 }, completed: false },
              { id: 'gratitude', name: '感恩练习', type: 'task', position: { x: 180, y: 380 }, completed: true }
            ]
          },
          {
            id: 'social',
            name: '社交',
            type: 'method',
            position: { x: 200, y: 300 },
            children: [
              { id: 'family-time', name: '家庭时光', type: 'task', position: { x: 180, y: 380 }, completed: false },
              { id: 'friend-chat', name: '朋友聊天', type: 'task', position: { x: 220, y: 380 }, completed: false }
            ]
          }
        ]
      },
      {
        id: 'skill',
        name: '技能',
        type: 'domain',
        position: { x: 280, y: 200 },
        children: [
          {
            id: 'learning',
            name: '学习',
            type: 'method',
            position: { x: 260, y: 300 },
            children: [
              { id: 'reading', name: '阅读', type: 'task', position: { x: 240, y: 380 }, completed: true },
              { id: 'online-course', name: '在线课程', type: 'task', position: { x: 280, y: 380 }, completed: false }
            ]
          },
          {
            id: 'practice',
            name: '实践',
            type: 'method',
            position: { x: 300, y: 300 },
            children: [
              { id: 'coding', name: '编程练习', type: 'task', position: { x: 280, y: 380 }, completed: false },
              { id: 'writing', name: '写作练习', type: 'task', position: { x: 320, y: 380 }, completed: true }
            ]
          }
        ]
      }
    ]
  };

  const getNodeColor = (node: TreeNode) => {
    switch (node.type) {
      case 'user': return 'bg-hero-500';
      case 'domain': return 'bg-blue-500';
      case 'method': return 'bg-green-500';
      case 'task': return node.completed ? 'bg-purple-500' : 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getNodeSize = (node: TreeNode) => {
    switch (node.type) {
      case 'user': return 'w-16 h-16';
      case 'domain': return 'w-12 h-12';
      case 'method': return 'w-10 h-10';
      case 'task': return 'w-8 h-8';
      default: return 'w-8 h-8';
    }
  };

  const renderConnections = (node: TreeNode): JSX.Element[] => {
    const connections: JSX.Element[] = [];
    
    if (node.children) {
      node.children.forEach((child) => {
        const startX = node.position.x + 32; // 节点中心
        const startY = node.position.y + 32;
        const endX = child.position.x + 32;
        const endY = child.position.y + 32;
        
        connections.push(
          <line
            key={`${node.id}-${child.id}`}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="#94a3b8"
            strokeWidth="2"
          />
        );
        
        // 递归渲染子节点的连接
        connections.push(...renderConnections(child));
      });
    }
    
    return connections;
  };

  const renderNodes = (node: TreeNode): JSX.Element[] => {
    const nodes: JSX.Element[] = [];
    
    nodes.push(
      <div
        key={node.id}
        className={`absolute ${getNodeSize(node)} ${getNodeColor(node)} rounded-full flex items-center justify-center text-white font-semibold shadow-lg border-2 border-white`}
        style={{
          left: node.position.x,
          top: node.position.y,
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center'
        }}
      >
        {node.type === 'user' ? (
          <span className="text-2xl">{avatars[selectedAvatar]}</span>
        ) : (
          <span className="text-xs">{node.name[0]}</span>
        )}
      </div>
    );
    
    // 添加标签
    nodes.push(
      <div
        key={`${node.id}-label`}
        className="absolute text-gray-800 text-xs text-center font-medium bg-white/80 px-2 py-1 rounded shadow"
        style={{
          left: node.position.x - 10,
          top: node.position.y + (node.type === 'user' ? 70 : node.type === 'domain' ? 60 : 50),
          width: node.type === 'user' ? 80 : 60,
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center'
        }}
      >
        {node.name}
      </div>
    );
    
    // 递归渲染子节点
    if (node.children) {
      node.children.forEach(child => {
        nodes.push(...renderNodes(child));
      });
    }
    
    return nodes;
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

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
          <div>
            <h1 className="text-gray-800 font-semibold">英雄星图</h1>
            <p className="text-gray-600 text-sm">你的成长路径</p>
          </div>
        </div>
        
        {/* 缩放控件 */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="text-gray-800 p-1"
          >
            <Minus className="w-4 h-4" />
          </Button>
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
      <div className="relative h-full overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
        <svg
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
          }}
        >
          {renderConnections(treeData)}
        </svg>
        
        <div
          className="relative w-full h-full"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
          }}
        >
          {renderNodes(treeData)}
        </div>
      </div>

      {/* 图例 */}
      <Card className="absolute bottom-4 left-4 right-4 glass-effect p-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-hero-500 rounded-full"></div>
            <span className="text-gray-800">用户</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-gray-800">领域</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-800">方法</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <span className="text-gray-800">已完成</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StarMapPage;
