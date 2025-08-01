
import React from 'react';
import { Button } from '@/components/ui/button';

interface OnboardingStep3Props {
  onComplete: () => void;
  username: string;
}

const OnboardingStep3: React.FC<OnboardingStep3Props> = ({ 
  onComplete,
  username 
}) => {
  return (
    <div className="mobile-container gradient-bg flex flex-col items-center justify-center p-8 text-center">
      <div className="animate-slide-in-left z-10 relative">          
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold text-orange-300 drop-shadow-lg">
            你听说过"星图"吗？
          </h2>
          <div className="space-y-3 text-gray-200 leading-relaxed">
            <p className="text-lg drop-shadow-md">它将是你的英雄之路</p>
            <p className="text-lg drop-shadow-md">从这里开始，我将与你一起找到答案</p>
          </div>
        </div>
      </div>
        
      <Button 
        onClick={onComplete}
        className="w-full max-w-xs hero-gradient text-white font-semibold h-12 text-lg hover:scale-105 transition-transform shadow-lg mt-8"
      >
        启程！
      </Button>
    </div>
  );
};

export default OnboardingStep3;
