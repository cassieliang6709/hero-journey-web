import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import backgroundImage from '@/assets/background1.jpg';
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
  const { t } = useTranslation('chat');
  const { t: tCommon } = useTranslation('common');
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

  useEffect(() => {
    if (!loading) {
      addWelcomeMessage(t('welcomeMessage'));
    }
  }, [loading, addWelcomeMessage, t]);

  const checkForTaskCompletion = (taskTitle: string) => {
    const completionKeywords = [
      ['反思', '思考', '总结', '梳理', '分析'],
      ['情绪', '心情', '感受', '调节'],
      ['自信', '信心', '价值', '肯定'],
      ['压力', '放松', '减压', '缓解'],
      ['运动', '锻炼', '跑步', '健身', '瑜伽'],
      ['饮食', '营养', '吃', '食物'],
      ['睡眠', '休息', '作息'],
      ['体重', '减肥', '称重'],
      ['体能', '体力', '耐力'],
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
    
    const userMessage = messageText || inputText.trim();
    if (!userMessage || aiTyping) return;

    setInputText('');
    
    const todoKeywords = ['待办', '任务', 'todo', '计划', '安排', '提醒'];
    const shouldShowTodo = todoKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );
    
    if (shouldShowTodo) {
      setShowTodoCard(true);
    }
    
    await addMessage(userMessage, true, null);
    setAiTyping(true);
    
    try {
      let aiResponse = await callAI(userMessage);
      
      const messageId = Date.now().toString();
      const parsedMessage = parseAIResponseForTasks(aiResponse, messageId);
      
      if (parsedMessage.taskSuggestions.length > 0) {
        setTaskSuggestions(parsedMessage.taskSuggestions);
        setShowTaskSuggestions(true);
      }
      
      let finalResponse = parsedMessage.text;
      
      if (shouldShowTodo) {
        finalResponse += '\n\n' + t('todoCardHint');
      }

      await addMessage(finalResponse, false);
      
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
      
      toast.error(tCommon('aiServiceUnavailable'));
      
      const fallbackKeys = ['1', '2', '3'];
      const randomKey = fallbackKeys[Math.floor(Math.random() * fallbackKeys.length)];
      const randomResponse = t(`fallbackResponses.${randomKey}`);
      await addMessage(randomResponse, false);
    } finally {
      setAiTyping(false);
    }
  };

  const handleQuestionClick = async (question: string) => {
    setShowQuestionSuggestions(false);
    const mockEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleSend(mockEvent, question);
  };

  const handleTaskComplete = async (taskTitle: string) => {
    setShowTaskSuggestions(false);
    
    const completedNode = checkForTaskCompletion(taskTitle);
    
    const rewardKeys = ['1', '2', '3', '4', '5'];
    const randomKey = rewardKeys[Math.floor(Math.random() * rewardKeys.length)];
    const randomReward = t(`taskComplete.${randomKey}`, { task: taskTitle });
    await addMessage(randomReward, false);

    if (completedNode) {
      await addMessage(
        t('nodeUnlocked', { node: completedNode.name }),
        false,
        completedNode
      );
    }
  };

  const handleClearChat = async () => {
    if (window.confirm(tCommon('clearChatConfirm'))) {
      await clearMessages();
      toast.success(tCommon('chatCleared'));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (diff > 50) {
      onSwipeLeft();
    }
  };

  if (loading) {
    return (
      <div className="mobile-container bg-white flex items-center justify-center">
        <div className="text-gray-600">{tCommon('loadingChat')}</div>
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
