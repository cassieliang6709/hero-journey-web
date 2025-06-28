
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="mobile-container gradient-bg flex items-center justify-center p-6">
      <Card className="w-full max-w-sm glass-effect p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 hero-gradient rounded-full flex items-center justify-center animate-pulse-glow">
            <span className="text-3xl">🦸</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">英雄之旅</h1>
          <p className="text-gray-300 text-sm">开始你的成长之旅</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 text-center text-lg h-12"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full hero-gradient text-white font-semibold h-12 text-lg hover:scale-105 transition-transform"
            disabled={!username.trim()}
          >
            开始旅程
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
