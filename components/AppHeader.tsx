import React from 'react';
import InfoIcon from './icons/InfoIcon';
import { useSettings } from '../hooks/useSettings';
import { t } from '../i18n';

interface AppHeaderProps {
  onInfoClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onInfoClick }) => {
  const { settings } = useSettings();

  return (
    <div className="flex items-center justify-between gap-2 p-2 sm:p-3">
      <span className="text-lg sm:text-xl font-semibold text-white tracking-tight flex-1">{t('assistantName', settings.language)}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onInfoClick();
        }}
        className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors duration-150"
        aria-label={t('info', settings.language)}
      >
        <InfoIcon className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};

export default AppHeader;
