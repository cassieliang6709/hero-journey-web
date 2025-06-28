
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface OnboardingStep3Props {
  selectedAvatar: number;
  onChangeAvatar: () => void;
  onComplete: () => void;
  username: string;
}

const avatars = ['🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '👑', '⚡', '🔥', '🌟'];
const avatarNames = ['超级英雄', '女超人', '魔法师', '女巫', '王者', '闪电侠', '火焰战士', '星光守护者'];

const OnboardingStep3: React.FC<OnboardingStep3Props> = ({ 
  selectedAvatar, 
  onChangeAvatar, 
  onComplete,
  username 
}) => {
  return (
    <div className="mobile-container gradient-bg flex flex-col items-center justify-center p-8 text-center">
      <div className="animate-slide-in-left">
        <h1 className="text-2xl font-bold text-white mb-4">
          你的英雄形象
        </h1>
        <p className="text-gray-300 mb-8">
          {username}，这就是你的英雄化身
        </p>
        
        <div className="relative mb-8">
          <div className="w-48 h-48 mx-auto hero-gradient rounded-full flex items-center justify-center animate-pulse-glow mb-4">
            <span className="text-8xl">{avatars[selectedAvatar]}</span>
          </div>
          
          {/* 切换按钮 */}
          <button
            onClick={onChangeAvatar}
            className="absolute bottom-2 right-8 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
        
        <h2 className="text-xl font-semibold text-hero-400 mb-2">
          {avatarNames[selectedAvatar]}
        </h2>
        <p className="text-gray-400 mb-12">
          准备好开始你的英雄之旅了吗？
        </p>
        
        <Button 
          onClick={onComplete}
          className="w-full max-w-xs hero-gradient text-white font-semibold h-12 text-lg hover:scale-105 transition-transform"
        >
          启程！
        </Button>
      </div>
    </div>
  );
};

export default OnboardingStep3;
