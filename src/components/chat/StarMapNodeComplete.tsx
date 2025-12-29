
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Trophy } from 'lucide-react';
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
      case 'psychology': return 'bg-purple-100 border-purple-300 text-purple-700';
      case 'health': return 'bg-green-100 border-green-300 text-green-700';
      case 'skill': return 'bg-blue-100 border-blue-300 text-blue-700';
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
    <div className="my-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg animate-fade-in">
      <div className="flex items-center space-x-2 mb-2">
        <Trophy className="w-5 h-5 text-yellow-600" />
        <span className="text-yellow-800 font-semibold">🎉 恭喜！星图节点点亮</span>
        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
          lv{level}
        </Badge>
      </div>
      
      <div className="bg-white rounded-lg p-3 border border-yellow-200">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {getCategoryIcon(node.category)}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900">{node.name}</h4>
              <Badge className={`text-xs ${getCategoryColor(node.category)}`}>
                {node.category === 'psychology' ? '心理' :
                 node.category === 'health' ? '身体' : '技能'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{node.description}</p>
          </div>
          <Star className="w-6 h-6 text-yellow-500 fill-current" />
        </div>
      </div>
      
      <button
        onClick={onGoToStarMap}
        className="mt-3 w-full py-2 px-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-sm font-medium transition-colors duration-200"
      >
        查看完整星图 →
      </button>
    </div>
  );
};

export default StarMapNodeComplete;
