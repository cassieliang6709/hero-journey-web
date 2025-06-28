import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Menu, ListTodo, Star } from 'lucide-react';
import { useChatMessages } from '@/hooks/useChatMessages';
import { supabase } from '@/integrations/supabase/client';

interface ChatPageProps {
  user: { id: string; username?: string };
  selectedAvatar: number;
  onSwipeLeft: () => void;
  onGoToStarMap: () => void;
  onLogout: () => void;
}

const avatars = ['🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '👑', '⚡', '🔥', '🌟'];

const ChatPage: React.FC<ChatPageProps> = ({ user, selectedAvatar, onSwipeLeft, onGoToStarMap, onLogout }) => {
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  
  const { messages, loading, addMessage } = useChatMessages(user.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message if no messages exist
  useEffect(() => {
    if (!loading && messages.length === 0) {
      addMessage(`你好 ${user.username || '用户'}！我是你的英雄导师。今天想聊什么呢？`, false);
    }
  }, [loading, messages.length, user.username, addMessage]);

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
      // Call AI API through Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: { message: userMessage }
      });
      
      if (error) {
        console.error('AI调用失败:', error);
        await addMessage('抱歉，我现在无法回复。请稍后再试。', false);
      } else {
        await addMessage(data.response || '我理解你的想法，让我们继续探讨吧。', false);
      }
    } catch (error) {
      console.error('AI调用错误:', error);
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
    >
      {/* 顶部导航 */}
      <div className="flex items-center justify-between p-4 glass-effect">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 hero-gradient rounded-full flex items-center justify-center">
            <span className="text-xl">{avatars[selectedAvatar]}</span>
          </div>
          <div>
            <h1 className="text-gray-800 font-semibold">英雄对话</h1>
            <p className="text-gray-600 text-sm">与你的导师交流</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoToStarMap}
            className="text-gray-800 p-2"
          >
            <Star className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-800"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 菜单 */}
      {showMenu && (
        <Card className="mx-4 mb-2 glass-effect p-2 animate-fade-in">
          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full text-left text-gray-800 hover:bg-gray-100"
          >
            退出登录
          </Button>
        </Card>
      )}

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.isUser
                  ? 'bg-orange-500 text-white'
                  : 'glass-effect text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {aiTyping && (
          <div className="flex justify-start">
            <div className="glass-effect text-gray-800 p-3 rounded-2xl">
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
          className="flex items-center space-x-2 text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          <ListTodo className="w-4 h-4" />
          <span>待办事项</span>
        </Button>
      </div>

      {/* 输入框 */}
      <form onSubmit={handleSend} className="p-4 glass-effect">
        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="输入你的想法..."
            className="flex-1 bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
            disabled={aiTyping}
          />
          <Button 
            type="submit" 
            className="hero-gradient px-3"
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
