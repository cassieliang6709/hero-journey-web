
import { useState, useEffect } from 'react';

interface User {
  username: string;
  isFirstLogin: boolean;
  completedOnboarding: boolean;
}

interface AppState {
  user: User | null;
  currentStep: 'login' | 'onboarding' | 'main';
  onboardingStep: number;
  selectedIdeas: string[];
  selectedAvatar: number;
}

export const useAppState = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    currentStep: 'login',
    onboardingStep: 0,
    selectedIdeas: [],
    selectedAvatar: 0
  });

  useEffect(() => {
    // 检查localStorage中的用户信息
    const savedUser = localStorage.getItem('heroUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setState(prev => ({
        ...prev,
        user,
        currentStep: user.completedOnboarding ? 'main' : 'onboarding'
      }));
    }
  }, []);

  const login = (username: string) => {
    const user = {
      username,
      isFirstLogin: true,
      completedOnboarding: false
    };
    localStorage.setItem('heroUser', JSON.stringify(user));
    setState(prev => ({
      ...prev,
      user,
      currentStep: 'onboarding',
      onboardingStep: 0
    }));
  };

  const nextOnboardingStep = () => {
    setState(prev => ({
      ...prev,
      onboardingStep: prev.onboardingStep + 1
    }));
  };

  const selectIdea = (idea: string) => {
    setState(prev => ({
      ...prev,
      selectedIdeas: prev.selectedIdeas.includes(idea)
        ? prev.selectedIdeas.filter(i => i !== idea)
        : [...prev.selectedIdeas, idea]
    }));
  };

  const changeAvatar = () => {
    setState(prev => ({
      ...prev,
      selectedAvatar: (prev.selectedAvatar + 1) % 8
    }));
  };

  const completeOnboarding = () => {
    if (state.user) {
      const updatedUser = { ...state.user, completedOnboarding: true };
      localStorage.setItem('heroUser', JSON.stringify(updatedUser));
      setState(prev => ({
        ...prev,
        user: updatedUser,
        currentStep: 'main'
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem('heroUser');
    setState({
      user: null,
      currentStep: 'login',
      onboardingStep: 0,
      selectedIdeas: [],
      selectedAvatar: 0
    });
  };

  return {
    state,
    login,
    logout,
    nextOnboardingStep,
    selectIdea,
    changeAvatar,
    completeOnboarding
  };
};
