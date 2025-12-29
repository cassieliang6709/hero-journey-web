
import { useState } from 'react';
import { AppState } from '@/types/auth';

export const useAppState = () => {
  const [state, setState] = useState<AppState>({
    currentStep: 'login',
    onboardingStep: 0,
    selectedIdeas: [],
    selectedAvatar: 0,
    profile: null,
  });

  const nextOnboardingStep = () => {
    setState(prevState => ({
      ...prevState,
      onboardingStep: prevState.onboardingStep + 1,
    }));
  };

  const selectIdea = (idea: string) => {
    setState(prevState => {
      const isSelected = prevState.selectedIdeas.includes(idea);
      const newSelectedIdeas = isSelected
        ? prevState.selectedIdeas.filter(i => i !== idea)
        : [...prevState.selectedIdeas, idea];
      
      return {
        ...prevState,
        selectedIdeas: newSelectedIdeas,
      };
    });
  };

  const changeAvatar = (avatarIndex: number) => {
    setState(prevState => ({
      ...prevState,
      selectedAvatar: avatarIndex,
    }));
  };

  const updateAppState = (updates: Partial<AppState>) => {
    setState(prevState => ({
      ...prevState,
      ...updates,
    }));
  };

  return {
    state,
    setState,
    nextOnboardingStep,
    selectIdea,
    changeAvatar,
    updateAppState,
  };
};
