import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface OnboardingStep3Props {
  onComplete: () => void;
  username: string;
}

const OnboardingStep3: React.FC<OnboardingStep3Props> = ({ 
  onComplete,
  username 
}) => {
  const { t } = useTranslation('onboarding');
  
  return (
    <div className="mobile-container gradient-bg flex flex-col items-center justify-center p-8 text-center">
      <div className="animate-slide-in-left z-10 relative">          
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold text-orange-300 drop-shadow-lg">
            {t('step3.starMapIntro')}
          </h2>
          <div className="space-y-3 text-gray-200 leading-relaxed">
            <p className="text-lg drop-shadow-md">{t('step3.heroPath')}</p>
            <p className="text-lg drop-shadow-md">{t('step3.findAnswer')}</p>
          </div>
        </div>
      </div>
        
      <Button 
        onClick={onComplete}
        className="w-full max-w-xs hero-gradient text-white font-semibold h-12 text-lg hover:scale-105 transition-transform shadow-lg mt-8"
      >
        {t('step3.embark')}
      </Button>
    </div>
  );
};

export default OnboardingStep3;
