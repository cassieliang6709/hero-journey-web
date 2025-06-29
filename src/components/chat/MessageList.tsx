
import React, { useRef, useEffect } from 'react';
import TodoCard from '@/components/todo/TodoCard';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  aiTyping: boolean;
  showTodoCard: boolean;
  onCloseTodoCard: () => void;
  onGoToTodoList: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  aiTyping,
  showTodoCard,
  onCloseTodoCard,
  onGoToTodoList
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div 
      className="flex-1 overflow-y-auto p-4 space-y-4"
      style={{
        backgroundImage: 'url(https://s21.ax1x.com/2025/06/29/pVnrSnf.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
        >
          {!message.isUser && (
            <div className="flex-shrink-0 mr-3">
              <img
                src="https://s21.ax1x.com/2025/06/29/pVnDj1I.jpg"
                alt="AI头像"
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          )}
          <div
            className={`max-w-[80%] p-3 rounded-2xl transition-all duration-200 ${
              message.isUser
                ? 'bg-gray-900 text-white animate-fade-in'
                : 'bg-white/90 text-gray-900 border border-gray-200 animate-fade-in backdrop-blur-sm'
            }`}
          >
            <p>{message.text}</p>
          </div>
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
          <div className="flex-shrink-0 mr-3">
            <img
              src="https://s21.ax1x.com/2025/06/29/pVnDj1I.jpg"
              alt="AI头像"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <div className="bg-white/90 text-gray-900 border border-gray-200 p-3 rounded-2xl backdrop-blur-sm">
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
