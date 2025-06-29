
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Trophy, Sparkles } from 'lucide-react';
import { SkillNode } from '@/hooks/useStarMap';

interface StarMapNodeCompleteProps {
  node: SkillNode;
  level: number;
  onGoToStarMap: () => void;
}

const StarMapNodeComplete: React.FC<StarMapNodeCompleteProps> = ({
  node,
  level,
  onGoToStarMap
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'psychology': return 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 text-purple-700';
      case 'health': return 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-700';
      case 'skill': return 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300 text-blue-700';
      default: return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'psychology': return '🧠';
      case 'health': return '💪';
      case 'skill': return '🎯';
      default: return '⭐';
    }
  };

  return (
    <div className="my-4 p-4 bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 border border-yellow-300 rounded-xl animate-fade-in shadow-lg backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-2">
        <Trophy className="w-5 h-5 text-yellow-600 animate-bounce" />
        <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 font-bold">🎉 恭喜！星图节点点亮</span>
        <Badge className="text-xs bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-300">
          lv{level}
        </Badge>
      </div>
      
      <div className="bg-white rounded-lg p-3 border border-yellow-300 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="text-2xl animate-bounce">
            {getCategoryIcon(node.category)}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900">{node.name}</h4>
              <Badge className={`text-xs ${getCategoryColor(node.category)} shadow-sm`}>
                {node.category === 'psychology' ? '🧠 心理' :
                 node.category === 'health' ? '💪 身体' : '🎯 技能'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{node.description}</p>
          </div>
          <Star className="w-6 h-6 text-yellow-500 fill-current animate-spin" style={{animationDuration: '2s'}} />
        </div>
      </div>
      
      <button
        onClick={onGoToStarMap}
        className="mt-3 w-full py-2 px-4 bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 hover:from-yellow-300 hover:via-orange-300 hover:to-pink-300 text-yellow-800 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 border border-yellow-300"
      >
        <span className="flex items-center justify-center space-x-2">
          <span>查看完整星图</span>
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>→</span>
        </span>
      </button>
    </div>
  );
};

export default StarMapNodeComplete;
