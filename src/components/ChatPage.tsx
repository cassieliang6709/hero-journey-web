import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, ListTodo, Globe, Settings, Trash2 } from 'lucide-react';
import { useChatMessages } from '@/hooks/useChatMessages';
import { supabase } from '@/integrations/supabase/client';

interface ChatPageProps {
  user: { id: string; username?: string };
  selectedAvatar: number;
  onSwipeLeft: () => void;
  onGoToStarMap: () => void;
  onLogout: () => void;
  onResetOnboarding: () => void;
}

const avatars = ['🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '👑', '⚡', '🔥', '🌟'];

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  
  const { messages, loading, addMessage, clearMessages, addWelcomeMessage } = useChatMessages(user.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message if no messages exist
  useEffect(() => {
    if (!loading && messages.length === 0) {
      addWelcomeMessage();
    }
  }, [loading, messages.length, addWelcomeMessage]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || aiTyping) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    // Add user message
    await addMessage(userMessage, true);
    
    // Show AI typing indicator
    setAiTyping(true);
    
    try {
      // Call external API
      const response = await fetch('http://47.96.231.221:5001/AgentChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          send_message: userMessage
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      await addMessage(data.text || '我理解你的想法，让我们继续探讨吧。', false);
    } catch (error) {
      console.error('外部API调用错误:', error);
      // Fallback response
      const responses = [
        "这是一个很好的想法！让我们深入探讨一下。",
        "我理解你的感受。这种情况下，你觉得什么行动最有帮助？",
        "很棒！你已经迈出了重要的一步。继续保持这种积极的态度。",
        "让我们一起制定一个可行的计划来解决这个问题。",
        "你的成长意识很强！这正是英雄品质的体现。"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      await addMessage(randomResponse, false);
    } finally {
      setAiTyping(false);
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('确定要清空所有聊天记录吗？')) {
      await clearMessages();
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

  const handleAvatarClick = () => {
    onLogout();
  };

  const handleOnboardingClick = () => {
    onResetOnboarding();
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
    >
      {/* 顶部导航 */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleAvatarClick}
            className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <span className="text-xl">{avatars[selectedAvatar]}</span>
          </button>
          <div>
            <h1 className="text-gray-900 font-semibold">小精灵</h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="text-gray-900 p-2 hover:bg-gray-100 hover:scale-105 transition-all"
            title="清空聊天记录"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOnboardingClick}
            className="text-gray-900 p-2 hover:bg-gray-100 hover:scale-105 transition-all"
            title="重新设置目标"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoToStarMap}
            className="text-gray-900 p-2 hover:bg-gray-100 hover:scale-105 transition-all"
          >
            <Globe className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl transition-all duration-200 ${
                message.isUser
                  ? 'bg-gray-900 text-white animate-fade-in'
                  : 'bg-gray-100 text-gray-900 border border-gray-200 animate-fade-in'
              }`}
            >
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        
        {aiTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-gray-100 text-gray-900 border border-gray-200 p-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Todo List 按钮 */}
      <div className="px-4 pb-2">
        <Button
          onClick={onSwipeLeft}
          variant="outline"
          className="flex items-center space-x-2 text-gray-700 border-gray-300 hover:bg-gray-50 hover:scale-105 transition-all animate-fade-in"
        >
          <ListTodo className="w-4 h-4" />
          <span>待办事项</span>
        </Button>
      </div>

      {/* 输入框 */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="输入你的想法..."
            className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-200 focus:scale-105"
            disabled={aiTyping}
          />
          <Button 
            type="submit" 
            className="bg-gray-900 hover:bg-gray-800 text-white px-3 hover:scale-105 transition-all"
            disabled={aiTyping || !inputText.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage;
