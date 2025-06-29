
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingUp, Target, CheckCircle, Circle } from 'lucide-react';
import { useStarMapAnalysis } from '@/hooks/useStarMapAnalysis';
import { useTodos } from '@/hooks/useTodos';

interface CategoryDetailPageProps {
  categoryId: string;
  categoryName: string;
  onBack: () => void;
}

const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({ 
  categoryId, 
  categoryName, 
  onBack 
}) => {
  const { analysis, generateCategoryAnalysis } = useStarMapAnalysis();
  const { getNodeCompletionStats } = useTodos();
  const [categoryData, setCategoryData] = useState<any>(null);

  useEffect(() => {
    const loadCategoryData = async () => {
      const analysisData = await generateCategoryAnalysis();
      const currentCategory = analysisData.find(cat => cat.category === categoryId);
      setCategoryData(currentCategory);
    };
    
    loadCategoryData();
  }, [categoryId, generateCategoryAnalysis]);

  const getNodesByCategory = (categoryId: string) => {
    const nodeMapping = {
      psychology: [
        { id: 'psychology-emotion', name: '情绪管理' },
        { id: 'psychology-thinking', name: '思维模式' },
        { id: 'psychology-confidence', name: '自信建立' },
        { id: 'psychology-stress', name: '压力管理' }
      ],
      health: [
        { id: 'health-exercise', name: '运动锻炼' },
        { id: 'health-diet', name: '饮食管理' },
        { id: 'health-sleep', name: '睡眠优化' },
        { id: 'health-weight', name: '体重管理' },
        { id: 'health-fitness', name: '体能提升' }
      ],
      skill: [
        { id: 'skill-interview', name: '面试技巧' },
        { id: 'skill-communication', name: '沟通能力' },
        { id: 'skill-career', name: '职业规划' },
        { id: 'skill-resume', name: '简历优化' },
        { id: 'skill-etiquette', name: '职场礼仪' }
      ]
    };
    
    return nodeMapping[categoryId as keyof typeof nodeMapping] || [];
  };

  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStrengthText = (level: string) => {
    switch (level) {
      case 'high': return '优秀';
      case 'medium': return '良好';
      case 'low': return '需提升';
      default: return '未知';
    }
  };

  if (!categoryData) {
    return (
      <div className="mobile-container min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  const nodes = getNodesByCategory(categoryId);
  const completionRate = categoryData.totalTasks > 0 ? 
    Math.round((categoryData.completedTasks / categoryData.totalTasks) * 100) : 0;

  return (
    <div className="mobile-container min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-900 p-0 hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-gray-900 font-bold text-lg">{categoryName}</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 综合评估卡片 */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-gray-700" />
              <span>综合评估</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">整体水平</span>
              <Badge className={`${getStrengthColor(categoryData.strengthLevel)} border-0`}>
                {getStrengthText(categoryData.strengthLevel)}
              </Badge>
            </div>
            
            {categoryData.testScore && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">测试得分</span>
                <span className="text-gray-900 font-semibold">{categoryData.testScore}/100</span>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">任务完成率</span>
                <span className="text-gray-900 font-semibold">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {categoryData.description}
            </div>
          </CardContent>
        </Card>

        {/* 各节点详情 */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-gray-700" />
              <span>能力节点</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nodes.map((node) => {
              const nodeStats = getNodeCompletionStats(node.id);
              const nodeCompletionRate = nodeStats.total > 0 ? 
                Math.round((nodeStats.completed / nodeStats.total) * 100) : 0;
              
              return (
                <div key={node.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {nodeStats.completed > 0 ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{node.name}</div>
                      <div className="text-sm text-gray-500">
                        已完成 {nodeStats.completed}/{nodeStats.total} 个任务
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{nodeCompletionRate}%</div>
                    <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gray-700 transition-all duration-300"
                        style={{ width: `${nodeCompletionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* 发展建议 */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">发展建议</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categoryData.recommendations.map((recommendation: string, index: number) => (
                <div key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryDetailPage;
