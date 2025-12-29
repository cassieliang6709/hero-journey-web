import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import AuthPage from '@/components/AuthPage';
import OnboardingStep1 from '@/components/OnboardingStep1';
import OnboardingStep2 from '@/components/OnboardingStep2';
import OnboardingStep3 from '@/components/OnboardingStep3';
import MainApp from '@/components/MainApp';

const Index = () => {
  const { t } = useTranslation('common');
  const {
    user,
    loading,
    state,
    nextOnboardingStep,
    selectIdea,
    changeAvatar,
    completeOnboarding,
    resetOnboarding,
    signOut
  } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="mobile-container bg-white flex items-center justify-center">
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  // 未登录显示认证页面
  if (state.currentStep === 'login' || !user) {
    return <AuthPage onAuthSuccess={() => {}} />;
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
        return <div>{t('onboardingError')}</div>;
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
        onLogout={signOut}
        onResetOnboarding={resetOnboarding}
      />
    );
  }

  return <div>{t('loading')}</div>;
};

export default Index;
