
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  username: string;
  selected_avatar: number;
  selected_ideas: string[];
  completed_onboarding: boolean;
}

interface AppState {
  profile: Profile | null;
  currentStep: 'login' | 'onboarding' | 'main';
  onboardingStep: number;
  selectedIdeas: string[];
  selectedAvatar: number;
}

export const useAppState = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [state, setState] = useState<AppState>({
    profile: null,
    currentStep: 'login',
    onboardingStep: 0,
    selectedIdeas: [],
    selectedAvatar: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (user) {
      loadUserProfile();
    } else {
      setState(prev => ({
        ...prev,
        profile: null,
        currentStep: 'login'
      }));
      setLoading(false);
    }
  }, [user, authLoading]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('加载用户资料失败:', error);
        return;
      }

      if (data) {
        setState(prev => ({
          ...prev,
          profile: data,
          currentStep: data.completed_onboarding ? 'main' : 'onboarding',
          selectedAvatar: data.selected_avatar,
          selectedIdeas: data.selected_ideas || []
        }));
      }
    } catch (error) {
      console.error('加载用户资料错误:', error);
    } finally {
      setLoading(false);
    }
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

  const completeOnboarding = async () => {
    if (!user || !state.profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          selected_avatar: state.selectedAvatar,
          selected_ideas: state.selectedIdeas,
          completed_onboarding: true
        })
        .eq('id', user.id);

      if (error) {
        console.error('完成引导失败:', error);
        return;
      }

      setState(prev => ({
        ...prev,
        currentStep: 'main',
        profile: prev.profile ? {
          ...prev.profile,
          selected_avatar: prev.selectedAvatar,
          selected_ideas: prev.selectedIdeas,
          completed_onboarding: true
        } : null
      }));
    } catch (error) {
      console.error('完成引导错误:', error);
    }
  };

  const logout = async () => {
    await signOut();
    setState({
      profile: null,
      currentStep: 'login',
      onboardingStep: 0,
      selectedIdeas: [],
      selectedAvatar: 0
    });
  };

  return {
    state,
    loading: loading || authLoading,
    user,
    nextOnboardingStep,
    selectIdea,
    changeAvatar,
    completeOnboarding,
    logout
  };
};
