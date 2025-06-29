
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface OnboardingStep1Props {
  onNext: () => void;
  username: string;
}

const OnboardingStep1: React.FC<OnboardingStep1Props> = ({ onNext, username }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mobile-container gradient-bg flex flex-col items-center justify-center p-8 text-center">
      <div className="animate-bounce-in z-10 relative">
        <div className="w-32 h-32 mx-auto mb-8 hero-gradient rounded-full flex items-center justify-center animate-pulse-glow">
          <span className="text-6xl">🌟</span>
        </div>
      </div>
      
      {showContent && (
        <div className="animate-fade-in space-y-6 z-10 relative">
          <div className="space-y-4 text-gray-200 leading-relaxed">
            <p className="text-lg drop-shadow-md">
              我们如同散落的星尘，漂浮在数据的海洋。
            </p>
            <p className="text-lg drop-shadow-md">
              每个人内心都潜藏着英雄，但现实让我们迷失方向。
            </p>
            <p className="text-xl font-semibold text-orange-300 mt-6 drop-shadow-lg">
              Becoming——成长，值得重新想象
            </p>
          </div>
          <Button 
            onClick={onNext}
            className="w-full max-w-xs hero-gradient text-white font-semibold h-12 text-lg hover:scale-105 transition-transform mt-8 shadow-lg"
          >
            开始探索
          </Button>
        </div>
      )}
    </div>
  );
};

export default OnboardingStep1;
