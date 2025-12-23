import React from 'react';
import { useTranslation } from 'react-i18next';
import headImage from '../../assets/headimage1.png';
import { Button } from '@/components/ui/button';
import { Globe, Settings, Trash2 } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

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
  const { t } = useTranslation('chat');

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <button
            onClick={onAvatarClick}
            className="w-10 h-10 bg-gray-900 rounded-full overflow-hidden flex items-center justify-center hover:bg-gray-700 transition-colors"
        >
          <img
              src={headImage}
              alt={t('header.avatarAlt')}
              className="w-full h-full object-cover"
          />
        </button>
        <div>
          <h1 className="text-gray-900 font-semibold">{t('header.assistantName')}</h1>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <LanguageSwitcher />
        <Button
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            className="text-gray-900 p-2 hover:bg-gray-100 hover:scale-105 transition-all"
            title={t('header.clearChat')}
        >
          <Trash2 className="w-5 h-5"/>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOnboardingClick}
          className="text-gray-900 p-2 hover:bg-gray-100 hover:scale-105 transition-all"
          title={t('header.resetGoals')}
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
