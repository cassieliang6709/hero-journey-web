
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);

    try {
      const email = `${username.trim()}@herojourney.app`;
      const password = 'herojourney123';

      // 先尝试登录
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // 如果是邮箱未确认的错误，提示用户
        if (signInError.message.includes('Email not confirmed')) {
          toast.error('账户需要邮箱确认，请检查您的邮箱并点击确认链接');
          setLoading(false);
          return;
        }

        // 如果是用户不存在，则尝试注册
        if (signInError.message.includes('Invalid login credentials')) {
          console.log('用户不存在，开始注册流程');
          setIsRegistering(true);
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                username: username.trim()
              }
            }
          });

          if (signUpError) {
            console.error('注册错误:', signUpError);
            
            // 处理发送邮件频率限制错误
            if (signUpError.message.includes('For security purposes')) {
              toast.error('请稍等片刻再尝试注册，避免频繁操作');
            } else if (signUpError.message.includes('User already registered')) {
              toast.error('用户已存在，请尝试登录或重置密码');
            } else {
              toast.error(`注册失败：${signUpError.message}`);
            }
            setIsRegistering(false);
            setLoading(false);
            return;
          }

          // 注册成功
          if (signUpData.user && !signUpData.session) {
            toast.success('注册成功！请检查您的邮箱并点击确认链接后再登录');
            setIsRegistering(false);
            setLoading(false);
            return;
          }

          // 如果注册后直接有session，说明邮箱确认被禁用了
          if (signUpData.session) {
            toast.success('注册并登录成功！');
            onAuthSuccess();
            setIsRegistering(false);
            setLoading(false);
            return;
          }
        } else {
          // 其他登录错误
          console.error('登录错误:', signInError);
          toast.error(`登录失败：${signInError.message}`);
        }
      } else {
        // 登录成功
        toast.success('登录成功！');
        onAuthSuccess();
      }
    } catch (error) {
      console.error('登录过程中发生错误:', error);
      toast.error('操作失败，请重试');
    } finally {
      setLoading(false);
      setIsRegistering(false);
    }
  };

  return (
    <div className="mobile-container bg-white flex items-center justify-center p-6">
      <Card className="w-full max-w-sm glass-effect p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 hero-gradient rounded-full flex items-center justify-center">
            <span className="text-3xl">🦸</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">英雄之旅</h1>
          <p className="text-gray-600 text-sm">
            {isRegistering ? '正在创建新账户...' : '输入用户名即可开始'}
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            type="text"
            placeholder="请输入用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 text-center text-lg h-12"
            required
            disabled={loading}
          />
          
          <Button 
            type="submit" 
            className="w-full hero-gradient text-white font-semibold h-12 text-lg hover:scale-105 transition-transform"
            disabled={loading || !username.trim()}
          >
            {loading 
              ? (isRegistering ? '创建账户中...' : '登录中...') 
              : '开始旅程'
            }
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            首次使用将自动创建账户
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
