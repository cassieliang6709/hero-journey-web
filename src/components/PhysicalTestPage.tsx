import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Activity, Heart, Zap, Target } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

interface PhysicalTestPageProps {
  user: { username: string };
  onBack: () => void;
}

interface TestResult {
  category: string;
  categoryKey: string;
  score: number;
  level: string;
  levelKey: string;
  recommendation: string;
  recommendationKey: string;
  color: string;
}

const PhysicalTestPage: React.FC<PhysicalTestPageProps> = ({ user, onBack }) => {
  const { t } = useTranslation('tests');
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
    const age = parseInt(testData.age);
    const pushups = parseInt(testData.pushups);
    const situps = parseInt(testData.situps);
    const running = parseFloat(testData.running);
    
    const results: TestResult[] = [
      {
        category: t('physical.categories.upperStrength'),
        categoryKey: 'upperStrength',
        score: Math.min(100, Math.max(0, (pushups / (age < 30 ? 30 : 25)) * 100)),
        level: pushups > 20 ? t('physical.levels.excellent') : pushups > 15 ? t('physical.levels.good') : pushups > 10 ? t('physical.levels.average') : t('physical.levels.needsImprovement'),
        levelKey: pushups > 20 ? 'excellent' : pushups > 15 ? 'good' : pushups > 10 ? 'average' : 'needsImprovement',
        recommendation: pushups > 20 ? t('physical.recommendations.maintain') : t('physical.recommendations.morePushups'),
        recommendationKey: pushups > 20 ? 'maintain' : 'morePushups',
        color: pushups > 20 ? 'text-gray-800' : pushups > 15 ? 'text-gray-700' : 'text-gray-600'
      },
      {
        category: t('physical.categories.coreStrength'),
        categoryKey: 'coreStrength',
        score: Math.min(100, Math.max(0, (situps / (age < 30 ? 40 : 35)) * 100)),
        level: situps > 30 ? t('physical.levels.excellent') : situps > 20 ? t('physical.levels.good') : situps > 15 ? t('physical.levels.average') : t('physical.levels.needsImprovement'),
        levelKey: situps > 30 ? 'excellent' : situps > 20 ? 'good' : situps > 15 ? 'average' : 'needsImprovement',
        recommendation: situps > 30 ? t('physical.recommendations.maintain') : t('physical.recommendations.moreAbs'),
        recommendationKey: situps > 30 ? 'maintain' : 'moreAbs',
        color: situps > 30 ? 'text-gray-800' : situps > 20 ? 'text-gray-700' : 'text-gray-600'
      },
      {
        category: t('physical.categories.cardio'),
        categoryKey: 'cardio',
        score: Math.min(100, Math.max(0, (1 / running) * 100)),
        level: running < 6 ? t('physical.levels.excellent') : running < 8 ? t('physical.levels.good') : running < 10 ? t('physical.levels.average') : t('physical.levels.needsImprovement'),
        levelKey: running < 6 ? 'excellent' : running < 8 ? 'good' : running < 10 ? 'average' : 'needsImprovement',
        recommendation: running < 6 ? t('physical.recommendations.maintain') : t('physical.recommendations.moreCardio'),
        recommendationKey: running < 6 ? 'maintain' : 'moreCardio',
        color: running < 6 ? 'text-gray-800' : running < 8 ? 'text-gray-700' : 'text-gray-600'
      }
    ];

    setResults(results);
    setCurrentStep('results');
  };

  const renderIntro = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
          <Activity className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t('physical.title')}</h2>
        <p className="text-gray-600">{t('physical.intro')}</p>
      </div>

      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">{t('physical.testIncludes')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('physical.cardioEndurance')}</p>
              <p className="text-sm text-gray-600">{t('physical.cardioDesc')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('physical.muscleStrength')}</p>
              <p className="text-sm text-gray-600">{t('physical.muscleDesc')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('physical.flexibility')}</p>
              <p className="text-sm text-gray-600">{t('physical.flexibilityDesc')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={() => setCurrentStep('test')}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 rounded-lg"
      >
        {t('physical.startTest')}
      </Button>
    </div>
  );

  const renderTest = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t('physical.fillData')}</h2>
        <p className="text-gray-600 text-sm">{t('physical.fillDataHint')}</p>
      </div>

      <div className="space-y-4">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 text-lg">{t('physical.basicInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('physical.age')}</label>
                <Input
                  type="number"
                  placeholder="25"
                  value={testData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('physical.weight')}</label>
                <Input
                  type="number"
                  placeholder="65"
                  value={testData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="border-gray-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('physical.height')}</label>
              <Input
                type="number"
                placeholder="170"
                value={testData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className="border-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 text-lg">{t('physical.fitnessTest')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('physical.pushups')}</label>
              <Input
                type="number"
                placeholder="20"
                value={testData.pushups}
                onChange={(e) => handleInputChange('pushups', e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('physical.situps')}</label>
              <Input
                type="number"
                placeholder="30"
                value={testData.situps}
                onChange={(e) => handleInputChange('situps', e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('physical.runningTime')}</label>
              <Input
                type="number"
                step="0.1"
                placeholder="5.5"
                value={testData.running}
                onChange={(e) => handleInputChange('running', e.target.value)}
                className="border-gray-300"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-3">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep('intro')}
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          {t('physical.back')}
        </Button>
        <Button 
          onClick={calculateResults}
          disabled={!testData.age || !testData.pushups || !testData.situps || !testData.running}
          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
        >
          {t('physical.viewResults')}
        </Button>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t('physical.testResults')}</h2>
        <p className="text-gray-600 text-sm">{t('physical.resultsIntro')}</p>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index} className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{result.category}</h3>
                <span className={`font-bold ${result.color}`}>{result.level}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('physical.score')}</span>
                  <span className="font-medium text-gray-900">{Math.round(result.score)}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      result.score > 80 ? 'bg-gray-800' : 
                      result.score > 60 ? 'bg-gray-600' : 'bg-gray-400'
                    }`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">{result.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-50 border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">{t('physical.personalizedAdvice')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• {t('physical.advice1')}</p>
            <p>• {t('physical.advice2')}</p>
            <p>• {t('physical.advice3')}</p>
            <p>• {t('physical.advice4')}</p>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={() => setCurrentStep('intro')}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg"
      >
        {t('physical.retakeTest')}
      </Button>
    </div>
  );

  return (
    <div className="mobile-container min-h-screen bg-gray-50">
      <PageHeader 
        title={t('physical.title')} 
        onBack={onBack} 
      />

      <div className="p-4">
        {currentStep === 'intro' && renderIntro()}
        {currentStep === 'test' && renderTest()}
        {currentStep === 'results' && renderResults()}
      </div>
    </div>
  );
};

export default PhysicalTestPage;
