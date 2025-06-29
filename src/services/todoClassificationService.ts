const SILICONFLOW_API_KEY = 'sk-cjzjgedahutksrbaeyxbwvuxwhufuculcqfbrsncxvmheltl';
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

export interface NodeClassification {
  nodeId: string;
  nodeName: string;
  confidence?: number;
  reason?: string;
}

// 星图节点映射
const NODE_MAPPING = {
  'psychology': {
    id: 'psychology-root',
    name: '心理优势',
    subNodes: ['psychology-emotion', 'psychology-thinking', 'psychology-confidence', 'psychology-stress']
  },
  'health': {
    id: 'health-root', 
    name: '身体健康',
    subNodes: ['health-exercise', 'health-diet', 'health-sleep', 'health-weight', 'health-fitness']
  },
  'skill': {
    id: 'skill-root',
    name: '技能发展', 
    subNodes: ['skill-interview', 'skill-communication', 'skill-career', 'skill-resume', 'skill-etiquette']
  }
};

// 详细的节点信息
const DETAILED_NODES = {
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

const classificationPrompts = {
  // 心理优势分支
  'psychology-emotion': ['情绪', '心情', '焦虑', '压力调节', '情感管理', '心理健康'],
  'psychology-thinking': ['思维', '心态', '积极', '思考方式', '认知', '心理模式'],
  'psychology-confidence': ['自信', '信心', '自我肯定', '自尊', '勇气', '胆量'],
  'psychology-stress': ['压力', '减压', '放松', '缓解', '调节压力', '心理压力'],
  
  // 身体健康分支
  'health-exercise': ['运动', '锻炼', '健身', '跑步', '游泳', '瑜伽', '体育'],
  'health-diet': ['饮食', '营养', '吃', '食物', '膳食', '减肥餐', '健康饮食'],
  'health-sleep': ['睡眠', '休息', '睡觉', '作息', '失眠', '早睡', '睡眠质量'],
  'health-weight': ['体重', '减肥', '增重', '体重管理', '称重', '体重控制'],
  'health-fitness': ['体能', '体质', '身体素质', '体力', '耐力', '体能训练'],
  
  // 技能发展分支
  'skill-interview': ['面试', '面谈', '求职', '应聘', '面试准备', '面试技巧', '面试练习', '准备面试', 'Pre', 'pre'],
  'skill-communication': ['沟通', '交流', '表达', '演讲', '谈话', '对话', '人际交往'],
  'skill-career': ['职业', '职场', '工作规划', '职业发展', '职业规划', '事业'],
  'skill-resume': ['简历', '求职信', '个人简介', 'CV', '履历', '简历优化'],
  'skill-etiquette': ['礼仪', '礼貌', '职场礼仪', '商务礼仪', '社交礼仪', '礼节']
};

export const classifyTodoToNode = async (todoText: string): Promise<NodeClassification> => {
  try {
    console.log('开始分类任务:', todoText);
    
    // 首先尝试关键词匹配
    for (const [nodeId, keywords] of Object.entries(classificationPrompts)) {
      for (const keyword of keywords) {
        if (todoText.includes(keyword)) {
          const nodeName = getNodeNameById(nodeId);
          console.log('关键词匹配成功:', { nodeId, nodeName, keyword });
          return { 
            nodeId, 
            nodeName,
            confidence: 0.9,
            reason: `关键词匹配: ${keyword}`
          };
        }
      }
    }

    // 如果关键词匹配失败，使用AI分类
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sk-vdmkqyaxpcsjpnzbmgfqetaynyrzpzxtdcqipxqclxumolqf',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-7B-Instruct',
        messages: [
          {
            role: 'system',
            content: `你是一个任务分类助手。请将用户的任务分类到以下15个星图节点中的一个：

心理优势类：
- psychology-emotion (情绪管理)
- psychology-thinking (思维模式) 
- psychology-confidence (自信建立)
- psychology-stress (压力管理)

身体健康类：
- health-exercise (运动锻炼)
- health-diet (饮食管理)
- health-sleep (睡眠优化)
- health-weight (体重管理)
- health-fitness (体能提升)

技能发展类：
- skill-interview (面试技巧)
- skill-communication (沟通能力)
- skill-career (职业规划)
- skill-resume (简历优化)
- skill-etiquette (职场礼仪)

请只返回最匹配的节点ID，如skill-interview。特别注意：任何包含"面试"、"准备面试"、"面试技巧"、"Pre"、"pre"等词汇的任务都应该分类为skill-interview。`
          },
          {
            role: 'user',
            content: `请将这个任务分类: "${todoText}"`
          }
        ],
        temperature: 0.1,
        max_tokens: 50
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    const nodeId = data.choices[0]?.message?.content?.trim();
    
    if (!nodeId || !isValidNodeId(nodeId)) {
      console.log('AI分类失败，使用默认分类');
      return { 
        nodeId: 'skill-communication', 
        nodeName: '沟通能力',
        confidence: 0.5,
        reason: '默认分类'
      };
    }

    const nodeName = getNodeNameById(nodeId);
    console.log('AI分类成功:', { nodeId, nodeName });
    return { 
      nodeId, 
      nodeName,
      confidence: 0.8,
      reason: 'AI智能分类'
    };

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

// 回退分类策略
const fallbackClassification = (todoText: string): NodeClassification => {
  const text = todoText.toLowerCase();
  
  // 心理优势关键词
  if (text.includes('情绪') || text.includes('心情') || text.includes('焦虑') || text.includes('压力')) {
    if (text.includes('压力') || text.includes('放松') || text.includes('减压')) {
      return {
        nodeId: 'psychology-4',
        nodeName: '压力管理',
        confidence: 0.7,
        reason: '包含压力管理相关关键词'
      };
    }
    return {
      nodeId: 'psychology-1',
      nodeName: '情绪管理', 
      confidence: 0.7,
      reason: '包含情绪管理相关关键词'
    };
  }

  if (text.includes('思维') || text.includes('积极') || text.includes('成长') || text.includes('心态')) {
    return {
      nodeId: 'psychology-2',
      nodeName: '思维模式',
      confidence: 0.7,
      reason: '包含思维模式相关关键词'
    };
  }

  if (text.includes('自信') || text.includes('自我') || text.includes('价值')) {
    return {
      nodeId: 'psychology-3',
      nodeName: '自信建立',
      confidence: 0.7,
      reason: '包含自信建立相关关键词'
    };
  }

  // 身体健康关键词
  if (text.includes('运动') || text.includes('健身') || text.includes('跑步') || text.includes('锻炼')) {
    return {
      nodeId: 'health-1',
      nodeName: '运动锻炼',
      confidence: 0.8,
      reason: '包含运动锻炼相关关键词'
    };
  }

  if (text.includes('饮食') || text.includes('吃') || text.includes('营养') || text.includes('食谱')) {
    return {
      nodeId: 'health-2', 
      nodeName: '饮食管理',
      confidence: 0.8,
      reason: '包含饮食管理相关关键词'
    };
  }

  if (text.includes('睡眠') || text.includes('睡觉') || text.includes('作息') || text.includes('休息')) {
    return {
      nodeId: 'health-3',
      nodeName: '睡眠优化',
      confidence: 0.8,
      reason: '包含睡眠优化相关关键词'
    };
  }

  if (text.includes('体重') || text.includes('减肥') || text.includes('瘦身')) {
    return {
      nodeId: 'health-4',
      nodeName: '体重管理',
      confidence: 0.8,
      reason: '包含体重管理相关关键词'
    };
  }

  if (text.includes('体能') || text.includes('体力') || text.includes('体质')) {
    return {
      nodeId: 'health-5',
      nodeName: '体能提升',
      confidence: 0.8,
      reason: '包含体能提升相关关键词'
    };
  }

  // 技能发展关键词
  if (text.includes('面试') || text.includes('求职')) {
    return {
      nodeId: 'skill-1',
      nodeName: '面试技巧',
      confidence: 0.8,
      reason: '包含面试相关关键词'
    };
  }

  if (text.includes('沟通') || text.includes('交流') || text.includes('表达')) {
    return {
      nodeId: 'skill-2',
      nodeName: '沟通能力',
      confidence: 0.8,
      reason: '包含沟通能力相关关键词'
    };
  }

  if (text.includes('职业') || text.includes('规划') || text.includes('发展')) {
    return {
      nodeId: 'skill-3',
      nodeName: '职业规划',
      confidence: 0.7,
      reason: '包含职业规划相关关键词'
    };
  }

  if (text.includes('简历') || text.includes('履历')) {
    return {
      nodeId: 'skill-4',
      nodeName: '简历优化',
      confidence: 0.8,
      reason: '包含简历相关关键词'
    };
  }

  if (text.includes('职场') || text.includes('礼仪') || text.includes('规范')) {
    return {
      nodeId: 'skill-5',
      nodeName: '职场礼仪',
      confidence: 0.7,
      reason: '包含职场礼仪相关关键词'
    };
  }

  // 默认分类到技能发展
  return {
    nodeId: 'skill-2',
    nodeName: '沟通能力',
    confidence: 0.5,
    reason: '默认分类到通用技能发展'
  };
};

const getNodeNameById = (nodeId: string): string => {
  return DETAILED_NODES[nodeId as keyof typeof DETAILED_NODES] || '';
};

const isValidNodeId = (nodeId: string): boolean => {
  return nodeId in DETAILED_NODES;
};
