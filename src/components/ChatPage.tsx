import React, { useState, useEffect } from 'react';
import backgroundImage from '@/assets/background1.jpg';  // 导入图片
import { toast } from 'sonner';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useStarMap } from '@/hooks/useStarMap';
import { callAI } from '@/services/aiService';
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
  const touchStartX = React.useRef<number>(0);
  
  const { messages, loading, addMessage, clearMessages, addWelcomeMessage } = useChatMessages(user.id);
  const { nodes, level, completeNode, getNodeByKeywords } = useStarMap(user.id);

  // Add welcome message if no messages exist
  useEffect(() => {
    if (!loading && messages.length === 0) {
      addWelcomeMessage();
    }
  }, [loading, messages.length, addWelcomeMessage]);

  // 检测完成关键词并点亮节点
  const checkForTaskCompletion = (userMessage: string) => {
    const completionKeywords = [
      ['完成', '做完', '结束', '搞定'],
      ['运动', '锻炼', '跑步', '健身'],
      ['学习', '看书', '阅读', '练习'],
      ['沟通', '交流', '说话', '聊天'],
      ['情绪', '心情', '感受', '冥想'],
      ['面试', '工作', '求职', '简历']
    ];

    const foundKeywords: string[] = [];
    completionKeywords.forEach(keywordGroup => {
      keywordGroup.forEach(keyword => {
        if (userMessage.includes(keyword)) {
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || aiTyping) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    // 检查任务完成
    const completedNode = checkForTaskCompletion(userMessage);
    
    // 检查是否包含待办事项相关关键词
    const todoKeywords = ['待办', '任务', 'todo', '计划', '安排', '提醒'];
    const shouldShowTodo = todoKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );
    
    if (shouldShowTodo) {
      setShowTodoCard(true);
    }
    
    // Add user message with completed node info
    await addMessage(userMessage, true, completedNode);
    
    // Show AI typing indicator
    setAiTyping(true);
    
    try {
      let aiResponse = await callAI(userMessage);
      
      // 如果用户提到待办事项，AI回复中也提示可以查看待办卡片
      if (shouldShowTodo) {
        aiResponse += '\n\n📝 我为你显示了待办事项卡片，你可以直接在这里查看和管理任务。';
      }

      // 如果有节点被点亮，AI会祝贺
      if (completedNode) {
        aiResponse += `\n\n🎉 太棒了！你刚刚点亮了「${completedNode.name}」节点，我们的星图又亮了一颗星！继续加油，我们会越来越强大的！`;
      }
      
      await addMessage(aiResponse, false);
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
      style=    {{backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'}}
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
        onCloseTodoCard={() => setShowTodoCard(false)}
        onGoToTodoList={onSwipeLeft}
        onGoToStarMap={onGoToStarMap}
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
