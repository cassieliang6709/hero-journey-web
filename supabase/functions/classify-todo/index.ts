import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SILICONFLOW_API_KEY = Deno.env.get('SILICONFLOW_API_KEY');
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

// 详细的节点信息
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

// 关键词分类映射
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

const isValidNodeId = (nodeId: string): boolean => {
  return nodeId in DETAILED_NODES;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { todoText } = await req.json();
    console.log('Classifying todo:', todoText);

    // 首先尝试关键词匹配
    for (const [nodeId, keywords] of Object.entries(classificationPrompts)) {
      for (const keyword of keywords) {
        if (todoText.includes(keyword)) {
          const nodeName = getNodeNameById(nodeId);
          console.log('Keyword match:', { nodeId, nodeName, keyword });
          return new Response(JSON.stringify({ 
            nodeId, 
            nodeName,
            confidence: 0.9,
            reason: `关键词匹配: ${keyword}`
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    // 如果关键词匹配失败且有 API Key，使用 AI 分类
    if (SILICONFLOW_API_KEY) {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SILICONFLOW_API_KEY}`,
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

请只返回最匹配的节点ID，不要其他内容。`
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

      if (response.ok) {
        const data = await response.json();
        const nodeId = data.choices[0]?.message?.content?.trim();
        
        if (nodeId && isValidNodeId(nodeId)) {
          const nodeName = getNodeNameById(nodeId);
          console.log('AI classification:', { nodeId, nodeName });
          return new Response(JSON.stringify({ 
            nodeId, 
            nodeName,
            confidence: 0.8,
            reason: 'AI智能分类'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    // 默认分类
    console.log('Using default classification');
    return new Response(JSON.stringify({ 
      nodeId: 'skill-communication', 
      nodeName: '沟通能力',
      confidence: 0.5,
      reason: '默认分类'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in classify-todo function:', error);
    return new Response(JSON.stringify({ 
      nodeId: 'skill-communication', 
      nodeName: '沟通能力',
      confidence: 0.5,
      reason: '错误回退'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
