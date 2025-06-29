
import { useState, useEffect } from 'react';

export interface Profile {
  id: string;
  username: string;
  completed_onboarding: boolean;
  selected_ideas: string[];
  selected_avatar: number;
}

export interface AppState {
  currentStep: 'login' | 'onboarding' | 'main';
  onboardingStep: number;
  selectedIdeas: string[];
  selectedAvatar: number;
  profile: Profile | null;
}

export const useAppState = () => {
  const [state, setState] = useState<AppState>({
    currentStep: 'login',
    onboardingStep: 0,
    selectedIdeas: [],
    selectedAvatar: 0,
    profile: null,
  });

  // 简单的登录处理函数，完全使用本地状态
  const handleLogin = async (username: string) => {
    try {
      console.log('Logging in user:', username);
      
      // 创建一个模拟用户ID
      const mockUserId = `user_${username}_${Date.now()}`;
      
      // 检查本地存储是否有该用户的数据
      const storedProfileKey = `profile_${username}`;
      const storedProfile = localStorage.getItem(storedProfileKey);
      
      let profile: Profile;

      if (storedProfile) {
        // 用户存在，加载存储的数据
        profile = JSON.parse(storedProfile);
      } else {
        // 新用户，创建新的profile
        profile = {
          id: mockUserId,
          username,
          completed_onboarding: false,
          selected_ideas: [],
          selected_avatar: 0,
        };
        
        // 保存到本地存储
        localStorage.setItem(storedProfileKey, JSON.stringify(profile));
      }

      // 更新状态
      setState(prevState => ({
        ...prevState,
        profile,
        selectedIdeas: profile.selected_ideas,
        selectedAvatar: profile.selected_avatar,
        currentStep: profile.completed_onboarding ? 'main' : 'onboarding',
        onboardingStep: profile.completed_onboarding ? 0 : 0,
      }));

    } catch (error) {
      console.error('登录过程中发生错误:', error);
    }
  };

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

  const completeOnboarding = async () => {
    if (!state.profile) return;

    try {
      // 更新profile数据
      const updatedProfile = {
        ...state.profile,
        completed_onboarding: true,
        selected_ideas: state.selectedIdeas,
        selected_avatar: state.selectedAvatar,
      };

      // 保存到本地存储
      const storedProfileKey = `profile_${state.profile.username}`;
      localStorage.setItem(storedProfileKey, JSON.stringify(updatedProfile));

      setState(prevState => ({
        ...prevState,
        currentStep: 'main',
        profile: updatedProfile,
      }));
    } catch (error) {
      console.error('完成引导流程时发生错误:', error);
    }
  };

  const resetOnboarding = async () => {
    if (!state.profile) return;

    try {
      // 重置profile数据
      const resetProfile = {
        ...state.profile,
        completed_onboarding: false,
        selected_ideas: [],
        selected_avatar: 0,
      };

      // 保存到本地存储
      const storedProfileKey = `profile_${state.profile.username}`;
      localStorage.setItem(storedProfileKey, JSON.stringify(resetProfile));

      setState(prevState => ({
        ...prevState,
        currentStep: 'onboarding',
        onboardingStep: 0,
        selectedIdeas: [],
        selectedAvatar: 0,
        profile: resetProfile,
      }));
    } catch (error) {
      console.error('重置引导流程时发生错误:', error);
    }
  };

  const logout = () => {
    setState({
      currentStep: 'login',
      onboardingStep: 0,
      selectedIdeas: [],
      selectedAvatar: 0,
      profile: null,
    });
  };

  return {
    state,
    loading: false,
    user: state.profile ? { id: state.profile.id, username: state.profile.username } : null,
    nextOnboardingStep,
    selectIdea,
    changeAvatar,
    completeOnboarding,
    resetOnboarding,
    handleLogin,
    logout,
  };
};
