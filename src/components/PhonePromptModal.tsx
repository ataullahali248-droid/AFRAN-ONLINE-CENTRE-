import React, { useState } from 'react';
import { Phone, MapPin, Check, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const PhonePromptModal: React.FC = () => {
  const { language, t } = useLanguage();
  const { userProfile, updatePhone, promptPhoneModal, setPromptPhoneModal } = useAuth();

  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!promptPhoneModal) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError(language === 'bn' ? 'অনুগ্রহ করে সঠিক ১০ অঙ্কের মোবাইল নম্বর দিন।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await updatePhone(phone, address);
      setPromptPhoneModal(false);
    } catch (err: any) {
      setError(err?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 bg-sky-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-sky-200" />
            <h3 className="text-sm font-bold">{t('profile.need_mobile_title')}</h3>
          </div>
          <button
            onClick={() => setPromptPhoneModal(false)}
            className="p-1 rounded-lg text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
          <p className="text-slate-600 leading-relaxed">
            {t('profile.need_mobile_desc')}
          </p>

          {error && (
            <p className="p-2 rounded-lg bg-rose-50 text-rose-700 text-[11px] border border-rose-200">
              {error}
            </p>
          )}

          <div>
            <label className="block text-slate-800 font-bold mb-1">
              {t('profile.mobile')} *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">+91</span>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="7074626784"
                className="w-full pl-11 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-xs font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1">
              {language === 'bn' ? 'গ্রাম / এলাকা / ঠিকানা' : 'Village / Locality / Address'}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Farakka, West Bengal"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-xs font-medium"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPromptPhoneModal(false)}
              className="px-3 py-2 text-slate-600 hover:text-slate-800 font-semibold"
            >
              {language === 'bn' ? 'পরে করব' : 'Skip for now'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl active:scale-98 transition"
            >
              <Check className="w-4 h-4" />
              <span>{t('profile.save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
