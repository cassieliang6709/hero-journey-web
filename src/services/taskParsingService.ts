import { TaskSuggestion, ParsedMessage } from '@/types/taskSuggestion';

export const parseAIResponseForTasks = (aiResponse: string, messageId: string): ParsedMessage => {
  // 使用正则表达式匹配任务标记格式: [TASK]标题|描述|难度|时长[/TASK]
  const taskRegex = /\[TASK\](.*?)\[\/TASK\]/g;
  const taskSuggestions: TaskSuggestion[] = [];
  let cleanedText = aiResponse;

  let match;
  while ((match = taskRegex.exec(aiResponse)) !== null) {
    const taskContent = match[1];
    const parts = taskContent.split('|');
    
    if (parts.length >= 2) {
      const taskSuggestion: TaskSuggestion = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: parts[0]?.trim() || '',
        description: parts[1]?.trim() || '',
        difficulty: parseInt(parts[2]?.trim()) || 2,
        estimatedTime: parts[3]?.trim() || '15分钟',
        messageId: messageId
      };

      // 简单的分类预测
      taskSuggestion.category = predictTaskCategory(taskSuggestion.title + ' ' + taskSuggestion.description);
      
      taskSuggestions.push(taskSuggestion);
    }
    
    // 从原文中移除任务标记，保持自然的对话流畅性
    cleanedText = cleanedText.replace(match[0], '');
  }

  // 清理多余的空行
  cleanedText = cleanedText.replace(/\n\n+/g, '\n\n').trim();

  return {
    text: cleanedText,
    taskSuggestions
  };
};

// 智能任务分拆功能
export const parseVoiceInputForTasks = async (voiceText: string): Promise<TaskSuggestion[]> => {
  try {
    // 调用AI分析语音输入，判断是否需要分拆成多个任务
    const analysisPrompt = `
分析以下用户的语音输入，判断是否需要分拆成多个待办任务：

用户输入："${voiceText}"

请按以下规则处理：
1. 如果是一个简单、具体的任务（预计5-15分钟可完成），直接生成1个任务
2. 如果是复杂任务或包含多个步骤，分拆成2-5个子任务
3. 每个任务应该是可执行的具体行动

请用以下格式回复：
[TASK]任务标题|任务描述|难度(1-5)|预计时长[/TASK]

任务标题要简洁明了，任务描述要具体可执行。
`;

    const response = await fetch('/api/ai-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: analysisPrompt })
    });

    if (!response.ok) {
      throw new Error('AI分析失败');
    }

    const aiResponse = await response.text();
    const parsed = parseAIResponseForTasks(aiResponse, `voice_${Date.now()}`);
    
    return parsed.taskSuggestions;
  } catch (error) {
    console.error('语音任务分拆失败:', error);
    
    // 降级处理：直接创建一个简单任务
    return [{
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: voiceText.length > 20 ? voiceText.slice(0, 20) + '...' : voiceText,
      description: voiceText,
      difficulty: 2,
      estimatedTime: '15分钟',
      category: predictTaskCategory(voiceText),
      messageId: `voice_${Date.now()}`
    }];
  }
};

const predictTaskCategory = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  // 身体健康相关
  if (lowerText.includes('运动') || lowerText.includes('锻炼') || lowerText.includes('跑步') || 
      lowerText.includes('健身') || lowerText.includes('瑜伽') || lowerText.includes('游泳') ||
      lowerText.includes('健康') || lowerText.includes('体能')) {
    return '身体';
  }
  
  // 学习技能相关
  if (lowerText.includes('学习') || lowerText.includes('练习') || lowerText.includes('阅读') || 
      lowerText.includes('看书') || lowerText.includes('课程') || lowerText.includes('技能') ||
      lowerText.includes('编程') || lowerText.includes('语言') || lowerText.includes('知识')) {
    return '技能';
  }
  
  // 情绪心理相关
  if (lowerText.includes('冥想') || lowerText.includes('放松') || lowerText.includes('心情') || 
      lowerText.includes('情绪') || lowerText.includes('压力') || lowerText.includes('焦虑') ||
      lowerText.includes('心理') || lowerText.includes('感受') || lowerText.includes('思考')) {
    return '情绪';
  }
  
  // 社交沟通相关
  if (lowerText.includes('沟通') || lowerText.includes('交流') || lowerText.includes('聊天') || 
      lowerText.includes('朋友') || lowerText.includes('社交') || lowerText.includes('表达') ||
      lowerText.includes('分享') || lowerText.includes('合作')) {
    return '沟通';
  }
  
  // 工作相关
  if (lowerText.includes('工作') || lowerText.includes('职业') || lowerText.includes('面试') || 
      lowerText.includes('简历') || lowerText.includes('求职') || lowerText.includes('项目') ||
      lowerText.includes('会议') || lowerText.includes('计划')) {
    return '工作';
  }
  
  return '新增';
};