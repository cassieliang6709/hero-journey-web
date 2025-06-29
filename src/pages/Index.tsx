
import React from 'react';
import { useAppState } from '@/hooks/useAppState';
import LoginPage from '@/components/LoginPage';
import OnboardingStep1 from '@/components/OnboardingStep1';
import OnboardingStep2 from '@/components/OnboardingStep2';
import OnboardingStep3 from '@/components/OnboardingStep3';
import MainApp from '@/components/MainApp';

const Index = () => {
  const {
    state,
    loading,
    user,
    nextOnboardingStep,
    selectIdea,
    changeAvatar,
    completeOnboarding,
    resetOnboarding,
    handleLogin,
    logout
  } = useAppState();

  console.log('Current app state:', state);

  if (loading) {
    return (
      <div className="mobile-container bg-white flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  // 未登录显示登录页面
  if (state.currentStep === 'login' || !user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 引导流程
  if (state.currentStep === 'onboarding' && state.profile) {
    switch (state.onboardingStep) {
      case 0:
        return (
          <OnboardingStep1 
            onNext={nextOnboardingStep}
            username={state.profile.username}
          />
        );
      case 1:
        return (
          <OnboardingStep2
            selectedIdeas={state.selectedIdeas}
            onSelectIdea={selectIdea}
            onNext={nextOnboardingStep}
          />
        );
      case 2:
        return (
          <OnboardingStep3
            onComplete={completeOnboarding}
            username={state.profile.username}
          />
        );
      default:
        return <div>引导流程错误</div>;
    }
  }

  // 主应用
  if (state.currentStep === 'main' && state.profile) {
    return (
      <MainApp 
        user={{
          id: user.id,
          username: state.profile.username
        }}
        selectedAvatar={state.selectedAvatar}
        onLogout={logout}
        onResetOnboarding={resetOnboarding}
      />
    );
  }

  return <div>加载中...</div>;
};

export default Index;
