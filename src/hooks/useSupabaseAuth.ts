
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { useAppState } from './useAppState';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const { signUp, signIn, signOut } = useAuth();
  const { fetchUserProfile, updateProfile } = useProfile();
  const { state, nextOnboardingStep, selectIdea, changeAvatar, updateAppState } = useAppState();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
              updateAppState({
                profile,
                selectedIdeas: profile.selected_ideas,
                selectedAvatar: profile.selected_avatar,
                currentStep: profile.completed_onboarding ? 'main' : 'onboarding',
                onboardingStep: profile.completed_onboarding ? 0 : 0,
              });
            }
          }, 0);
        } else {
          updateAppState({
            currentStep: 'login',
            profile: null,
            selectedIdeas: [],
            selectedAvatar: 0,
            onboardingStep: 0,
          });
        }
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id).then(profile => {
          if (profile) {
            updateAppState({
              profile,
              selectedIdeas: profile.selected_ideas,
              selectedAvatar: profile.selected_avatar,
              currentStep: profile.completed_onboarding ? 'main' : 'onboarding',
              onboardingStep: profile.completed_onboarding ? 0 : 0,
            });
          }
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const completeOnboarding = async () => {
    if (!state.profile || !user) return;

    const result = await updateProfile(user.id, {
      completed_onboarding: true,
      selected_ideas: state.selectedIdeas,
      selected_avatar: state.selectedAvatar,
    });

    if (result.error) {
      toast.error('完成引导流程失败');
      return;
    }

    updateAppState({
      currentStep: 'main',
      profile: {
        ...state.profile,
        completed_onboarding: true,
        selected_ideas: state.selectedIdeas,
        selected_avatar: state.selectedAvatar,
      },
    });

    toast.success('欢迎开始你的英雄之旅！');
  };

  const resetOnboarding = async () => {
    if (!state.profile || !user) return;

    const result = await updateProfile(user.id, {
      completed_onboarding: false,
      selected_ideas: [],
      selected_avatar: 0,
    });

    if (result.error) {
      toast.error('重置引导流程失败');
      return;
    }

    updateAppState({
      currentStep: 'onboarding',
      onboardingStep: 0,
      selectedIdeas: [],
      selectedAvatar: 0,
      profile: {
        ...state.profile,
        completed_onboarding: false,
        selected_ideas: [],
        selected_avatar: 0,
      },
    });

    toast.success('已重置引导流程');
  };

  return {
    user,
    session,
    loading,
    state,
    signUp,
    signIn,
    signOut,
    nextOnboardingStep,
    selectIdea,
    changeAvatar,
    completeOnboarding,
    resetOnboarding,
  };
};
