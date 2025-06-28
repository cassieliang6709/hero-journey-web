
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Menu, ArrowLeft } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatPageProps {
  user: { username: string };
  selectedAvatar: number;
  onSwipeLeft: () => void;
  onLogout: () => void;
}

const avatars = ['🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '👑', '⚡', '🔥', '🌟'];

const ChatPage: React.FC<ChatPageProps> = ({ user, selectedAvatar, onSwipeLeft, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `你好 ${user.username}！我是你的英雄导师。今天想聊什么呢？`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // 模拟AI回复
    setTimeout(() => {
      const responses = [
        "这是一个很好的想法！让我们深入探讨一下。",
        "我理解你的感受。这种情况下，你觉得什么行动最有帮助？",
        "很棒！你已经迈出了重要的一步。继续保持这种积极的态度。",
        "让我们一起制定一个可行的计划来解决这个问题。",
        "你的成长意识很强！这正是英雄品质的体现。"
      ];
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
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

  return (
    <div 
      className="mobile-container gradient-bg flex flex-col h-screen"
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
            <h1 className="text-white font-semibold">英雄对话</h1>
            <p className="text-gray-400 text-sm">与你的导师交流</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMenu(!showMenu)}
          className="text-white"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* 菜单 */}
      {showMenu && (
        <Card className="mx-4 mb-2 glass-effect p-2 animate-fade-in">
          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full text-left text-white hover:bg-white/10"
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
                  ? 'bg-hero-500 text-white'
                  : 'glass-effect text-white'
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <form onSubmit={handleSend} className="p-4 glass-effect">
        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="输入你的想法..."
            className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-gray-400"
          />
          <Button type="submit" className="hero-gradient px-3">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>

      {/* 左滑提示 */}
      <div className="absolute bottom-20 left-4 text-gray-500 text-sm animate-pulse">
        ← 左滑查看待办事项
      </div>
    </div>
  );
};

export default ChatPage;
