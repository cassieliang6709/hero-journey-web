
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
      <div className="animate-bounce-in">
        <div className="w-32 h-32 mx-auto mb-8 hero-gradient rounded-full flex items-center justify-center animate-pulse-glow">
          <span className="text-6xl">✨</span>
        </div>
      </div>
      
      {showContent && (
        <div className="animate-fade-in space-y-6">
          <h1 className="text-3xl font-bold text-white mb-4">
            欢迎，{username}！
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            每个人心中都住着一个英雄
            <br />
            现在是时候唤醒你的英雄之魂了
          </p>
          <div className="space-y-4 text-gray-400">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🎯</span>
              <span>发现内在动力</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🚀</span>
              <span>制定行动计划</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">⭐</span>
              <span>成就更好的自己</span>
            </div>
          </div>
          <Button 
            onClick={onNext}
            className="w-full max-w-xs hero-gradient text-white font-semibold h-12 text-lg hover:scale-105 transition-transform mt-8"
          >
            开始探索
          </Button>
        </div>
      )}
    </div>
  );
};

export default OnboardingStep1;
