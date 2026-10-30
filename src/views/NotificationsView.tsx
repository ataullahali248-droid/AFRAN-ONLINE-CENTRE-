import React from 'react';
import { Bell, CheckCheck, FileText, Info, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { AppNotification } from '../types';

interface NotificationsViewProps {
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onNavigateTab: (tab: 'applications') => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  onNavigateTab
}) => {
  const { language, t } = useLanguage();
  const { user, signIn } = useAuth();

  if (!user) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
        <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto">
          <Bell className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">{t('profile.login_required')}</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          {t('profile.login_desc')}
        </p>
        <button
          onClick={signIn}
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          {t('profile.google_login')}
        </button>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{t('notif.title')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {unreadCount > 0 
              ? `${unreadCount} ${language === 'bn' ? 'টি অপঠিত বিজ্ঞপ্তি' : 'unread notifications'}`
              : (language === 'bn' ? 'সকল বিজ্ঞপ্তি আপডেট' : 'All notifications up to date')}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{t('notif.mark_all_read')}</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <Bell className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500">{t('notif.empty')}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (notif.applicationId) onNavigateTab('applications');
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                notif.read
                  ? 'bg-white border-slate-200'
                  : 'bg-sky-50/70 border-sky-300 ring-1 ring-sky-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${notif.read ? 'bg-slate-100 text-slate-600' : 'bg-sky-600 text-white'}`}>
                  {notif.type === 'application_submitted' ? (
                    <FileText className="w-4 h-4" />
                  ) : notif.type === 'status_update' ? (
                    <Sparkles className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleDateString(language === 'bn' ? 'bn-IN' : 'en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  {notif.applicationId && (
                    <span className="inline-block font-mono text-[10px] font-semibold text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded mt-1.5">
                      ID: {notif.applicationId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
