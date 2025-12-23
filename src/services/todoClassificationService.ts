import { supabase } from '@/integrations/supabase/client';

export interface NodeClassification {
  nodeId: string;
  nodeName: string;
  confidence?: number;
  reason?: string;
}

// 详细的节点信息（用于本地回退）
const DETAILED_NODES: Record<string, string> = {
  'psychology-emotion': '情绪管理',
  'psychology-thinking': '思维模式',
  'psychology-confidence': '自信建立',
  'psychology-stress': '压力管理',
  'health-exercise': '运动锻炼',
  'health-diet': '饮食管理',
  'health-sleep': '睡眠优化',
  'health-weight': '体重管理',
  'health-fitness': '体能提升',
  'skill-interview': '面试技巧',
  'skill-communication': '沟通能力',
  'skill-career': '职业规划',
  'skill-resume': '简历优化',
  'skill-etiquette': '职场礼仪'
};

// 关键词分类映射（用于本地快速匹配）
const classificationPrompts: Record<string, string[]> = {
  'psychology-emotion': ['情绪', '心情', '焦虑', '压力调节', '情感管理', '心理健康'],
  'psychology-thinking': ['思维', '心态', '积极', '思考方式', '认知', '心理模式'],
  'psychology-confidence': ['自信', '信心', '自我肯定', '自尊', '勇气', '胆量'],
  'psychology-stress': ['压力', '减压', '放松', '缓解', '调节压力', '心理压力'],
  'health-exercise': ['运动', '锻炼', '健身', '跑步', '游泳', '瑜伽', '体育'],
  'health-diet': ['饮食', '营养', '吃', '食物', '膳食', '减肥餐', '健康饮食'],
  'health-sleep': ['睡眠', '休息', '睡觉', '作息', '失眠', '早睡', '睡眠质量'],
  'health-weight': ['体重', '减肥', '增重', '体重管理', '称重', '体重控制'],
  'health-fitness': ['体能', '体质', '身体素质', '体力', '耐力', '体能训练'],
  'skill-interview': ['面试', '面谈', '求职', '应聘', '面试准备', '面试技巧', '面试练习', '准备面试', 'Pre', 'pre'],
  'skill-communication': ['沟通', '交流', '表达', '演讲', '谈话', '对话', '人际交往'],
  'skill-career': ['职业', '职场', '工作规划', '职业发展', '职业规划', '事业'],
  'skill-resume': ['简历', '求职信', '个人简介', 'CV', '履历', '简历优化'],
  'skill-etiquette': ['礼仪', '礼貌', '职场礼仪', '商务礼仪', '社交礼仪', '礼节']
};

const getNodeNameById = (nodeId: string): string => {
  return DETAILED_NODES[nodeId] || '';
};

// 本地关键词匹配（快速路径）
const localKeywordMatch = (todoText: string): NodeClassification | null => {
  for (const [nodeId, keywords] of Object.entries(classificationPrompts)) {
    for (const keyword of keywords) {
      if (todoText.includes(keyword)) {
        return { 
          nodeId, 
          nodeName: getNodeNameById(nodeId),
          confidence: 0.9,
          reason: `关键词匹配: ${keyword}`
        };
      }
    }
  }
  return null;
};

export const classifyTodoToNode = async (todoText: string): Promise<NodeClassification> => {
  try {
    console.log('开始分类任务:', todoText);

    // 首先尝试本地关键词匹配（快速路径）
    const localMatch = localKeywordMatch(todoText);
    if (localMatch) {
      console.log('本地关键词匹配成功:', localMatch);
      return localMatch;
    }

    // 调用 Edge Function 进行 AI 分类
    const { data, error } = await supabase.functions.invoke('classify-todo', {
      body: { todoText }
    });

    if (error) {
      console.error('分类服务调用失败:', error);
      throw error;
    }

    console.log('分类结果:', data);
    return data as NodeClassification;

  } catch (error) {
    console.error('分类服务错误:', error);
    return { 
      nodeId: 'skill-communication', 
      nodeName: '沟通能力',
      confidence: 0.5,
      reason: '错误回退'
    };
  }
};
