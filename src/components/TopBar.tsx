import React from 'react';
import { MessageCircle, Globe, ShieldCheck, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BUSINESS_INFO } from '../data/services';
import { PWAInstallButton } from './PWAInstallButton';

export const TopBar: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  const handleDirectWhatsApp = () => {
    const text = encodeURIComponent(
      language === 'bn'
        ? `নমস্কার আফরান অনলাইন সেন্টার, আমি অ্যাপ থেকে সহায়তার জন্য যোগাযোগ করছি।`
        : `Hello AFRAN ONLINE CENTRE, I am contacting you from the Customer App for assistance.`
    );
    window.open(`https://wa.me/${BUSINESS_INFO.rawWhatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-sm shrink-0 border border-white/20">
            <span className="font-extrabold text-lg tracking-wider">A</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                AFRAN ONLINE CENTRE
              </h1>
              <span className="inline-flex items-center text-[10px] text-cyan-700 bg-cyan-50 font-semibold px-1.5 py-0.5 rounded border border-cyan-200 shrink-0">
                <ShieldCheck className="w-3 h-3 mr-0.5 text-cyan-600" />
                Customer
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Farakka, WB - 742202</span>
            </p>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* PWA Install */}
          <PWAInstallButton compact />

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors min-h-[36px]"
            title="Toggle Language (বাংলা / English)"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-600" />
            <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Quick WhatsApp Contact */}
          <button
            onClick={handleDirectWhatsApp}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            title={`WhatsApp: ${BUSINESS_INFO.whatsapp}`}
            aria-label="Direct WhatsApp contact"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
