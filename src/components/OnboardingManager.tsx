
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Edit, Plus, Trash2 } from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  content: string;
  buttonText: string;
}

interface OnboardingManagerProps {
  onBack: () => void;
}

const OnboardingManager: React.FC<OnboardingManagerProps> = ({ onBack }) => {
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 1,
      title: '欢迎页面',
      description: '用户初次进入的欢迎界面',
      content: '每个人心中都住着一个英雄\n现在是时候唤醒你的英雄之魂了',
      buttonText: '开始探索'
    },
    {
      id: 2,
      title: '想法选择',
      description: '让用户选择共鸣的想法',
      content: '说说你最近的想法\n选择那些让你有共鸣的想法',
      buttonText: '我选好了！'
    },
    {
      id: 3,
      title: '英雄形象',
      description: '选择用户的英雄化身',
      content: '你的英雄形象\n这就是你的英雄化身',
      buttonText: '启程！'
    }
  ]);

  const [selectedIdeas] = useState([
    "裤子又穿不上了",
    "最近又胖了", 
    "最近找不到工作很烦！！",
    "我有一些健康上的困恼",
    "感觉身体好差，没有精力",
    "心情低落"
  ]);

  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<OnboardingStep>({
    id: 0,
    title: '',
    description: '',
    content: '',
    buttonText: ''
  });

  const handleEdit = (step: OnboardingStep) => {
    setEditingStep(step.id);
    setEditForm({ ...step });
  };

  const handleSave = () => {
    setSteps(steps.map(step => 
      step.id === editingStep ? editForm : step
    ));
    setEditingStep(null);
    setEditForm({ id: 0, title: '', description: '', content: '', buttonText: '' });
  };

  const handleCancel = () => {
    setEditingStep(null);
    setEditForm({ id: 0, title: '', description: '', content: '', buttonText: '' });
  };

  const handleAddStep = () => {
    const newStep: OnboardingStep = {
      id: Math.max(...steps.map(s => s.id)) + 1,
      title: '新步骤',
      description: '新的引导步骤',
      content: '请编辑此内容',
      buttonText: '继续'
    };
    setSteps([...steps, newStep]);
  };

  const handleDeleteStep = (id: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter(step => step.id !== id));
    }
  };

  return (
    <div className="mobile-container min-h-screen bg-gray-50">
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
          <h1 className="text-gray-900 font-bold text-lg">引导流程管理</h1>
        </div>
        
        <Button
          onClick={handleAddStep}
          size="sm"
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-1" />
          添加步骤
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* 步骤列表 */}
        {steps.map((step) => (
          <Card key={step.id} className="p-4">
            {editingStep === step.id ? (
              /* 编辑模式 */
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`title-${step.id}`}>标题</Label>
                  <Input
                    id={`title-${step.id}`}
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`description-${step.id}`}>描述</Label>
                  <Input
                    id={`description-${step.id}`}
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`content-${step.id}`}>内容</Label>
                  <textarea
                    id={`content-${step.id}`}
                    value={editForm.content}
                    onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md resize-none"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`button-${step.id}`}>按钮文字</Label>
                  <Input
                    id={`button-${step.id}`}
                    value={editForm.buttonText}
                    onChange={(e) => setEditForm({...editForm, buttonText: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    保存
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                  >
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              /* 显示模式 */
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      步骤 {step.id}: {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEdit(step)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {steps.length > 1 && (
                      <Button
                        onClick={() => handleDeleteStep(step.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <p className="text-gray-800 whitespace-pre-line">{step.content}</p>
                </div>
                
                <div className="text-sm text-gray-600">
                  按钮文字: <span className="font-medium">{step.buttonText}</span>
                </div>
              </div>
            )}
          </Card>
        ))}

        {/* 想法选项管理 */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">可选想法列表</h3>
          <div className="grid gap-2">
            {selectedIdeas.map((idea, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded text-gray-800 text-sm">
                {idea}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            注：想法列表的修改需要在代码中进行
          </p>
        </Card>

        {/* 头像选项预览 */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">可选头像</h3>
          <div className="grid grid-cols-4 gap-4">
            {['🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '👑', '⚡', '🔥', '🌟'].map((avatar, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{avatar}</div>
                <div className="text-xs text-gray-600">
                  {['超级英雄', '女超人', '魔法师', '女巫', '王者', '闪电侠', '火焰战士', '星光守护者'][index]}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            注：头像选项的修改需要在代码中进行
          </p>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingManager;
