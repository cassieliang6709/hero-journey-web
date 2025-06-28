
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
    login,
    logout,
    nextOnboardingStep,
    selectIdea,
    changeAvatar,
    completeOnboarding
  } = useAppState();

  console.log('Current app state:', state);

  // 登录页面
  if (state.currentStep === 'login') {
    return <LoginPage onLogin={login} />;
  }

  // 引导流程
  if (state.currentStep === 'onboarding' && state.user) {
    switch (state.onboardingStep) {
      case 0:
        return (
          <OnboardingStep1 
            onNext={nextOnboardingStep}
            username={state.user.username}
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
            selectedAvatar={state.selectedAvatar}
            onChangeAvatar={changeAvatar}
            onComplete={completeOnboarding}
            username={state.user.username}
          />
        );
      default:
        return <div>引导流程错误</div>;
    }
  }

  // 主应用
  if (state.currentStep === 'main' && state.user) {
    return (
      <MainApp 
        user={state.user}
        selectedAvatar={state.selectedAvatar}
        onLogout={logout}
      />
    );
  }

  return <div>加载中...</div>;
};

export default Index;
