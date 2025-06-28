
import React, { useState } from 'react';
import ChatPage from './ChatPage';
import TodoPage from './TodoPage';
import StarMapPage from './StarMapPage';
import PhysicalTestPage from './PhysicalTestPage';
import TalentTestPage from './TalentTestPage';
import OnboardingManager from './OnboardingManager';

interface MainAppProps {
  user: { id: string; username: string; };
  selectedAvatar: number;
  onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ user, selectedAvatar, onLogout }) => {
  const [currentPage, setCurrentPage] = useState<'chat' | 'todo' | 'starmap' | 'physical-test' | 'talent-test' | 'onboarding-manager'>('chat');

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

  const handleGoToOnboardingManager = () => {
    setCurrentPage('onboarding-manager');
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
          onGoToOnboardingManager={handleGoToOnboardingManager}
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
      {currentPage === 'onboarding-manager' && (
        <OnboardingManager 
          onBack={handleBackToChat}
        />
      )}
    </div>
  );
};

export default MainApp;
