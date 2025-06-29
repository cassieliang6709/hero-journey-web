
import { useState, useCallback } from 'react';
import { useTodos } from './useTodos';
import { useTestResults } from './useTestResults';

interface CategoryAnalysis {
  category: string;
  name: string;
  strengthLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  completedTasks: number;
  totalTasks: number;
  testScore?: number;
  description: string;
}

export const useStarMapAnalysis = () => {
  const { getCategoryCompletionStats } = useTodos();
  const { physicalTestResults, talentTestResults } = useTestResults();
  
  const [analysis, setAnalysis] = useState<CategoryAnalysis[]>([]);

  const generateCategoryAnalysis = useCallback(async (): Promise<CategoryAnalysis[]> => {
    const categories = [
      {
        id: 'psychology',
        name: '心理优势',
        nodes: ['psychology-emotion', 'psychology-thinking', 'psychology-confidence', 'psychology-stress']
      },
      {
        id: 'health', 
        name: '身体健康',
        nodes: ['health-exercise', 'health-diet', 'health-sleep', 'health-weight', 'health-fitness']
      },
      {
        id: 'skill',
        name: '技能发展',
        nodes: ['skill-interview', 'skill-communication', 'skill-career', 'skill-resume', 'skill-etiquette']
      }
    ];

    const analysisResults: CategoryAnalysis[] = [];

    for (const category of categories) {
      const stats = getCategoryCompletionStats(category.id);
      let testScore: number | undefined;
      let strengthLevel: 'low' | 'medium' | 'high' = 'medium';
      let recommendations: string[] = [];

      // 根据测试结果调整分析
      if (category.id === 'health' && physicalTestResults.length > 0) {
        const latestTest = physicalTestResults[0];
        testScore = latestTest.overall_score;
        strengthLevel = testScore >= 80 ? 'high' : testScore >= 60 ? 'medium' : 'low';
        recommendations = latestTest.recommendations || [];
      } else if (category.id === 'psychology' && talentTestResults.length > 0) {
        const latestTest = talentTestResults[0];
        // 根据主要天赋判断心理优势
        const talentScores = [
          latestTest.leadership_score,
          latestTest.innovation_score,
          latestTest.harmony_score,
          latestTest.execution_score
        ];
        testScore = Math.max(...talentScores);
        strengthLevel = testScore >= 80 ? 'high' : testScore >= 60 ? 'medium' : 'low';
        recommendations = latestTest.recommendations || [];
      }

      // 根据任务完成情况调整
      if (stats.completed > 0) {
        const completionRate = stats.completed / Math.max(stats.total, 1);
        if (completionRate >= 0.8) {
          strengthLevel = 'high';
        } else if (completionRate >= 0.5) {
          strengthLevel = strengthLevel === 'low' ? 'medium' : strengthLevel;
        }
      }

      const categoryAnalysis: CategoryAnalysis = {
        category: category.id,
        name: category.name,
        strengthLevel,
        recommendations: recommendations.length > 0 ? recommendations : getDefaultRecommendations(category.id, strengthLevel),
        completedTasks: stats.completed,
        totalTasks: stats.total,
        testScore,
        description: getCategoryDescription(category.id, strengthLevel, stats)
      };

      analysisResults.push(categoryAnalysis);
    }

    setAnalysis(analysisResults);
    return analysisResults;
  }, [getCategoryCompletionStats, physicalTestResults, talentTestResults]);

  const getDefaultRecommendations = (categoryId: string, level: 'low' | 'medium' | 'high'): string[] => {
    const recommendations = {
      psychology: {
        low: ['建议先从情绪识别开始练习', '培养积极的思维习惯', '寻求专业心理指导'],
        medium: ['继续加强心理技能训练', '尝试更多压力管理技巧', '保持良好的心理状态'],
        high: ['保持现有的心理优势', '可以帮助他人提升心理素质', '探索更高层次的心理成长']
      },
      health: {
        low: ['从基础运动开始', '调整饮食结构', '建立规律作息'],
        medium: ['增加运动强度', '优化营养搭配', '提升整体体能'],
        high: ['保持现有健康水平', '可以尝试更具挑战性的运动', '分享健康经验']
      },
      skill: {
        low: ['从基础技能开始学习', '多参与实践机会', '寻求导师指导'],
        medium: ['提升专业技能水平', '增加实战经验', '扩展技能范围'],
        high: ['发挥技能优势', '承担更多责任', '指导他人技能发展']
      }
    };

    return recommendations[categoryId as keyof typeof recommendations]?.[level] || [];
  };

  const getCategoryDescription = (categoryId: string, level: 'low' | 'medium' | 'high', stats: any): string => {
    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    
    const descriptions = {
      psychology: `心理优势发展${level === 'high' ? '优秀' : level === 'medium' ? '良好' : '需要提升'}，已完成${completionRate}%的相关任务`,
      health: `身体健康状况${level === 'high' ? '优秀' : level === 'medium' ? '良好' : '需要改善'}，已完成${completionRate}%的健康目标`,
      skill: `技能发展水平${level === 'high' ? '优秀' : level === 'medium' ? '良好' : '需要提升'}，已完成${completionRate}%的技能训练`
    };

    return descriptions[categoryId as keyof typeof descriptions] || '';
  };

  return {
    analysis,
    generateCategoryAnalysis,
    refreshAnalysis: generateCategoryAnalysis
  };
};
