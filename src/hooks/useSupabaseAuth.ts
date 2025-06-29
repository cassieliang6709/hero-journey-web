
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<AppState>({
    currentStep: 'login',
    onboardingStep: 0,
    selectedIdeas: [],
    selectedAvatar: 0,
    profile: null,
  });

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
            await fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setState(prevState => ({
            ...prevState,
            currentStep: 'login',
            profile: null,
            selectedIdeas: [],
            selectedAvatar: 0,
            onboardingStep: 0,
          }));
        }
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        const profile: Profile = {
          id: data.id,
          username: data.username,
          completed_onboarding: data.completed_onboarding,
          selected_ideas: data.selected_ideas || [],
          selected_avatar: data.selected_avatar || 0,
        };

        setState(prevState => ({
          ...prevState,
          profile,
          selectedIdeas: profile.selected_ideas,
          selectedAvatar: profile.selected_avatar,
          currentStep: profile.completed_onboarding ? 'main' : 'onboarding',
          onboardingStep: profile.completed_onboarding ? 0 : 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: username || email.split('@')[0]
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        toast.error(error.message);
        return { error };
      }

      toast.success('注册成功！请检查邮箱并点击验证链接。');
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('注册失败，请重试');
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast.error(error.message);
        return { error };
      }

      toast.success('登录成功！');
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('登录失败，请重试');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error('登出失败');
        return;
      }
      toast.success('已成功登出');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('登出失败');      
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
    if (!state.profile || !user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          completed_onboarding: true,
          selected_ideas: state.selectedIdeas,
          selected_avatar: state.selectedAvatar,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error completing onboarding:', error);
        toast.error('完成引导流程失败');
        return;
      }

      setState(prevState => ({
        ...prevState,
        currentStep: 'main',
        profile: {
          ...prevState.profile!,
          completed_onboarding: true,
          selected_ideas: prevState.selectedIdeas,
          selected_avatar: prevState.selectedAvatar,
        },
      }));

      toast.success('欢迎开始你的英雄之旅！');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('完成引导流程失败');
    }
  };

  const resetOnboarding = async () => {
    if (!state.profile || !user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          completed_onboarding: false,
          selected_ideas: [],
          selected_avatar: 0,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error resetting onboarding:', error);
        toast.error('重置引导流程失败');
        return;
      }

      setState(prevState => ({
        ...prevState,
        currentStep: 'onboarding',
        onboardingStep: 0,
        selectedIdeas: [],
        selectedAvatar: 0,
        profile: {
          ...prevState.profile!,
          completed_onboarding: false,
          selected_ideas: [],
          selected_avatar: 0,
        },
      }));

      toast.success('已重置引导流程');
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      toast.error('重置引导流程失败');
    }
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
