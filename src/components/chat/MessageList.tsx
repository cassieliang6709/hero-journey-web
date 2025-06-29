
import React, { useRef, useEffect } from 'react';
import TodoCard from '@/components/todo/TodoCard';
import StarMapNodeComplete from './StarMapNodeComplete';
import { SkillNode } from '@/hooks/useStarMap';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  completedNode?: SkillNode;
}

interface MessageListProps {
  messages: Message[];
  aiTyping: boolean;
  showTodoCard: boolean;
  starMapLevel: number;
  onCloseTodoCard: () => void;
  onGoToTodoList: () => void;
  onGoToStarMap: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  aiTyping,
  showTodoCard,
  starMapLevel,
  onCloseTodoCard,
  onGoToTodoList,
  onGoToStarMap
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50/30 to-pink-50/30">
      {messages.map((message) => (
        <div key={message.id}>
          <div
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg ${
                message.isUser
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white animate-fade-in hover:scale-[1.02]'
                  : 'bg-gradient-to-r from-white to-purple-50 text-gray-900 border border-purple-200 animate-fade-in hover:scale-[1.02] backdrop-blur-sm'
              }`}
            >
              <p className={message.isUser ? 'text-white' : 'text-gray-800'}>{message.text}</p>
            </div>
          </div>
          
          {/* 星图节点完成显示 */}
          {message.completedNode && (
            <StarMapNodeComplete
              node={message.completedNode}
              level={starMapLevel}
              onGoToStarMap={onGoToStarMap}
            />
          )}
        </div>
      ))}
      
      {/* 待办事项卡片 */}
      {showTodoCard && (
        <TodoCard
          onClose={onCloseTodoCard}
          onGoToTodoList={onGoToTodoList}
        />
      )}
      
      {aiTyping && (
        <div className="flex justify-start animate-fade-in">
          <div className="bg-gradient-to-r from-white to-purple-50 text-gray-900 border border-purple-200 p-3 rounded-2xl shadow-md backdrop-blur-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
