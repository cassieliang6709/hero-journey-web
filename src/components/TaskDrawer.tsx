
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
        <Card className="bg-white border border-gray-200">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900 font-medium text-sm">任务管理</CardTitle>
                {isTaskOpen ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {taskData.map((task, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                  </div>
                  <div className="text-right">
                    {task.completed !== undefined ? (
                      <div>
                        <span className="text-sm font-medium text-gray-900">{task.completed}/{task.total}</span>
                        <p className="text-xs text-gray-500">还剩{task.remaining}次</p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-sm font-medium text-gray-900">{task.progress}</span>
                        {task.remaining && <p className="text-xs text-gray-500">{task.remaining}</p>}
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
        <Card className="bg-white border border-gray-200">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900 font-medium text-sm">能力评估</CardTitle>
                {isAssessmentOpen ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              <div 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  console.log('体能测试入口');
                  onGoToPhysicalTest?.();
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">体能测试</div>
                    <div className="text-xs text-gray-600">评估身体素质</div>
                  </div>
                </div>
              </div>
              
              <div 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  console.log('优势天赋测试入口');
                  onGoToTalentTest?.();
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">优势天赋测试</div>
                    <div className="text-xs text-gray-600">发现个人天赋优势</div>
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
