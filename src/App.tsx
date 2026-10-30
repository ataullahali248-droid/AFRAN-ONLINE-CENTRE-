import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase/config';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TopBar } from './components/TopBar';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { ServicesView } from './views/ServicesView';
import { ApplicationsView } from './views/ApplicationsView';
import { NotificationsView } from './views/NotificationsView';
import { ProfileView } from './views/ProfileView';
import { ApplyModal } from './components/ApplyModal';
import { PhonePromptModal } from './components/PhonePromptModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ServiceItem, ApplicationRecord, AppNotification } from './types';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [selectedServiceForApply, setSelectedServiceForApply] = useState<ServiceItem | null>(null);
  const [selectedApplicationDetail, setSelectedApplicationDetail] = useState<ApplicationRecord | null>(null);

  // Firestore real-time customer data
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);

  // Listen to Customer's Applications
  useEffect(() => {
    if (!user) {
      setApplications([]);
      return;
    }

    setAppsLoading(true);
    const path = 'applications';
    const q = query(
      collection(db, path),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: ApplicationRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as ApplicationRecord);
        });
        setApplications(list);
        setAppsLoading(false);
      },
      (error) => {
        setAppsLoading(false);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Listen to Customer's In-App Notifications
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const path = 'notifications';
    const q = query(
      collection(db, path),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: AppNotification[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as AppNotification);
        });
        setNotifications(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    const unread = notifications.filter((n) => !n.read);
    for (const notif of unread) {
      try {
        await updateDoc(doc(db, 'notifications', notif.id), { read: true });
      } catch (err) {
        console.warn("Failed to mark notification as read", err);
      }
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Mobile-first centered Android app container */}
      <div className="w-full max-w-xl mx-auto min-h-screen bg-slate-50 flex flex-col relative shadow-sm border-x border-slate-200/60">
        {/* Android Top App Bar */}
        <TopBar />

        {/* Dynamic View Body */}
        <main className="flex-1 px-4 py-4 mb-20 overflow-x-hidden">
          {currentTab === 'home' && (
            <HomeView
              onSelectService={(service) => setSelectedServiceForApply(service)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              applications={applications}
              onViewApplication={(app) => {
                setSelectedApplicationDetail(app);
                setCurrentTab('applications');
              }}
            />
          )}

          {currentTab === 'services' && (
            <ServicesView
              onSelectService={(service) => setSelectedServiceForApply(service)}
            />
          )}

          {currentTab === 'applications' && (
            <ApplicationsView
              applications={applications}
              loading={appsLoading}
              selectedApp={selectedApplicationDetail}
              onSelectApp={(app) => setSelectedApplicationDetail(app)}
              onNavigateHome={() => setCurrentTab('home')}
            />
          )}

          {currentTab === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllAsRead}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              applications={applications}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}
        </main>

        {/* Android 5-Tab Bottom Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          applicationsCount={applications.length}
          unreadNotificationsCount={unreadNotificationsCount}
        />

        {/* Service Application Modal */}
        {selectedServiceForApply && (
          <ApplyModal
            service={selectedServiceForApply}
            isOpen={!!selectedServiceForApply}
            onClose={() => setSelectedServiceForApply(null)}
            onApplicationCreated={(appId) => {
              // Refresh or highlight
            }}
          />
        )}

        {/* Customer Mobile Number Prompt */}
        <PhonePromptModal />

        {/* Offline Connectivity Toast */}
        <OfflineIndicator />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
