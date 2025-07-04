
import React, { useState, useEffect } from 'react';
import backgroundImage from '@/assets/background1.jpg';  // 导入图片
import { toast } from 'sonner';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useStarMap } from '@/hooks/useStarMap';
import { callAI, generateQuestions } from '@/services/aiService';
import { parseAIResponseForTasks } from '@/services/taskParsingService';
import { TaskSuggestion } from '@/types/taskSuggestion';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';

interface ChatPageProps {
  user: { id: string; username?: string };
  selectedAvatar: number;
  onSwipeLeft: () => void;
  onGoToStarMap: () => void;
  onLogout: () => void;
  onResetOnboarding: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ 
  user, 
  selectedAvatar, 
  onSwipeLeft, 
  onGoToStarMap, 
  onLogout, 
  onResetOnboarding 
}) => {
  const [inputText, setInputText] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const [showTodoCard, setShowTodoCard] = useState(false);
  const [taskSuggestions, setTaskSuggestions] = useState<TaskSuggestion[]>([]);
  const [showTaskSuggestions, setShowTaskSuggestions] = useState(false);
  const [questionSuggestions, setQuestionSuggestions] = useState<string[]>([]);
  const [showQuestionSuggestions, setShowQuestionSuggestions] = useState(false);
  const touchStartX = React.useRef<number>(0);
  
  const { messages, loading, addMessage, clearMessages, addWelcomeMessage } = useChatMessages(user.id);
  const { nodes, level, completeNode, getNodeByKeywords } = useStarMap(user.id);

  // 修改欢迎消息逻辑
  useEffect(() => {
    if (!loading) {
      addWelcomeMessage();
    }
  }, [loading, addWelcomeMessage]);

  // 检测完成关键词并点亮节点 - 用于任务完成后的检查
  const checkForTaskCompletion = (taskTitle: string) => {
    const completionKeywords = [
      // 心理优势相关
      ['反思', '思考', '总结', '梳理', '分析'],
      ['情绪', '心情', '感受', '调节'],
      ['自信', '信心', '价值', '肯定'],
      ['压力', '放松', '减压', '缓解'],
      
      // 身体健康相关
      ['运动', '锻炼', '跑步', '健身', '瑜伽'],
      ['饮食', '营养', '吃', '食物'],
      ['睡眠', '休息', '作息'],
      ['体重', '减肥', '称重'],
      ['体能', '体力', '耐力'],
      
      // 技能发展相关
      ['面试', '求职', '应聘', '准备'],
      ['沟通', '交流', '表达', '谈话'],
      ['职业', '规划', '发展'],
      ['简历', '履历', 'CV'],
      ['礼仪', '职场', '商务']
    ];

    const foundKeywords: string[] = [];
    completionKeywords.forEach(keywordGroup => {
      keywordGroup.forEach(keyword => {
        if (taskTitle.includes(keyword)) {
          foundKeywords.push(keyword);
        }
      });
    });

    if (foundKeywords.length > 0) {
      const matchedNode = getNodeByKeywords(foundKeywords);
      if (matchedNode && (matchedNode.status === 'available' || matchedNode.status === 'active')) {
        completeNode(matchedNode.id);
        return matchedNode;
      }
    }

    return null;
  };

  const handleSend = async (e: React.FormEvent, messageText?: string) => {
    e.preventDefault();
    
    // 使用传入的消息文本或输入框文本
    const userMessage = messageText || inputText.trim();
    if (!userMessage || aiTyping) return;

    setInputText('');
    
    // 检查是否包含待办事项相关关键词
    const todoKeywords = ['待办', '任务', 'todo', '计划', '安排', '提醒'];
    const shouldShowTodo = todoKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );
    
    if (shouldShowTodo) {
      setShowTodoCard(true);
    }
    
    // Add user message without any star map completion logic
    await addMessage(userMessage, true, null);
    
    // Show AI typing indicator
    setAiTyping(true);
    
    try {
      let aiResponse = await callAI(userMessage);
      
      // 解析AI回复中的任务建议
      const messageId = Date.now().toString();
      const parsedMessage = parseAIResponseForTasks(aiResponse, messageId);
      
      // 如果有任务建议，显示任务建议卡片
      if (parsedMessage.taskSuggestions.length > 0) {
        setTaskSuggestions(parsedMessage.taskSuggestions);
        setShowTaskSuggestions(true);
      }
      
      // 使用清理后的文本作为AI回复
      let finalResponse = parsedMessage.text;
      
      // 如果用户提到待办事项，AI回复中也提示可以查看待办卡片
      if (shouldShowTodo) {
        finalResponse += '\n\n📝 我为你显示了待办事项卡片，你可以直接在这里查看和管理任务。';
      }

      await addMessage(finalResponse, false);
      
      // 生成问题建议
      try {
        const questions = await generateQuestions(userMessage, finalResponse);
        if (questions.length > 0) {
          setQuestionSuggestions(questions);
          setShowQuestionSuggestions(true);
        }
      } catch (error) {
        console.error('生成问题建议失败:', error);
      }
    } catch (error) {
      console.error('AI调用失败:', error);
      
      toast.error('AI服务暂时不可用，请稍后重试');
      
      const fallbackResponses = [
        "抱歉，我现在无法连接到服务器。让我们继续聊天吧！",
        "网络连接似乎有问题，不过我仍然在这里陪伴你。",
        "技术问题暂时阻碍了我，但这不影响我们的对话。"
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      await addMessage(randomResponse, false);
    } finally {
      setAiTyping(false);
    }
  };

  // 新增：处理问题点击，直接发送而不是复制到输入框
  const handleQuestionClick = async (question: string) => {
    setShowQuestionSuggestions(false);
    // 直接发送问题，不需要用户再次点击发送
    const mockEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleSend(mockEvent, question);
  };

  // 处理任务完成 - 这里是真正的任务完成时机，会触发庆祝和星图点亮
  const handleTaskComplete = async (taskTitle: string) => {
    // 先关闭任务建议卡片，让庆祝消息显示在下方
    setShowTaskSuggestions(false);
    
    // 检查是否点亮星图节点
    const completedNode = checkForTaskCompletion(taskTitle);
    
    // 发送庆祝消息
    const rewards = [
      `🎉 太棒了！你刚刚完成了「${taskTitle}」，我能感受到你的努力！我们又向前迈进了一步！`,
      `✨ 干得漂亮！完成「${taskTitle}」让我们都变得更强大了！每一个小行动都在积累力量！`,
      `🌟 完成得很好！「${taskTitle}」的成功让我也为你感到骄傲，继续保持这份坚持！`,
      `💪 真是太棒了！「${taskTitle}」的完成充满了你的决心，你的坚持也让我充满了力量！`,
      `🎯 任务完成！通过「${taskTitle}」我们正在一步步成为更好的自己！这就是我们的英雄之路！`
    ];
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    await addMessage(randomReward, false);

    // 如果有节点被点亮，显示星图节点完成卡片
    if (completedNode) {
      await addMessage(
        `🎉 太棒了！你刚刚点亮了「${completedNode.name}」节点，我们的星图又亮了一颗星！继续加油，我们会越来越强大的！`,
        false,
        completedNode
      );
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('确定要清空所有聊天记录吗？')) {
      await clearMessages();
      toast.success('聊天记录已清空');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (diff > 50) { // 左滑
      onSwipeLeft();
    }
  };

  if (loading) {
    return (
      <div className="mobile-container bg-white flex items-center justify-center">
        <div className="text-gray-600">加载聊天记录中...</div>
      </div>
    );
  }

  return (
    <div 
      className="mobile-container bg-white flex flex-col h-screen"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <ChatHeader
        selectedAvatar={selectedAvatar}
        onAvatarClick={onLogout}
        onClearChat={handleClearChat}
        onOnboardingClick={onResetOnboarding}
        onGoToStarMap={onGoToStarMap}
      />

      <MessageList
        messages={messages}
        aiTyping={aiTyping}
        showTodoCard={showTodoCard}
        starMapLevel={level}
        taskSuggestions={taskSuggestions}
        showTaskSuggestions={showTaskSuggestions}
        questionSuggestions={questionSuggestions}
        showQuestionSuggestions={showQuestionSuggestions}
        onCloseTodoCard={() => setShowTodoCard(false)}
        onGoToTodoList={onSwipeLeft}
        onGoToStarMap={onGoToStarMap}
        onCloseTaskSuggestions={() => setShowTaskSuggestions(false)}
        onCloseQuestionSuggestions={() => setShowQuestionSuggestions(false)}
        onQuestionClick={handleQuestionClick}
        onTaskComplete={handleTaskComplete}
      />

      <ChatInput
        inputText={inputText}
        aiTyping={aiTyping}
        onInputChange={setInputText}
        onSubmit={handleSend}
        onGoToTodoList={onSwipeLeft}
      />
    </div>
  );
};

export default ChatPage;
