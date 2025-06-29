
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
        <div className="space-y-4 mb-8">
          <h1 className="text-2xl font-bold text-white">
            你听说过"星图"吗？
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            它将是你的英雄之路
            <br />
            从这里开始，我将与你一起找到答案
          </p>
        </div>
        
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
        <div className="space-y-2 text-gray-400 mb-8">
          <p>我是谁？</p>
          <p>我不记得了</p>
          <p>但是我相信随着星图的点亮</p>
          <p>我们都能找回自己</p>
        </div>
        
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
