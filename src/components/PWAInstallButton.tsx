import React, { useEffect, useState } from 'react';
import { Download, Share2, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Prompt user or inform about browser install
      alert(language === 'bn' 
        ? 'আপনার ব্রাউজার মেনু থেকে "Add to Home Screen" বা "অ্যাপ ইনস্টল করুন" সিলেক্ট করুন।' 
        : 'Please select "Add to Home screen" or "Install App" from your browser menu.');
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title={language === 'bn' ? 'অ্যান্ড্রয়েড অ্যাপ ইনস্টল করুন' : 'Install Android App'}
        className={`inline-flex items-center gap-1.5 font-medium transition-colors text-cyan-900 bg-cyan-100/90 hover:bg-cyan-200 border border-cyan-300 rounded-lg active:scale-95 ${
          compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
        }`}
      >
        <Download className="w-3.5 h-3.5 text-cyan-700" />
        <span>{language === 'bn' ? 'অ্যাপ ডাউনলোড' : 'Install App'}</span>
      </button>

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">
                {language === 'bn' ? 'হোম স্ক্রিনে অ্যাপ যুক্ত করুন' : 'Install on iPhone / iPad'}
              </h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold shrink-0">1</span>
                <p>
                  {language === 'bn' ? 'সাফারি ব্রাউজারের নিচের' : 'Tap the'}{' '}
                  <strong>{language === 'bn' ? 'শেয়ার (Share)' : 'Share'}</strong>{' '}
                  <Share2 className="inline w-4 h-4 mx-1 text-blue-600" />{' '}
                  {language === 'bn' ? 'আইকনে ট্যাপ করুন।' : 'button in Safari.'}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold shrink-0">2</span>
                <p>
                  {language === 'bn' 
                    ? 'নিচে স্ক্রোল করে "Add to Home Screen" অপশনে ক্লিক করুন।' 
                    : 'Scroll down and tap "Add to Home Screen".'}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold shrink-0">3</span>
                <p>
                  {language === 'bn' 
                    ? 'উপরে "Add" চাপুন। অ্যাপটি সাধারণ অ্যান্ড্রয়েড/আইওএস অ্যাপের মতো কাজ করবে।' 
                    : 'Tap "Add" in the top corner to complete.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 active:scale-98 transition"
            >
              {language === 'bn' ? 'বুঝেছি' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
