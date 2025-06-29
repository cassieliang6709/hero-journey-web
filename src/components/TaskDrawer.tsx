
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Activity, Brain, Sparkles, Target } from 'lucide-react';
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
        remaining: '还需1.84升',
        icon: '💧',
        color: 'from-blue-400 to-cyan-500'
      },
      {
        title: '体能训练',
        completed: 3,
        total: 5,
        remaining: 2,
        icon: '💪',
        color: 'from-green-400 to-emerald-500'
      },
      {
        title: '睡眠质量',
        progress: '7.5小时',
        icon: '😴',
        color: 'from-purple-400 to-indigo-500'
      }
    ];
  };

  const taskData = getTaskManagementData();

  return (
    <div className="space-y-3">
      {/* 任务管理抽屉 */}
      <Collapsible open={isTaskOpen} onOpenChange={setIsTaskOpen}>
        <Card className="bg-gradient-to-r from-white to-blue-50 border border-blue-200 shadow-lg">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-gray-900 font-medium text-sm">任务管理</CardTitle>
                  <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                </div>
                {isTaskOpen ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-blue-600" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {taskData.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 bg-gradient-to-r ${task.color} rounded-full flex items-center justify-center text-white shadow-md`}>
                      <span className="text-sm">{task.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                    </div>
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
        <Card className="bg-gradient-to-r from-white to-purple-50 border border-purple-200 shadow-lg">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-purple-50/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-gray-900 font-medium text-sm">能力评估</CardTitle>
                  <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                </div>
                {isAssessmentOpen ? <ChevronUp className="w-4 h-4 text-purple-600" /> : <ChevronDown className="w-4 h-4 text-purple-600" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              <div 
                className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg cursor-pointer hover:from-green-100 hover:to-emerald-100 transition-all shadow-sm hover:shadow-md"
                onClick={() => {
                  console.log('体能测试入口');
                  onGoToPhysicalTest?.();
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm flex items-center space-x-1">
                      <span>体能测试</span>
                      <span className="text-green-600">💪</span>
                    </div>
                    <div className="text-xs text-gray-600">评估身体素质</div>
                  </div>
                </div>
              </div>
              
              <div 
                className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all shadow-sm hover:shadow-md"
                onClick={() => {
                  console.log('优势天赋测试入口');
                  onGoToTalentTest?.();
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm flex items-center space-x-1">
                      <span>优势天赋测试</span>
                      <span className="text-blue-600">🧠</span>
                    </div>
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
