
import React, { useState } from 'react';
import ChatPage from './ChatPage';
import TodoPage from './TodoPage';
import StarMapPage from './StarMapPage';
import PhysicalTestPage from './PhysicalTestPage';
import TalentTestPage from './TalentTestPage';

interface MainAppProps {
  user: { id: string; username: string; };
  selectedAvatar: number;
  onLogout: () => void;
  onResetOnboarding: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ user, selectedAvatar, onLogout, onResetOnboarding }) => {
  const [currentPage, setCurrentPage] = useState<'chat' | 'todo' | 'starmap' | 'physical-test' | 'talent-test'>('chat');

  const handleSwipeLeft = () => {
    if (currentPage === 'chat') {
      setCurrentPage('todo');
    }
  };

  const handleGoToStarMap = () => {
    setCurrentPage('starmap');
  };

  const handleGoToPhysicalTest = () => {
    setCurrentPage('physical-test');
  };

  const handleGoToTalentTest = () => {
    setCurrentPage('talent-test');
  };

  const handleBackToTodo = () => {
    setCurrentPage('todo');
  };

  const handleBackToChat = () => {
    setCurrentPage('chat');
  };

  const handleBackToStarMap = () => {
    setCurrentPage('starmap');
  };

  return (
    <div className="mobile-container">
      {currentPage === 'chat' && (
        <ChatPage 
          user={user}
          selectedAvatar={selectedAvatar}
          onSwipeLeft={handleSwipeLeft}
          onGoToStarMap={handleGoToStarMap}
          onLogout={onLogout}
          onResetOnboarding={onResetOnboarding}
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
          onBack={handleBackToChat}
          onGoToPhysicalTest={handleGoToPhysicalTest}
          onGoToTalentTest={handleGoToTalentTest}
        />
      )}
      {currentPage === 'physical-test' && (
        <PhysicalTestPage 
          user={user}
          onBack={handleBackToStarMap}
        />
      )}
      {currentPage === 'talent-test' && (
        <TalentTestPage 
          user={user}
          onBack={handleBackToStarMap}
        />
      )}
    </div>
  );
};

export default MainApp;
