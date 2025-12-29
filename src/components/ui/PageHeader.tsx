import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showLanguageSwitcher?: boolean;
  rightContent?: React.ReactNode;
  variant?: 'light' | 'dark';
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onBack,
  showLanguageSwitcher = true,
  rightContent,
  variant = 'light'
}) => {
  const isDark = variant === 'dark';
  
  return (
    <div className={`flex items-center justify-between p-4 border-b ${
      isDark 
        ? 'bg-black/20 backdrop-blur-sm border-white/10' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-3">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className={`p-0 hover:scale-105 transition-all ${
              isDark 
                ? 'text-white hover:bg-white/10' 
                : 'text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h1 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        {showLanguageSwitcher && <LanguageSwitcher />}
        {rightContent}
      </div>
    </div>
  );
};

export default PageHeader;
