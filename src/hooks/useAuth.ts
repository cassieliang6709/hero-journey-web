
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuth = () => {
  const signUp = async (email: string, password: string, username?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
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

      toast.success('注册成功！正在为您登录...');
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

  return {
    signUp,
    signIn,
    signOut,
  };
};
