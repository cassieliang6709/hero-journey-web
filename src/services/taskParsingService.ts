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