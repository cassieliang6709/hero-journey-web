import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, ListTodo, Globe, Settings, Trash2, Plus, Check } from 'lucide-react';
import { useChatMessages } from '@/hooks/useChatMessages';
import { toast } from 'sonner';

interface ChatPageProps {
  user: { id: string; username?: string };
  selectedAvatar: number;
  onSwipeLeft: () => void;
  onGoToStarMap: () => void;
  onLogout: () => void;
  onResetOnboarding: () => void;
}

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  category: string;
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
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: '早上运动', completed: false, category: '身体' },
    { id: 2, text: '冥想练习', completed: false, category: '情绪' },
    { id: 3, text: '学习新技能', completed: false, category: '技能' },
  ]);
  const [newTodoText, setNewTodoText] = useState('');
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
              content: "你是一个友善的AI助手，会用中文回复用户。请保持回复简洁有趣。"
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

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addNewTodo = () => {
    if (!newTodoText.trim()) return;
    
    const newTodo: TodoItem = {
      id: Date.now(),
      text: newTodoText.trim(),
      completed: false,
      category: '新增'
    };
    
    setTodos(prev => [...prev, newTodo]);
    setNewTodoText('');
    toast.success('待办事项已添加', { duration: 2000 });
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
          <div className="flex justify-center animate-fade-in">
            <Card className="w-full max-w-sm bg-white border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 font-medium flex items-center">
                  <ListTodo className="w-4 h-4 mr-2" />
                  待办事项
                </h3>
                <button
                  onClick={() => setShowTodoCard(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {/* 待办事项列表 */}
              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        todo.completed 
                          ? 'bg-gray-900 border-gray-900' 
                          : 'border-gray-400'
                      }`}
                    >
                      {todo.completed && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className={`text-sm flex-1 ${
                      todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {todo.text}
                    </span>
                    <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded">
                      {todo.category}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* 添加新待办事项 */}
              <div className="flex space-x-2">
                <Input
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder="添加新任务..."
                  className="flex-1 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addNewTodo()}
                />
                <Button
                  onClick={addNewTodo}
                  size="sm"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-3"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {/* 查看完整待办页面按钮 */}
              <Button
                onClick={onSwipeLeft}
                variant="outline"
                className="w-full mt-3 text-sm text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                查看完整待办列表
              </Button>
            </Card>
          </div>
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
