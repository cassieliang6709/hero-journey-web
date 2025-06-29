
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Settings, Trash2 } from 'lucide-react';

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
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <button
          onClick={onAvatarClick}
          className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
        >
          <span className="text-xl">{avatars[selectedAvatar]}</span>
        </button>
        <div>
          <h1 className="text-gray-900 font-semibold">小精灵</h1>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearChat}
          className="text-gray-900 p-2 hover:bg-gray-100 hover:scale-105 transition-all"
          title="清空聊天记录"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOnboardingClick}
          className="text-gray-900 p-2 hover:bg-gray-100 hover:scale-105 transition-all"
          title="重新设置目标"
        >
          <Settings className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onGoToStarMap}
          className="text-gray-900 p-2 hover:bg-gray-100 hover:scale-105 transition-all"
        >
          <Globe className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
