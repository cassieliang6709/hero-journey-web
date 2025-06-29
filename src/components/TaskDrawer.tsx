
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Activity, Brain } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TaskDrawerProps {
  onGoToPhysicalTest?: () => void;
  onGoToTalentTest?: () => void;
}

const TaskDrawer: React.FC<TaskDrawerProps> = ({ onGoToPhysicalTest, onGoToTalentTest }) => {
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  const getTaskManagementData = () => {
    return [
      {
        title: '喝水',
        progress: '4.16升',
        remaining: '还需1.84升'
      },
      {
        title: '体能训练',
        completed: 3,
        total: 5,
        remaining: 2
      },
      {
        title: '睡眠质量',
        progress: '7.5小时'
      }
    ];
  };

  const taskData = getTaskManagementData();

  return (
    <div className="space-y-3">
      {/* 任务管理抽屉 */}
      <Collapsible open={isTaskOpen} onOpenChange={setIsTaskOpen}>
        <Card className="bg-white/90 backdrop-blur border border-white/20 shadow-lg">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-white/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium text-sm">任务管理</CardTitle>
                {isTaskOpen ? <ChevronUp className="w-4 h-4 text-purple-600" /> : <ChevronDown className="w-4 h-4 text-purple-600" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {taskData.map((task, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-white/20 last:border-b-0">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                  </div>
                  <div className="text-right">
                    {task.completed !== undefined ? (
                      <div>
                        <span className="text-sm font-medium text-gray-900">{task.completed}/{task.total}</span>
                        <p className="text-xs text-gray-600">还剩{task.remaining}次</p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-sm font-medium text-gray-900">{task.progress}</span>
                        {task.remaining && <p className="text-xs text-gray-600">{task.remaining}</p>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 能力评估抽屉 */}
      <Collapsible open={isAssessmentOpen} onOpenChange={setIsAssessmentOpen}>
        <Card className="bg-white/90 backdrop-blur border border-white/20 shadow-lg">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-white/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-medium text-sm">能力评估</CardTitle>
                {isAssessmentOpen ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-blue-600" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              <div 
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl"
                onClick={() => {
                  console.log('体能测试入口');
                  onGoToPhysicalTest?.();
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">体能测试</div>
                    <div className="text-xs text-white/80">评估身体素质</div>
                  </div>
                </div>
              </div>
              
              <div 
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl"
                onClick={() => {
                  console.log('优势天赋测试入口');
                  onGoToTalentTest?.();
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">优势天赋测试</div>
                    <div className="text-xs text-white/80">发现个人天赋优势</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};

export default TaskDrawer;
