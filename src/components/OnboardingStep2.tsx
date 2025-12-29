import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface OnboardingStep2Props {
  selectedIdeas: string[];
  onSelectIdea: (idea: string) => void;
  onNext: () => void;
}

const OnboardingStep2: React.FC<OnboardingStep2Props> = ({ 
  selectedIdeas, 
  onSelectIdea, 
  onNext 
}) => {
  const { t } = useTranslation('onboarding');
  
  const ideaKeys = [
    'energy', 'job', 'money', 'health', 'noAnxiety', 'product', 'partner',
    'control', 'newIndustry', 'confident', 'passion', 'stress', 'refuse', 'freedom'
  ];
  
  const [currentPage, setCurrentPage] = useState(0);
  const ideasPerPage = 4;
  const totalPages = Math.ceil(ideaKeys.length / ideasPerPage);
  
  const getCurrentIdeas = () => {
    const startIndex = currentPage * ideasPerPage;
    return ideaKeys.slice(startIndex, startIndex + ideasPerPage);
  };
  
  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const currentIdeaKeys = getCurrentIdeas();

  return (
    <div className="mobile-container gradient-bg p-6">
      <div className="animate-slide-in-right z-10 relative">
        <h1 className="text-2xl font-bold text-white text-center mb-2 drop-shadow-lg">
          {t('step2.title')}
        </h1>
        <p className="text-gray-200 text-center mb-8 drop-shadow-md">
          {t('step2.subtitle')}
        </p>
        
        <div className="space-y-3 mb-24">
          {currentIdeaKeys.map((ideaKey, index) => {
            const ideaText = t(`step2.ideas.${ideaKey}`);
            return (
              <Card 
                key={`${currentPage}-${index}`}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedIdeas.includes(ideaText)
                    ? 'bg-white/90 border-orange-400 scale-105 shadow-lg backdrop-blur-sm'
                    : 'glass-effect hover:bg-white/20 border-white/30 text-white'
                }`}
                onClick={() => onSelectIdea(ideaText)}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    selectedIdeas.includes(ideaText) ? 'text-gray-800' : 'text-white drop-shadow-sm'
                  }`}>
                    {ideaText}
                  </span>
                  {selectedIdeas.includes(ideaText) && (
                    <span className="text-orange-500 text-xl font-bold">✓</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
        
        {/* Shuffle button */}
        <div className="fixed bottom-40 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            onClick={handleNextPage}
            variant="outline"
            className="w-[200px] glass-effect border-white/30 text-white hover:bg-white/20 font-medium transition-all duration-200 hover:scale-105"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('step2.shuffle')} ({currentPage + 1}/{totalPages})
          </Button>
        </div>
        
        {/* Bottom button */}
        <div className="fixed bottom-6 left-6 right-6 z-10">
          <Button 
            onClick={onNext}
            disabled={selectedIdeas.length === 0}
            className="w-full hero-gradient text-white font-semibold h-12 text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {t('step2.ready')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep2;
