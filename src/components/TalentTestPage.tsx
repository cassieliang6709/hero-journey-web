import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Lightbulb, Users, Target, Zap } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

interface TalentTestPageProps {
  user: { username: string };
  onBack: () => void;
}

const TalentTestPage: React.FC<TalentTestPageProps> = ({ user, onBack }) => {
  const { t } = useTranslation('tests');
  const [currentStep, setCurrentStep] = useState<'intro' | 'test' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);

  const questions = [
    { id: 1, key: 'q1', options: ['q1o1', 'q1o2', 'q1o3', 'q1o4'], traits: ['leadership', 'innovation', 'harmony', 'execution'] },
    { id: 2, key: 'q2', options: ['q2o1', 'q2o2', 'q2o3', 'q2o4'], traits: ['execution', 'innovation', 'harmony', 'leadership'] },
    { id: 3, key: 'q3', options: ['q3o1', 'q3o2', 'q3o3', 'q3o4'], traits: ['innovation', 'harmony', 'leadership', 'execution'] },
    { id: 4, key: 'q4', options: ['q4o1', 'q4o2', 'q4o3', 'q4o4'], traits: ['execution', 'innovation', 'harmony', 'leadership'] },
    { id: 5, key: 'q5', options: ['q5o1', 'q5o2', 'q5o3', 'q5o4'], traits: ['execution', 'innovation', 'harmony', 'leadership'] }
  ];

  const traitIcons = { leadership: Target, innovation: Lightbulb, harmony: Users, execution: Zap };

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
    const counts: Record<string, number> = {};
    answers.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
    const total = answers.length;
    
    const talentResults = ['leadership', 'innovation', 'harmony', 'execution'].map(trait => ({
      trait,
      name: t(`talent.traits.${trait}`),
      description: t(`talent.traits.${trait}Desc`),
      score: ((counts[trait] || 0) / total) * 100,
      icon: traitIcons[trait as keyof typeof traitIcons],
      strengths: t(`talent.traits.${trait}Strengths`, { returnObjects: true }) as string[],
      recommendations: t(`talent.traits.${trait}Recommendations`, { returnObjects: true }) as string[]
    })).sort((a, b) => b.score - a.score);

    setResults(talentResults);
    setCurrentStep('results');
  };

  const resetTest = () => { setCurrentStep('intro'); setCurrentQuestion(0); setAnswers([]); setResults([]); };

  const renderIntro = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
          <Brain className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t('talent.title')}</h2>
        <p className="text-gray-600">{t('talent.intro')}</p>
      </div>
      <Card className="bg-white border border-gray-200">
        <CardHeader><CardTitle className="text-gray-900">{t('talent.testDescription')}</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <p>• {t('talent.instruction1')}</p>
          <p>• {t('talent.instruction2')}</p>
          <p>• {t('talent.instruction3')}</p>
          <p>• {t('talent.instruction4')}</p>
        </CardContent>
      </Card>
      <Button onClick={() => setCurrentStep('test')} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 rounded-lg">
        {t('talent.startTest')}
      </Button>
    </div>
  );

  const renderTest = () => {
    const q = questions[currentQuestion];
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-gray-900 h-2 rounded-full" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
          </div>
          <p className="text-sm text-gray-600 mb-2">{t('talent.question')} {currentQuestion + 1} / {questions.length}</p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t(`talent.questions.${q.key}`)}</h2>
        </div>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <Button key={i} variant="outline" onClick={() => handleAnswer(q.traits[i])} className="w-full p-4 h-auto text-left justify-start bg-white border-gray-200 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-700 font-medium">{String.fromCharCode(65 + i)}</span>
                </div>
                <span className="text-gray-900">{t(`talent.questions.${opt}`)}</span>
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
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t('talent.yourTalents')}</h2>
        <p className="text-gray-600 text-sm">{t('talent.talentResultsIntro')}</p>
      </div>
      <div className="space-y-4">
        {results.map((r, i) => (
          <Card key={i} className={`bg-white border border-gray-200 ${i === 0 ? 'ring-2 ring-gray-300' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-full ${i === 0 ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center`}>
                  <r.icon className={`w-6 h-6 ${i === 0 ? 'text-white' : 'text-gray-700'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-gray-900">{r.name}</h3>
                    {i === 0 && <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full font-medium">{t('talent.primaryAdvantage')}</span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{r.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('talent.matchRate')}</span>
                    <span className="font-bold text-gray-800">{Math.round(r.score)}%</span>
                  </div>
                </div>
              </div>
              {i === 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('talent.coreStrengths')}</h4>
                    <div className="flex flex-wrap gap-2">{r.strengths.map((s: string, j: number) => <span key={j} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{s}</span>)}</div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('talent.developmentAdvice')}</h4>
                    {r.recommendations.map((rec: string, j: number) => <p key={j} className="text-sm text-gray-600">• {rec}</p>)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={resetTest} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg">{t('talent.retakeTest')}</Button>
    </div>
  );

  return (
    <div className="mobile-container min-h-screen bg-gray-50">
      <PageHeader title={t('talent.title')} onBack={onBack} />
      <div className="p-4">
        {currentStep === 'intro' && renderIntro()}
        {currentStep === 'test' && renderTest()}
        {currentStep === 'results' && renderResults()}
      </div>
    </div>
  );
};

export default TalentTestPage;
