import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface OnboardingStep1Props {
  onNext: () => void;
  username: string;
}

const OnboardingStep1: React.FC<OnboardingStep1Props> = ({ onNext, username }) => {
  const { t } = useTranslation('onboarding');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mobile-container gradient-bg flex flex-col items-center justify-center p-8 text-center">   
      {showContent && (
        <div className="animate-fade-in space-y-6 z-10 relative">
          <div className="space-y-4 text-gray-200 leading-relaxed">
            <p className="text-lg drop-shadow-md">
              {t('step1.line1')}
            </p>
            <p className="text-lg drop-shadow-md">
              {t('step1.line2')}
            </p> 
            <p className="text-lg drop-shadow-md">
              {t('step1.line3')}
            </p>
            <p className="text-lg drop-shadow-md">
              {t('step1.line4')}
            </p>
            <p className="text-xl font-semibold text-orange-300 mt-6 drop-shadow-lg">
              {t('step1.slogan')}
            </p>
          </div>
          <Button 
            onClick={onNext}
            className="w-full max-w-xs hero-gradient text-white font-semibold h-12 text-lg hover:scale-105 transition-transform mt-8 shadow-lg"
          >
            {t('step1.startExplore')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OnboardingStep1;
