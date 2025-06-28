
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Minus, Activity, Brain, Droplets, Moon, Dumbbell } from 'lucide-react';
import StarGraph from './StarGraph';

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
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

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

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

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
          </div>
        </div>
      </div>

      {/* 星图容器 */}
      <div className="p-4 mb-4">
        <StarGraph 
          user={user}
          selectedNode={selectedNode}
          onNodeClick={handleNodeClick}
        />
      </div>

      {/* 任务管理数据 */}
      <div className="px-4 mb-4">
        <h3 className="text-slate-800 font-medium text-sm mb-3">任务管理</h3>
        <div className="space-y-3">
          {taskData.map((task, index) => (
            <Card key={index} className={`${task.bgColor} ${task.borderColor} border shadow-sm`}>
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
                      <span className="text-sm font-bold text-slate-800">{task.progress}</span>
                      <span className={`text-xs font-semibold ${task.color}`}>{task.percentage}</span>
                    </div>
                    <p className="text-slate-500 text-xs">{task.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 能力评估 - 左右布局 */}
      <div className="px-4 mb-6">
        <h3 className="text-slate-800 font-medium text-sm mb-3">能力评估</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-6 rounded-xl shadow-lg border-0 flex flex-col items-center space-y-2"
            onClick={() => {
              console.log('体能测试入口');
              onGoToPhysicalTest?.();
            }}
          >
            <Activity className="w-6 h-6" />
            <div className="text-center">
              <div className="font-medium text-sm">体能测试</div>
              <div className="text-xs opacity-90">评估身体素质</div>
            </div>
          </Button>
          
          <Button 
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-6 rounded-xl shadow-lg border-0 flex flex-col items-center space-y-2"
            onClick={() => {
              console.log('优势天赋测试入口');
              onGoToTalentTest?.();
            }}
          >
            <Brain className="w-6 h-6" />
            <div className="text-center">
              <div className="font-medium text-sm">天赋测试</div>
              <div className="text-xs opacity-90">发现个人优势</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StarMapPage;
