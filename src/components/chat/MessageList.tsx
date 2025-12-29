
import React, { useRef, useEffect } from 'react';
import TodoCard from '@/components/todo/TodoCard';
import StarMapNodeComplete from './StarMapNodeComplete';
import TaskSuggestionCard from './TaskSuggestionCard';
import QuestionSuggestions from './QuestionSuggestions';
import { SkillNode } from '@/hooks/useStarMap';
import { TaskSuggestion } from '@/types/taskSuggestion';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  completedNode?: SkillNode;
  taskSuggestions?: TaskSuggestion[];
}

interface MessageListProps {
  messages: Message[];
  aiTyping: boolean;
  showTodoCard: boolean;
  starMapLevel: number;
  taskSuggestions: TaskSuggestion[];
  showTaskSuggestions: boolean;
  questionSuggestions: string[];
  showQuestionSuggestions: boolean;
  onCloseTodoCard: () => void;
  onGoToTodoList: () => void;
  onGoToStarMap: () => void;
  onCloseTaskSuggestions: () => void;
  onCloseQuestionSuggestions: () => void;
  onQuestionClick: (question: string) => void;
  onTaskComplete?: (taskTitle: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  aiTyping,
  showTodoCard,
  starMapLevel,
  taskSuggestions,
  showTaskSuggestions,
  questionSuggestions,
  showQuestionSuggestions,
  onCloseTodoCard,
  onGoToTodoList,
  onGoToStarMap,
  onCloseTaskSuggestions,
  onCloseQuestionSuggestions,
  onQuestionClick,
  onTaskComplete
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
      
      {/* 任务建议卡片 */}
      {showTaskSuggestions && taskSuggestions.length > 0 && (
        <TaskSuggestionCard
          suggestions={taskSuggestions}
          onClose={onCloseTaskSuggestions}
          onTaskComplete={onTaskComplete}
        />
      )}
      
      {/* 问题建议 */}
      {showQuestionSuggestions && questionSuggestions.length > 0 && (
        <QuestionSuggestions
          questions={questionSuggestions}
          onQuestionClick={onQuestionClick}
          onClose={onCloseQuestionSuggestions}
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
