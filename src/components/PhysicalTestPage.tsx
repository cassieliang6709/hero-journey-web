
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Activity, Heart, Zap, Target } from 'lucide-react';

interface PhysicalTestPageProps {
  user: { username: string };
  onBack: () => void;
}

interface TestResult {
  category: string;
  score: number;
  level: string;
  recommendation: string;
  color: string;
}

const PhysicalTestPage: React.FC<PhysicalTestPageProps> = ({ user, onBack }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'test' | 'results'>('intro');
  const [testData, setTestData] = useState({
    age: '',
    weight: '',
    height: '',
    pushups: '',
    situps: '',
    running: '',
    flexibility: ''
  });
  const [results, setResults] = useState<TestResult[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setTestData(prev => ({ ...prev, [field]: value }));
  };

  const calculateResults = () => {
    // 模拟计算体能测试结果
    const age = parseInt(testData.age);
    const pushups = parseInt(testData.pushups);
    const situps = parseInt(testData.situps);
    const running = parseFloat(testData.running);
    
    const results: TestResult[] = [
      {
        category: '上肢力量',
        score: Math.min(100, Math.max(0, (pushups / (age < 30 ? 30 : 25)) * 100)),
        level: pushups > 20 ? '优秀' : pushups > 15 ? '良好' : pushups > 10 ? '一般' : '需提升',
        recommendation: pushups > 20 ? '保持现有水平' : '建议增加俯卧撑训练',
        color: pushups > 20 ? 'text-green-600' : pushups > 15 ? 'text-blue-600' : 'text-orange-600'
      },
      {
        category: '核心力量',
        score: Math.min(100, Math.max(0, (situps / (age < 30 ? 40 : 35)) * 100)),
        level: situps > 30 ? '优秀' : situps > 20 ? '良好' : situps > 15 ? '一般' : '需提升',
        recommendation: situps > 30 ? '保持现有水平' : '建议增加腹肌训练',
        color: situps > 30 ? 'text-green-600' : situps > 20 ? 'text-blue-600' : 'text-orange-600'
      },
      {
        category: '心肺耐力',
        score: Math.min(100, Math.max(0, (1 / running) * 100)),
        level: running < 6 ? '优秀' : running < 8 ? '良好' : running < 10 ? '一般' : '需提升',
        recommendation: running < 6 ? '保持现有水平' : '建议增加有氧训练',
        color: running < 6 ? 'text-green-600' : running < 8 ? 'text-blue-600' : 'text-orange-600'
      }
    ];

    setResults(results);
    setCurrentStep('results');
  };

  const renderIntro = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
          <Activity className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">体能测试</h2>
        <p className="text-slate-600">
          通过科学的体能测试，了解你的身体状况，为你制定个性化的运动计划
        </p>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-slate-800">测试包含</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Heart className="w-5 h-5 text-red-500" />
            <div>
              <p className="font-medium text-slate-800">心肺耐力</p>
              <p className="text-sm text-slate-600">1000米跑步时间</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="font-medium text-slate-800">肌肉力量</p>
              <p className="text-sm text-slate-600">俯卧撑、仰卧起坐</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-slate-800">身体柔韧性</p>
              <p className="text-sm text-slate-600">坐位体前屈</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={() => setCurrentStep('test')}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-4 rounded-xl"
      >
        开始测试
      </Button>
    </div>
  );

  const renderTest = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">填写测试数据</h2>
        <p className="text-slate-600 text-sm">请如实填写您的基本信息和测试结果</p>
      </div>

      <div className="space-y-4">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-slate-800 text-lg">基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">年龄</label>
                <Input
                  type="number"
                  placeholder="25"
                  value={testData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="bg-white/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">体重(kg)</label>
                <Input
                  type="number"
                  placeholder="65"
                  value={testData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="bg-white/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">身高(cm)</label>
              <Input
                type="number"
                placeholder="170"
                value={testData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className="bg-white/50"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-slate-800 text-lg">体能测试</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">俯卧撑(个/分钟)</label>
              <Input
                type="number"
                placeholder="20"
                value={testData.pushups}
                onChange={(e) => handleInputChange('pushups', e.target.value)}
                className="bg-white/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">仰卧起坐(个/分钟)</label>
              <Input
                type="number"
                placeholder="30"
                value={testData.situps}
                onChange={(e) => handleInputChange('situps', e.target.value)}
                className="bg-white/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">1000米跑步(分钟)</label>
              <Input
                type="number"
                step="0.1"
                placeholder="5.5"
                value={testData.running}
                onChange={(e) => handleInputChange('running', e.target.value)}
                className="bg-white/50"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-3">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep('intro')}
          className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          返回
        </Button>
        <Button 
          onClick={calculateResults}
          disabled={!testData.age || !testData.pushups || !testData.situps || !testData.running}
          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
        >
          查看结果
        </Button>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">测试结果</h2>
        <p className="text-slate-600 text-sm">基于你的测试数据，我们为你提供以下评估</p>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">{result.category}</h3>
                <span className={`font-bold ${result.color}`}>{result.level}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">得分</span>
                  <span className="font-medium text-slate-800">{Math.round(result.score)}/100</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      result.score > 80 ? 'bg-green-500' : 
                      result.score > 60 ? 'bg-blue-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600 mt-2">{result.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-slate-800">个性化建议</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-slate-700">
            <p>• 建议每周进行3-4次有氧运动，每次30-45分钟</p>
            <p>• 加强力量训练，重点提升核心肌群</p>
            <p>• 保持良好的作息习惯，确保充足睡眠</p>
            <p>• 合理膳食，多摄入蛋白质和维生素</p>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={() => setCurrentStep('intro')}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 rounded-xl"
      >
        重新测试
      </Button>
    </div>
  );

  return (
    <div className="mobile-container min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
          <h1 className="text-slate-800 font-bold text-lg">体能测试</h1>
        </div>
      </div>

      <div className="p-4">
        {currentStep === 'intro' && renderIntro()}
        {currentStep === 'test' && renderTest()}
        {currentStep === 'results' && renderResults()}
      </div>
    </div>
  );
};

export default PhysicalTestPage;
