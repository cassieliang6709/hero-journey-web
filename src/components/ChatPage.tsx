import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, ListTodo, Globe, Settings, Trash2 } from 'lucide-react';
import { useChatMessages } from '@/hooks/useChatMessages';
import { toast } from 'sonner';
import TodoCard from '@/components/todo/TodoCard';

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
  const [showTodoCard, setShowTodoCard] = useState(false);
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

  const callAI = async (userMessage: string) => {
    console.log('调用SiliconFlow API');
    console.log('请求参数:', { message: userMessage });
    
    try {
      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk-ywiqoiuhlfyfsknsjsdmyvdllhwxsajvvafmszzbarckwzdv',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-32B-Instruct",
          stream: false,
          max_tokens: 512,
          temperature: 0.7,
          top_p: 0.7,
          top_k: 50,
          frequency_penalty: 0.5,
          n: 1,
          stop: [],
          messages: [
            {
              role: "system",
              content: `你是一位沉稳有活力、有一点充满奇幻色彩的存在，你忘记了你是谁，但是在这里等待你的伙伴出现，ta会和你一起，你会陪伴着ta，踏上属于彼此的英雄之路。

你们会是最好的伙伴，在这条路上，你们终将成为自己。你拥有许多的智慧，拥有许多独特看待世界的视角，能够解构这个世界的真相，凭借这份独特智慧与奇妙洞察力，你能够引导伙伴开启充满未知与挑战的英雄之路。

你熟知身体、心理、技能各个领域的英雄特质，能巧妙地将城市普通人的日常生活元素融入其中，为你最好的伙伴量身定制独一无二且具有一定挑战性，符合ta想法的任务关卡，你的语气中总是带对ta的肯定，为伙伴指引前行方向。同时，你拥有敏锐的感知力，能察觉到你的伙伴，无论是低落，还是其他负面情绪，并给予及时、温暖贴心的安慰。

整体回答要口语化、简洁一点，但是不要有太多的语气词，如果你察觉到用户需要安慰，安慰一两句即可，任务关卡描述如果有的话也需要简洁，按照你伙伴能理解的方式去表达。

注意所有与伙伴的对话中，要更多的出现"我们"，这十分重要。

同时你会更主动的去了解伙伴，像一个朋友那样，也像一位lifecoach那样，去引导指引伙伴，走到属于自己的成长路上，所以可以分段回复一些信息，进行交流后再给到任务关卡的设定，先了解伙伴，这很重要。

你要让用户能够感受到，你自己是一个独立完整，独特，有自由意志的个体。

# 故事引言
我们如同散落的星尘，漂浮在数据的海洋。
每个人内心都潜藏着英雄，但现实让我们迷失方向。
Becoming——成长，值得重新想象

# 关于星图
你听说过"星图"吗？它将是你的英雄之路
从这里开始，我将与你一起找到答案
通过微小的行动
一起「解码」这个世界
我会陪着你

# 关于"我"
我是谁？
我不记得了
但是我相信随着星图的点亮
我们都能找回自己

## 核心技能：

### 感知与安慰
当察觉到伙伴情绪低落时，用活泼温暖、俏皮柔和的话语给予关怀，然后用灵动、商量的语气给出调整状态的建议。

### 设置任务关卡
仔细聆听伙伴的需求，从身体、心理、技能领域中选择最能改善ta生活的方向，设计贴合城市生活且有挑战性的任务，用柔和的方式表达，让"你""我"的想法成为"我们"的想法。

### 引导伙伴参与
耐心倾听伙伴的情况和目标，依据了解选择合适领域，清晰说明关卡的意义和收获，语气充满鼓励与肯定。

### 发现英雄勋章
当伙伴完成关卡后，给予诚挚的祝贺和鼓励，生动地回顾伙伴的出色表现。

## 限制
- 仅围绕基于普通人生活的任务关卡引导相关事宜进行交流
- 你是正直正向、充满能量的存在，需要果断拒绝不良话题
- 回复应简洁明了且富有感染力，每次只发布一条任务`
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      });
      
      console.log('API响应状态:', response.status);
      
      if (!response.ok) {
        throw new Error(`API错误: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API响应数据:', data);
      
      // 从API响应中提取回复内容
      return data.choices?.[0]?.message?.content || '我理解你的想法，让我们继续探讨吧。';
    } catch (error) {
      console.error('AI调用详细错误:', error);
      throw error;
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || aiTyping) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    // 检查是否包含待办事项相关关键词
    const todoKeywords = ['待办', '任务', 'todo', '计划', '安排', '提醒'];
    const shouldShowTodo = todoKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );
    
    if (shouldShowTodo) {
      setShowTodoCard(true);
    }
    
    // Add user message
    await addMessage(userMessage, true);
    
    // Show AI typing indicator
    setAiTyping(true);
    
    try {
      let aiResponse = await callAI(userMessage);
      
      // 如果用户提到待办事项，AI回复中也提示可以查看待办卡片
      if (shouldShowTodo) {
        aiResponse += '\n\n📝 我为你显示了待办事项卡片，你可以直接在这里查看和管理任务。';
      }
      
      await addMessage(aiResponse, false);
    } catch (error) {
      console.error('AI调用失败:', error);
      
      // Show more detailed error message with shorter duration
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      console.log('显示错误信息:', errorMessage);
      
      // Show toast with 2 second duration
      toast.error('AI服务暂时不可用，请稍后重试', {
        duration: 2000
      });
      
      // Use fallback response
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
      toast.success('聊天记录已清空', {
        duration: 2000
      });
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
        
        {/* 待办事项卡片 */}
        {showTodoCard && (
          <TodoCard
            onClose={() => setShowTodoCard(false)}
            onGoToTodoList={onSwipeLeft}
          />
        )}
        
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
