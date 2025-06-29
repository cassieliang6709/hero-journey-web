
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface BecomingPageProps {
  onAuthSuccess: () => void;
}

const BecomingPage: React.FC<BecomingPageProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUp, signIn } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(email.trim(), password, username.trim() || undefined);
      } else {
        result = await signIn(email.trim(), password);
      }

      if (!result.error) {
        onAuthSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container gradient-bg flex items-center justify-center p-6">
      <Card className="w-full max-w-sm glass-effect p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 hero-gradient rounded-full flex items-center justify-center animate-pulse-glow">
            <span className="text-3xl">🦸</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Becoming</h1>
          <p className="text-white text-sm">
            {isSignUp ? '创建账户开始你的旅程' : '登录继续你的成长之路'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="请输入邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 text-center text-lg h-12"
            required
          />
          
          <Input
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 text-center text-lg h-12"
            required
          />

          {isSignUp && (
            <Input
              type="text"
              placeholder="请输入用户名（可选）"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 text-center text-lg h-12"
            />
          )}
          
          <Button 
            type="submit" 
            className="w-full hero-gradient text-white font-semibold h-12 text-lg hover:scale-105 transition-transform"
            disabled={loading || !email.trim() || !password.trim()}
          >
            {loading ? '处理中...' : (isSignUp ? '注册账户' : '登录')}
          </Button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white hover:text-gray-200 text-sm"
            >
              {isSignUp ? '已有账户？点击登录' : '没有账户？点击注册'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BecomingPage;
