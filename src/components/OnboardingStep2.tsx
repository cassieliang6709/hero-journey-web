
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

interface OnboardingStep2Props {
  selectedIdeas: string[];
  onSelectIdea: (idea: string) => void;
  onNext: () => void;
}

const ideas = [
  "裤子又穿不上了",
  "最近又胖了", 
  "最近找不到工作很烦！！",
  "我有一些健康上的困恼",
  "感觉身体好差，没有精力",
  "心情低落"
];

const OnboardingStep2: React.FC<OnboardingStep2Props> = ({ 
  selectedIdeas, 
  onSelectIdea, 
  onNext 
}) => {
  return (
    <div className="mobile-container gradient-bg p-6">
      <div className="animate-slide-in-right">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          说说你最近的想法
        </h1>
        <p className="text-gray-300 text-center mb-8">
          选择那些让你有共鸣的想法
        </p>
        
        <div className="space-y-3 mb-24">
          {ideas.map((idea, index) => (
            <Card 
              key={index}
              className={`p-4 cursor-pointer transition-all duration-200 ${
                selectedIdeas.includes(idea)
                  ? 'bg-white border-hero-500 scale-105 shadow-lg'
                  : 'glass-effect hover:bg-white/15'
              }`}
              onClick={() => onSelectIdea(idea)}
            >
              <div className="flex items-center justify-between">
                <span className={`${
                  selectedIdeas.includes(idea) 
                    ? 'text-gray-800 font-medium' 
                    : 'text-white'
                }`}>
                  {idea}
                </span>
                {selectedIdeas.includes(idea) && (
                  <span className="text-hero-500 text-xl font-bold">✓</span>
                )}
              </div>
            </Card>
          ))}
        </div>
        
        {/* 购物车 */}
        <div className="fixed bottom-20 left-6 right-6">
          <div className="relative">
            <div className="absolute left-4 top-4 bg-hero-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold z-10 animate-bounce-in">
              {selectedIdeas.length}
            </div>
            <Card className="glass-effect p-4 pl-16">
              <div className="flex items-center text-white">
                <ShoppingCart className="w-6 h-6 mr-3" />
                <span>已选择 {selectedIdeas.length} 个想法</span>
              </div>
            </Card>
          </div>
        </div>
        
        {/* 底部按钮 */}
        <div className="fixed bottom-6 left-6 right-6">
          <Button 
            onClick={onNext}
            disabled={selectedIdeas.length === 0}
            className="w-full hero-gradient text-white font-semibold h-12 text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            我选好了！
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep2;
