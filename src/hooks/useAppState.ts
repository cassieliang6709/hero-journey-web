
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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
  const { user, loading } = useAuth();
  const [state, setState] = useState<AppState>({
    currentStep: 'login',
    onboardingStep: 0,
    selectedIdeas: [],
    selectedAvatar: 0,
    profile: null,
  });

  // 简单的登录处理函数
  const handleLogin = async (username: string) => {
    try {
      console.log('Logging in user:', username);
      
      // 创建一个模拟用户ID
      const mockUserId = `user_${username}_${Date.now()}`;
      
      // 检查是否已有该用户的profile
      let { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      let profile: Profile;

      if (fetchError && fetchError.code === 'PGRST116') {
        // 用户不存在，创建新profile
        const newProfile = {
          id: mockUserId,
          username,
          completed_onboarding: false,
          selected_ideas: [],
          selected_avatar: 0,
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error('创建用户profile失败:', createError);
          return;
        }

        profile = createdProfile;
      } else if (existingProfile) {
        profile = existingProfile;
      } else {
        console.error('获取用户profile失败:', fetchError);
        return;
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
      // 更新数据库中的用户profile
      const { error } = await supabase
        .from('profiles')
        .update({
          completed_onboarding: true,
          selected_ideas: state.selectedIdeas,
          selected_avatar: state.selectedAvatar,
        })
        .eq('id', state.profile.id);

      if (error) {
        console.error('更新用户profile失败:', error);
        return;
      }

      setState(prevState => ({
        ...prevState,
        currentStep: 'main',
        profile: prevState.profile ? {
          ...prevState.profile,
          completed_onboarding: true,
          selected_ideas: prevState.selectedIdeas,
          selected_avatar: prevState.selectedAvatar,
        } : null,
      }));
    } catch (error) {
      console.error('完成引导流程时发生错误:', error);
    }
  };

  const resetOnboarding = async () => {
    if (!state.profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          completed_onboarding: false,
          selected_ideas: [],
          selected_avatar: 0,
        })
        .eq('id', state.profile.id);

      if (error) {
        console.error('重置引导流程失败:', error);
        return;
      }

      setState(prevState => ({
        ...prevState,
        currentStep: 'onboarding',
        onboardingStep: 0,
        selectedIdeas: [],
        selectedAvatar: 0,
        profile: prevState.profile ? {
          ...prevState.profile,
          completed_onboarding: false,
          selected_ideas: [],
          selected_avatar: 0,
        } : null,
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
    loading: false, // 简化后不需要复杂的loading状态
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
