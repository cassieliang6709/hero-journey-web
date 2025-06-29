
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Settings, Trash2, Sparkles } from 'lucide-react';

interface ChatHeaderProps {
  selectedAvatar: number;
  onAvatarClick: () => void;
  onClearChat: () => void;
  onOnboardingClick: () => void;
  onGoToStarMap: () => void;
}

const avatars = ['🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '👑', '⚡', '🔥', '🌟'];

const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedAvatar,
  onAvatarClick,
  onClearChat,
  onOnboardingClick,
  onGoToStarMap
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 border-b border-purple-300">
      <div className="flex items-center space-x-3">
        <button
          onClick={onAvatarClick}
          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110 ring-2 ring-white/30"
        >
          <span className="text-xl">{avatars[selectedAvatar]}</span>
        </button>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          <h1 className="text-white font-bold text-lg drop-shadow-lg">小精灵</h1>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearChat}
          className="text-white/90 p-2 hover:bg-white/20 hover:scale-105 transition-all backdrop-blur-sm rounded-full"
          title="清空聊天记录"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOnboardingClick}
          className="text-white/90 p-2 hover:bg-white/20 hover:scale-105 transition-all backdrop-blur-sm rounded-full"
          title="重新设置目标"
        >
          <Settings className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onGoToStarMap}
          className="text-white/90 p-2 hover:bg-white/20 hover:scale-105 transition-all backdrop-blur-sm rounded-full bg-white/10 ring-2 ring-white/20"
        >
          <Globe className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
