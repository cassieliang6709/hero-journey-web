
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
      const email = `${username.trim()}@herojourney.app`;
      const password = 'herojourney123';

      console.log('尝试登录:', email);

      // 先尝试登录
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.log('登录失败，尝试注册:', signInError.message);
        
        // 如果登录失败，尝试注册（不需要邮件确认）
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.trim()
            }
          }
        });

        if (signUpError) {
          console.error('注册错误:', signUpError);
          toast.error(`注册失败：${signUpError.message}`);
          return;
        }

        // 注册成功后检查是否有session
        if (signUpData.session) {
          console.log('注册并直接登录成功');
          toast.success('注册成功，欢迎使用！');
          onAuthSuccess();
        } else if (signUpData.user && !signUpData.session) {
          console.log('注册成功但需要确认邮件');
          toast.error('注册成功但需要邮件确认，请联系管理员');
        }
      } else {
        // 登录成功
        console.log('登录成功');
        toast.success('登录成功！');
        onAuthSuccess();
      }
    } catch (error) {
      console.error('认证过程中发生错误:', error);
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
          <p className="text-gray-600 text-sm">
            输入用户名即可开始
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
            {loading ? '登录中...' : '开始旅程'}
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
