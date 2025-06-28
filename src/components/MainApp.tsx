
import React, { useState } from 'react';
import ChatPage from './ChatPage';
import TodoPage from './TodoPage';
import StarMapPage from './StarMapPage';

interface MainAppProps {
  user: { username: string; };
  selectedAvatar: number;
  onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ user, selectedAvatar, onLogout }) => {
  const [currentPage, setCurrentPage] = useState<'chat' | 'todo' | 'starmap'>('chat');

  const handleSwipeLeft = () => {
    if (currentPage === 'chat') {
      setCurrentPage('todo');
    }
  };

  const handleGoToStarMap = () => {
    setCurrentPage('starmap');
  };

  const handleBackToTodo = () => {
    setCurrentPage('todo');
  };

  const handleBackToChat = () => {
    setCurrentPage('chat');
  };

  return (
    <div className="mobile-container">
      {currentPage === 'chat' && (
        <ChatPage 
          user={user}
          selectedAvatar={selectedAvatar}
          onSwipeLeft={handleSwipeLeft}
          onLogout={onLogout}
        />
      )}
      {currentPage === 'todo' && (
        <TodoPage 
          user={user}
          onGoToStarMap={handleGoToStarMap}
          onBack={handleBackToChat}
        />
      )}
      {currentPage === 'starmap' && (
        <StarMapPage 
          user={user}
          selectedAvatar={selectedAvatar}
          onBack={handleBackToTodo}
        />
      )}
    </div>
  );
};

export default MainApp;
