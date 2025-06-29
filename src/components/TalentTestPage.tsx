
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Brain, Lightbulb, Users, Target, Zap } from 'lucide-react';

interface TalentTestPageProps {
  user: { username: string };
  onBack: () => void;
}

interface Question {
  id: number;
  question: string;
  options: { text: string; trait: string }[];
}

interface TalentResult {
  trait: string;
  name: string;
  description: string;
  score: number;
  icon: any;
  color: string;
  strengths: string[];
  recommendations: string[];
}

const TalentTestPage: React.FC<TalentTestPageProps> = ({ user, onBack }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'test' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<TalentResult[]>([]);

  const questions: Question[] = [
    {
      id: 1,
      question: "在团队合作中，你更倾向于：",
      options: [
        { text: "主动承担领导角色", trait: "leadership" },
        { text: "提供创新想法和解决方案", trait: "innovation" },
        { text: "协调团队成员关系", trait: "harmony" },
        { text: "专注于执行和完成任务", trait: "execution" }
      ]
    },
    {
      id: 2,
      question: "面对压力和挑战时，你通常会：",
      options: [
        { text: "制定详细计划逐步解决", trait: "execution" },
        { text: "寻找全新的解决思路", trait: "innovation" },
        { text: "与他人讨论获得支持", trait: "harmony" },
        { text: "直面挑战勇敢承担", trait: "leadership" }
      ]
    },
    {
      id: 3,
      question: "你最享受的工作状态是：",
      options: [
        { text: "独立思考，创造新事物", trait: "innovation" },
        { text: "与人交流，建立关系", trait: "harmony" },
        { text: "指导他人，推动进展", trait: "leadership" },
        { text: "有条不紊地完成任务", trait: "execution" }
      ]
    },
    {
      id: 4,
      question: "在学习新技能时，你更喜欢：",
      options: [
        { text: "通过实践和练习掌握", trait: "execution" },
        { text: "探索背后的原理和创新应用", trait: "innovation" },
        { text: "与他人分享交流学习", trait: "harmony" },
        { text: "快速掌握并教授他人", trait: "leadership" }
      ]
    },
    {
      id: 5,
      question: "你最有成就感的时刻是：",
      options: [
        { text: "完成一个复杂的项目", trait: "execution" },
        { text: "想出一个绝妙的创意", trait: "innovation" },
        { text: "帮助他人解决问题", trait: "harmony" },
        { text: "带领团队取得成功", trait: "leadership" }
      ]
    }
  ];

  const handleAnswer = (trait: string) => {
    const newAnswers = [...answers, trait];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (answers: string[]) => {
    const traitCounts: { [key: string]: number } = {};
    
    answers.forEach(trait => {
      traitCounts[trait] = (traitCounts[trait] || 0) + 1;
    });

    const totalAnswers = answers.length;
    
    const talentResults: TalentResult[] = [
      {
        trait: 'leadership',
        name: '领导力',
        description: '天生的领导者，善于指导和激励他人',
        score: ((traitCounts.leadership || 0) / totalAnswers) * 100,
        icon: Target,
        color: 'text-gray-800',
        strengths: ['战略思维', '团队管理', '决策能力', '激励他人'],
        recommendations: ['培养沟通技巧', '学习管理理论', '参与领导力培训', '承担更多责任']
      },
      {
        trait: 'innovation',
        name: '创新思维',
        description: '富有创造力，善于发现新的解决方案',
        score: ((traitCounts.innovation || 0) / totalAnswers) * 100,
        icon: Lightbulb,
        color: 'text-gray-700',
        strengths: ['创意思维', '问题解决', '适应变化', '独立思考'],
        recommendations: ['多元化学习', '参与创新项目', '培养跨界思维', '保持好奇心']
      },
      {
        trait: 'harmony',
        name: '人际和谐',
        description: '擅长建立关系，营造和谐的团队氛围',
        score: ((traitCounts.harmony || 0) / totalAnswers) * 100,
        icon: Users,
        color: 'text-gray-700',
        strengths: ['人际关系', '团队协作', '情感智慧', '冲突调解'],
        recommendations: ['发展情商', '学习心理学知识', '参与团队建设', '培养倾听技巧']
      },
      {
        trait: 'execution',
        name: '执行力',
        description: '高效执行者，能够将想法转化为现实',
        score: ((traitCounts.execution || 0) / totalAnswers) * 100,
        icon: Zap,
        color: 'text-gray-700',
        strengths: ['计划制定', '任务执行', '时间管理', '目标达成'],
        recommendations: ['优化工作流程', '学习项目管理', '提升效率工具使用', '培养系统思维']
      }
    ];

    const sortedResults = talentResults.sort((a, b) => b.score - a.score);
    setResults(sortedResults);
    setCurrentStep('results');
  };

  const resetTest = () => {
    setCurrentStep('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setResults([]);
  };

  const renderIntro = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
          <Brain className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">优势天赋测试</h2>
        <p className="text-gray-600">
          发现你的天赋优势，了解你的潜力所在，为个人发展提供方向指引
        </p>
      </div>

      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">测试说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm text-gray-700">
            <p>• 本测试包含5个情境问题</p>
            <p>• 每个问题有4个选项，请选择最符合你的选项</p>
            <p>• 请根据真实情况作答，没有标准答案</p>
            <p>• 测试结果将帮助你了解个人优势特质</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-50 border border-gray-200">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">领导力</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 border border-gray-200">
          <CardContent className="p-4 text-center">
            <Lightbulb className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">创新思维</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 border border-gray-200">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">人际和谐</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 border border-gray-200">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">执行力</p>
          </CardContent>
        </Card>
      </div>

      <Button 
        onClick={() => setCurrentStep('test')}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 rounded-lg"
      >
        开始测试
      </Button>
    </div>
  );

  const renderTest = () => {
    const question = questions[currentQuestion];
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            问题 {currentQuestion + 1} / {questions.length}
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">{question.question}</h2>
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleAnswer(option.trait)}
              className="w-full p-4 h-auto text-left justify-start bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-700 font-medium">{String.fromCharCode(65 + index)}</span>
                </div>
                <span className="text-gray-900">{option.text}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">你的天赋优势</h2>
        <p className="text-gray-600 text-sm">基于你的回答，我们为你分析了以下优势特质</p>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index} className={`bg-white border border-gray-200 ${index === 0 ? 'ring-2 ring-gray-300' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-full ${
                  index === 0 ? 'bg-gray-900' : 'bg-gray-100'
                } flex items-center justify-center`}>
                  <result.icon className={`w-6 h-6 ${index === 0 ? 'text-white' : 'text-gray-700'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-gray-900">{result.name}</h3>
                    {index === 0 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full font-medium">
                        主要优势
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{result.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">匹配度</span>
                    <span className={`font-bold ${result.color}`}>{Math.round(result.score)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-gray-900' : 'bg-gray-600'
                      }`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                </div>
              </div>

              {index === 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">核心优势</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.strengths.map((strength, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">发展建议</h4>
                    <div className="space-y-1">
                      {result.recommendations.map((rec, i) => (
                        <p key={i} className="text-sm text-gray-600">• {rec}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-50 border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">个性化成长路径</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• 专注发展你的主要优势: <strong>{results[0]?.name}</strong></p>
            <p>• 寻找能发挥你优势的工作机会和项目</p>
            <p>• 与具有互补优势的人合作</p>
            <p>• 持续学习，将优势转化为专业技能</p>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={resetTest}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg"
      >
        重新测试
      </Button>
    </div>
  );

  return (
    <div className="mobile-container min-h-screen bg-gray-50">
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
          <h1 className="text-gray-900 font-bold text-lg">优势天赋测试</h1>
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

export default TalentTestPage;
