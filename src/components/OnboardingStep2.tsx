
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface OnboardingStep2Props {
  selectedIdeas: string[];
  onSelectIdea: (idea: string) => void;
  onNext: () => void;
}

const ideas = [
  "我想变得更有活力",
  "我想找到符合心意的工作", 
  "我想存下许多钱",
  "我想让身体更健康"
];

const OnboardingStep2: React.FC<OnboardingStep2Props> = ({ 
  selectedIdeas, 
  onSelectIdea, 
  onNext 
}) => {
  return (
    <div className="mobile-container gradient-bg p-6">
      <div className="animate-slide-in-right z-10 relative">
        <h1 className="text-2xl font-bold text-white text-center mb-2 drop-shadow-lg">
          那么，无名的英雄
        </h1>
        <p className="text-gray-200 text-center mb-8 drop-shadow-md">
          此刻的你拥有哪些想象？
        </p>
        
        <div className="space-y-3 mb-24">
          {ideas.map((idea, index) => (
            <Card 
              key={index}
              className={`p-4 cursor-pointer transition-all duration-200 ${
                selectedIdeas.includes(idea)
                  ? 'bg-white/90 border-orange-400 scale-105 shadow-lg backdrop-blur-sm'
                  : 'glass-effect hover:bg-white/20 border-white/30 text-white'
              }`}
              onClick={() => onSelectIdea(idea)}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${
                  selectedIdeas.includes(idea) ? 'text-gray-800' : 'text-white drop-shadow-sm'
                }`}>
                  {idea}
                </span>
                {selectedIdeas.includes(idea) && (
                  <span className="text-orange-500 text-xl font-bold">✓</span>
                )}
              </div>
            </Card>
          ))}
        </div>
        
        {/* 选择计数和鼓励文字 */}
        <div className="fixed bottom-32 left-6 right-6 z-10">
          <div className="relative">
            <div className="absolute left-4 top-4 hero-gradient text-white rounded-full w-8 h-8 flex items-center justify-center font-bold z-10 animate-bounce-in shadow-lg">
              {selectedIdeas.length}
            </div>
            <Card className="glass-effect p-4 pl-16">
              <div className="flex items-center text-white">
                <Heart className="w-6 h-6 mr-3 text-orange-300" />
                <span className="drop-shadow-sm">每次微小期许，请相信，这会成为我们向前的力量</span>
              </div>
            </Card>
          </div>
        </div>
        
        {/* 底部按钮 */}
        <div className="fixed bottom-6 left-6 right-6 z-10">
          <Button 
            onClick={onNext}
            disabled={selectedIdeas.length === 0}
            className="w-full hero-gradient text-white font-semibold h-12 text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            我已准备好！
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep2;
