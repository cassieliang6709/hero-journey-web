
const SILICONFLOW_API_KEY = 'sk-cjzjgedahutksrbaeyxbwvuxwhufuculcqfbrsncxvmheltl';
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

export interface NodeClassification {
  nodeId: string;
  nodeName: string;
  confidence: number;
  reason: string;
}

// 星图节点映射
const NODE_MAPPING = {
  'psychology': {
    id: 'psychology-root',
    name: '心理优势',
    subNodes: ['psychology-1', 'psychology-2', 'psychology-3', 'psychology-4']
  },
  'health': {
    id: 'health-root', 
    name: '身体健康',
    subNodes: ['health-1', 'health-2', 'health-3', 'health-4', 'health-5']
  },
  'skill': {
    id: 'skill-root',
    name: '技能发展', 
    subNodes: ['skill-1', 'skill-2', 'skill-3', 'skill-4', 'skill-5']
  }
};

// 详细的节点信息
const DETAILED_NODES = {
  'psychology-1': '情绪管理',
  'psychology-2': '思维模式',
  'psychology-3': '自信建立',
  'psychology-4': '压力管理',
  'health-1': '运动锻炼',
  'health-2': '饮食管理',
  'health-3': '睡眠优化',
  'health-4': '体重管理',
  'health-5': '体能提升',
  'skill-1': '面试技巧',
  'skill-2': '沟通能力',
  'skill-3': '职业规划',
  'skill-4': '简历优化',
  'skill-5': '职场礼仪'
};

export const classifyTodoToNode = async (todoText: string): Promise<NodeClassification> => {
  console.log('开始分类任务:', todoText);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-32B-Instruct",
        stream: false,
        max_tokens: 512,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: `你是一个任务分类专家。请将用户的待办事项分类到以下星图节点中：

**心理优势类节点：**
- psychology-1: 情绪管理 - 情绪识别、调节、心情管理相关
- psychology-2: 思维模式 - 积极思维、成长心态、认知改变相关
- psychology-3: 自信建立 - 增强自信心、自我价值感相关
- psychology-4: 压力管理 - 压力应对、放松技巧相关

**身体健康类节点：**
- health-1: 运动锻炼 - 健身、跑步、运动计划相关
- health-2: 饮食管理 - 饮食习惯、营养摄入、食谱相关
- health-3: 睡眠优化 - 睡眠质量、作息规律相关
- health-4: 体重管理 - 减肥、体重控制相关
- health-5: 体能提升 - 身体素质、体力增强相关

**技能发展类节点：**
- skill-1: 面试技巧 - 面试准备、表达技巧相关
- skill-2: 沟通能力 - 人际沟通、交流技能相关
- skill-3: 职业规划 - 职业发展、规划路径相关
- skill-4: 简历优化 - 简历制作、优化相关
- skill-5: 职场礼仪 - 职场规范、礼仪相关

请返回JSON格式：
{
  "nodeId": "最匹配的节点ID",
  "nodeName": "节点名称",
  "confidence": 0.95,
  "reason": "分类理由"
}`
          },
          {
            role: "user",
            content: `请分类这个任务："${todoText}"`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';
    
    console.log('AI分类响应:', aiResponse);

    // 解析AI响应
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const classification = JSON.parse(jsonMatch[0]);
        
        // 验证nodeId是否有效
        if (classification.nodeId && DETAILED_NODES[classification.nodeId as keyof typeof DETAILED_NODES]) {
          return {
            nodeId: classification.nodeId,
            nodeName: classification.nodeName || DETAILED_NODES[classification.nodeId as keyof typeof DETAILED_NODES],
            confidence: classification.confidence || 0.8,
            reason: classification.reason || '基于任务内容的智能匹配'
          };
        }
      }
    } catch (parseError) {
      console.error('解析AI响应失败:', parseError);
    }

    // 如果AI分类失败，使用关键词回退策略
    return fallbackClassification(todoText);

  } catch (error) {
    console.error('AI分类失败:', error);
    return fallbackClassification(todoText);
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
