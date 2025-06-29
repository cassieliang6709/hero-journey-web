
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

  // 获取最后一条AI消息
  const lastAiMessage = messages.filter(msg => !msg.isUser).pop();

  return (
    <div 
      className="flex-1 overflow-y-auto p-4 space-y-4"
      style={{
        backgroundImage: `url("http://47.96.231.221:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwLzEzMTUxMTg1NzA4OTU1NzI5OTIvMzI5MTc1MTE4MzE1NF8ucGljX2hkLmpwZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUpFNE4yNVMxQkM0Uk5ZVFpYSUNVJTJGMjAyNTA2MjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNjI5VDA4MTY1OFomWC1BbXotRXhwaXJlcz00MzIwMCZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSktSVFJPTWpWVE1VSkRORkpPV1ZSYVdFbERWU0lzSW1WNGNDSTZNVGMxTVRJeU9ERXpNQ3dpY0dGeVpXNTBJam9pYldsdWFXOWZTSE5hV25oRUluMC42enVIZi01VEFZbFdDekFQSVRJbVB5MGR6XzFkT19xa0h6UXJ4MjZxb0Y0NExGM3BOSVpBM2RHV3p1RTczVE1zNU5uZEVjWGFscHdBY2xfYnhhRVdhdyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPWVhZTBkZjZmMDQyYWI2MDBhYTljNGQ1ZGEwZTAwYWM1NmIxMDQ0NTQ2N2VmMGZkZTlkYTkwNTZlNWI2ZjI5Njc")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] p-3 rounded-2xl transition-all duration-200 ${
              message.isUser
                ? 'bg-gray-900/80 text-white animate-fade-in backdrop-blur-sm'
                : 'bg-white/80 text-gray-900 border border-gray-200/50 animate-fade-in backdrop-blur-sm'
            }`}
          >
            <p className="whitespace-pre-line">{message.text}</p>
          </div>
        </div>
      ))}
      
      {/* 待办事项卡片 */}
      {showTodoCard && (
        <TodoCard
          onClose={onCloseTodoCard}
          onGoToTodoList={onGoToTodoList}
          aiMessage={lastAiMessage?.text}
        />
      )}
      
      {aiTyping && (
        <div className="flex justify-start animate-fade-in">
          <div className="bg-white/80 text-gray-900 border border-gray-200/50 p-3 rounded-2xl backdrop-blur-sm">
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
