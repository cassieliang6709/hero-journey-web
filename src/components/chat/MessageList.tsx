
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
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id}>
          <div
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
  );
};

export default MessageList;
