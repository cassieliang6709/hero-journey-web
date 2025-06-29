
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);

    try {
      // 直接使用用户名创建简单的邮箱格式并登录
      const email = `${username.trim()}@example.com`;
      const password = 'simple123'; // 固定密码

      // 先尝试登录
      let { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // 如果登录失败，说明用户不存在，自动注册
      if (signInError) {
        const { error: signUpError } = await supabase.auth.signUp({
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
          toast.error('创建账户失败: ' + signUpError.message);
          return;
        }

        // 注册成功后再次尝试登录
        const { error: secondSignInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (secondSignInError) {
          toast.error('自动登录失败: ' + secondSignInError.message);
          return;
        }
      }

      toast.success('登录成功！');
      onAuthSuccess();
    } catch (error) {
      toast.error('操作失败，请重试');
    } finally {
      setLoading(false);
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
          <p className="text-gray-600 text-sm">输入用户名即可开始</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            type="text"
            placeholder="请输入用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 text-center text-lg h-12"
            required
          />
          
          <Button 
            type="submit" 
            className="w-full hero-gradient text-white font-semibold h-12 text-lg hover:scale-105 transition-transform"
            disabled={loading || !username.trim()}
          >
            {loading ? '登录中...' : '开始旅程'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AuthPage;
