
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
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          toast.error('登录失败: ' + error.message);
        } else {
          toast.success('登录成功！');
          onAuthSuccess();
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              username: username || email.split('@')[0]
            }
          }
        });
        
        if (error) {
          toast.error('注册失败: ' + error.message);
        } else {
          toast.success('注册成功！请检查邮箱进行验证。');
        }
      }
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isLogin ? '登录' : '注册'}
          </h1>
          <p className="text-gray-600 text-sm">
            {isLogin ? '欢迎回来！' : '创建您的账户'}
          </p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <Input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white border-gray-300 text-gray-800"
            />
          )}
          
          <Input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border-gray-300 text-gray-800"
            required
          />
          
          <Input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white border-gray-300 text-gray-800"
            required
          />
          
          <Button 
            type="submit" 
            className="w-full hero-gradient text-white font-semibold h-12"
            disabled={loading}
          >
            {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </Button>
        </form>
        
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            {isLogin ? '没有账户？立即注册' : '已有账户？立即登录'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
