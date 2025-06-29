
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
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors overflow-hidden"
        >
          <img
            src="http://47.96.231.221:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwLzEzMTUxMTg1NzA4OTU1NzI5OTIvMzI5MTc1MTE4MzE1NF8ucGljX2hkLmpwZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUpFNE4yNVMxQkM0Uk5ZVFpYSUNVJTJGMjAyNTA2MjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNjI5VDA4MTgxN1omWC1BbXotRXhwaXJlcz00MzIwMCZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSktSVFJPTWpWVE1VSkRORkpPV1ZSYVdFbERWU0lzSW1WNGNDSTZNVGMxTVRJeU9ERXpNQ3dpY0dGeVpXNTBJam9pYldsdWFXOWZTSE5hV25oRUluMC42enVIZi01VEFZbFdDekFQSVRJbVB5MGR6XzFkT19xa0h6UXJ4MjZxb0Y0NExGM3BOSVpBM2RHV3p1RTczVE1zNU5uZEVjWGFscHdBY2xfYnhhRVdhdyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPThjNGNiZjM2MDdhOGIzNTJlODlhZjA0YjEyZTM2MGMxMTRjOGJkYzA0ZDhiM2ZmMGU0NzY0YTcwN2E0ZGU3ZDM"
            alt="AI Avatar"
            className="w-full h-full object-cover rounded-full"
          />
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
