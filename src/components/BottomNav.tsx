import React from 'react';
import { Home, Layers, FileText, Bell, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type TabType = 'home' | 'services' | 'applications' | 'notifications' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  applicationsCount?: number;
  unreadNotificationsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  applicationsCount = 0,
  unreadNotificationsCount = 0
}) => {
  const { t } = useLanguage();

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'services', label: t('nav.services'), icon: Layers },
    { id: 'applications', label: t('nav.applications'), icon: FileText, badge: applicationsCount > 0 ? applicationsCount : undefined },
    { id: 'notifications', label: t('nav.notifications'), icon: Bell, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined },
    { id: 'profile', label: t('nav.profile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 relative transition-all duration-150 rounded-xl ${
                isActive ? 'text-sky-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <IconComponent className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8]'}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-cyan-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight truncate max-w-[68px] ${isActive ? 'text-sky-700 font-bold' : 'text-slate-600'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-sky-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
