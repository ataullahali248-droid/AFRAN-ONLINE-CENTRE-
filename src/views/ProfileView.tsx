import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  LogOut, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Save,
  MessageCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ApplicationRecord } from '../types';
import { BUSINESS_INFO } from '../data/services';

interface ProfileViewProps {
  applications: ApplicationRecord[];
  onNavigateTab: (tab: 'applications' | 'services') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  applications,
  onNavigateTab
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, userProfile, signIn, signOut, updatePhone } = useAuth();

  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const totalApps = applications.length;
  const inProgressApps = applications.filter(a => a.status !== 'completed' && a.status !== 'rejected').length;
  const completedApps = applications.filter(a => a.status === 'completed').length;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updatePhone(phone, address);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Save profile error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      language === 'bn'
        ? `নমস্কার আফরান অনলাইন সেন্টার, আমার প্রোফাইল সংক্রান্ত সহায়তার প্রয়োজন।`
        : `Hello AFRAN ONLINE CENTRE, I need support with my customer profile.`
    );
    window.open(`https://wa.me/${BUSINESS_INFO.rawWhatsappNumber}?text=${text}`, '_blank');
  };

  if (!user) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-3.5 pb-8">
        <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto">
          <User className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">{t('profile.login_required')}</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          {t('profile.login_desc')}
        </p>
        <button
          onClick={signIn}
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-98"
        >
          {t('profile.google_login')}
        </button>

        {/* Security Notice */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 max-w-xs mx-auto flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('profile.security_notice')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8 text-xs">
      {/* Profile Card Header */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'Customer'}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-200 shadow-xs shrink-0"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center text-xl font-bold shrink-0">
            {(user.displayName || user.email || 'C').charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-bold text-slate-900 truncate">
              {userProfile?.name || user.displayName || 'Customer'}
            </h2>
            <span className="text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded font-semibold border border-sky-200 shrink-0">
              Verified
            </span>
          </div>

          <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{user.email}</span>
          </p>

          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{userProfile?.phone ? `+91 ${userProfile.phone}` : (
              <span className="text-amber-600">{language === 'bn' ? 'মোবাইল নম্বর যোগ করুন' : 'Add mobile number'}</span>
            )}</span>
          </p>
        </div>
      </div>

      {/* Application Statistics KPI Strip */}
      <div className="grid grid-cols-3 gap-2.5">
        <div 
          onClick={() => onNavigateTab('applications')}
          className="p-3 bg-white rounded-2xl border border-slate-200 text-center cursor-pointer hover:border-sky-300 transition"
        >
          <span className="font-mono text-lg font-bold text-slate-900 block">{totalApps}</span>
          <span className="text-[10px] text-slate-500 font-medium">{t('profile.total_apps')}</span>
        </div>

        <div 
          onClick={() => onNavigateTab('applications')}
          className="p-3 bg-white rounded-2xl border border-amber-200 bg-amber-50/30 text-center cursor-pointer hover:border-amber-300 transition"
        >
          <span className="font-mono text-lg font-bold text-amber-700 block">{inProgressApps}</span>
          <span className="text-[10px] text-amber-800 font-medium">{t('profile.in_progress')}</span>
        </div>

        <div 
          onClick={() => onNavigateTab('applications')}
          className="p-3 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/30 text-center cursor-pointer hover:border-emerald-300 transition"
        >
          <span className="font-mono text-lg font-bold text-emerald-700 block">{completedApps}</span>
          <span className="text-[10px] text-emerald-800 font-medium">{t('profile.completed')}</span>
        </div>
      </div>

      {/* Contact Details Update Card */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-sky-600" />
            <span>{language === 'bn' ? 'যোগাযোগ ও ঠিকানা তথ্য' : 'Contact & Address'}</span>
          </h3>
          {!isEditing && (
            <button
              onClick={() => {
                setPhone(userProfile?.phone || '');
                setAddress(userProfile?.address || '');
                setIsEditing(true);
              }}
              className="text-xs font-bold text-sky-600 hover:text-sky-700"
            >
              {language === 'bn' ? 'সম্পাদনা' : 'Edit'}
            </button>
          )}
        </div>

        {saveSuccess && (
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{language === 'bn' ? 'প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে।' : 'Profile saved successfully.'}</span>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {t('profile.mobile')} (১০ অঙ্ক)
              </label>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-xs"
                placeholder="7074626784"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {language === 'bn' ? 'গ্রাম / এলাকা / ঠিকানা' : 'Address / Locality'}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-xs"
                placeholder="e.g. Uttar Mahadebnagar, Farakka"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
              >
                {t('form.cancel')}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? '...' : t('profile.save')}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2 text-slate-700">
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">{t('profile.mobile')}</span>
              <span className="font-semibold text-slate-900">{userProfile?.phone ? `+91 ${userProfile.phone}` : '—'}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-slate-100">
              <span className="text-slate-500">{language === 'bn' ? 'ঠিকানা' : 'Address'}</span>
              <span className="font-semibold text-slate-900 max-w-[200px] truncate text-right">
                {userProfile?.address || (language === 'bn' ? 'দেওয়া হয়নি' : 'Not set')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Language Preference Card */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
        <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-sky-600" />
          <span>{t('profile.language_switch')}</span>
        </h3>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setLanguage('bn')}
            className={`py-2 px-3 rounded-xl border font-bold text-xs transition ${
              language === 'bn'
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            বাংলা (Bengali)
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`py-2 px-3 rounded-xl border font-bold text-xs transition ${
              language === 'en'
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Centre Business Information */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2.5">
        <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-sky-600" />
          <span>{t('profile.centre_info')}</span>
        </h3>
        <p className="font-semibold text-slate-800">{BUSINESS_INFO.name}</p>
        <p className="text-slate-600 leading-relaxed">{BUSINESS_INFO.address}</p>

        <button
          onClick={handleOpenWhatsApp}
          className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>WhatsApp: {BUSINESS_INFO.whatsapp}</span>
        </button>
      </div>

      {/* Security & Logout */}
      <div className="space-y-2 pt-2">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('profile.security_notice')}</span>
        </div>

        <button
          onClick={signOut}
          className="w-full py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-1.5 border border-slate-200 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('profile.logout')}</span>
        </button>
      </div>
    </div>
  );
};
