import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  MessageCircle, 
  MapPin, 
  ChevronRight, 
  Clock, 
  FileCheck2, 
  PhoneCall,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_INFO, SERVICES_CATALOG } from '../data/services';
import { ServiceItem, ApplicationRecord } from '../types';
import { ServiceCard } from '../components/ServiceCard';

interface HomeViewProps {
  onSelectService: (service: ServiceItem) => void;
  onNavigateTab: (tab: 'services' | 'applications' | 'notifications' | 'profile') => void;
  applications: ApplicationRecord[];
  onViewApplication: (app: ApplicationRecord) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectService,
  onNavigateTab,
  applications,
  onViewApplication
}) => {
  const { language, t } = useLanguage();
  const { userProfile, user, signIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: t('cat.all') },
    { id: 'aadhaar', label: t('cat.aadhaar') },
    { id: 'pan', label: t('cat.pan') },
    { id: 'voter', label: t('cat.voter') },
    { id: 'ration', label: t('cat.ration') },
    { id: 'ayushman', label: t('cat.ayushman') },
    { id: 'epfo', label: t('cat.epfo') },
    { id: 'dl', label: t('cat.dl') },
    { id: 'other', label: t('cat.other') },
  ];

  // Filter services by category and search query
  const filteredServices = SERVICES_CATALOG.filter((service) => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const titleBn = service.titleBn.toLowerCase();
    const titleEn = service.titleEn.toLowerCase();
    const subsBn = service.subServicesBn.join(' ').toLowerCase();
    const subsEn = service.subServicesEn.join(' ').toLowerCase();

    const matchesSearch =
      titleBn.includes(q) ||
      titleEn.includes(q) ||
      subsBn.includes(q) ||
      subsEn.includes(q);

    return matchesCategory && matchesSearch;
  });

  const popularServices = SERVICES_CATALOG.filter((s) => s.isPopular);
  const activeApplications = applications.filter((a) => a.status !== 'completed' && a.status !== 'rejected');

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      language === 'bn'
        ? `নমস্কার আফরান অনলাইন সেন্টার, আমার একটি সরকারি অনলাইন পরিষেবা সহায়তার প্রয়োজন।`
        : `Hello AFRAN ONLINE CENTRE, I need assistance with an online citizen service.`
    );
    window.open(`https://wa.me/${BUSINESS_INFO.rawWhatsappNumber}?text=${text}`, '_blank');
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted':
        return t('status.submitted');
      case 'under_review':
        return t('status.under_review');
      case 'processing':
        return t('status.processing');
      case 'completed':
        return t('status.completed');
      case 'rejected':
        return t('status.rejected');
      default:
        return status;
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Welcome Banner Card */}
      <section className="relative rounded-3xl bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-600 text-white p-5 sm:p-6 shadow-md overflow-hidden">
        {/* Subtle geometric circles */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute right-12 -bottom-10 w-32 h-32 rounded-full bg-cyan-400/20 blur-lg pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold text-cyan-200 uppercase tracking-wider">
              {t('brand.name')}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {t('home.welcome')},{' '}
            <span className="text-cyan-200">
              {userProfile?.name || user?.displayName || t('home.guest')}
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-sky-100 mt-1.5 leading-relaxed">
            {language === 'bn' 
              ? 'আধার, প্যান, ভোটার, রেশন কার্ড সহ সকল সরকারি অনলাইন পরিষেবা সহজে ঘরে বসে আবেদন করুন।' 
              : 'Apply easily for Aadhaar, PAN, Voter, Ration Card and other citizen services.'}
          </p>

          {!user ? (
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <button
                onClick={signIn}
                className="px-4 py-2 bg-white text-sky-800 text-xs font-bold rounded-xl shadow-xs hover:bg-sky-50 transition active:scale-98"
              >
                {t('profile.google_login')}
              </button>
              <button
                onClick={handleOpenWhatsApp}
                className="px-3.5 py-2 bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </button>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('services')}
                className="px-4 py-2 bg-white text-sky-800 text-xs font-bold rounded-xl shadow-xs hover:bg-sky-50 transition flex items-center gap-1.5 active:scale-98"
              >
                <span>{t('home.apply_new')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleOpenWhatsApp}
                className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 active:scale-98 backdrop-blur-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Search Bar */}
      <section className="relative">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('home.search_placeholder')}
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-semibold"
          >
            Clear
          </button>
        )}
      </section>

      {/* Active Application Status Banner (if customer has active submissions) */}
      {user && activeApplications.length > 0 && (
        <section className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{t('home.active_apps')} ({activeApplications.length})</span>
            </div>
            <button
              onClick={() => onNavigateTab('applications')}
              className="text-[11px] font-bold text-sky-700 hover:text-sky-800 flex items-center gap-0.5"
            >
              <span>{t('home.view_all_apps')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 pt-1">
            {activeApplications.slice(0, 2).map((app) => (
              <div
                key={app.id}
                onClick={() => onViewApplication(app)}
                className="p-3 bg-white rounded-xl border border-amber-200/60 flex items-center justify-between cursor-pointer hover:border-amber-300 transition"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-slate-900">{app.id}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                      {getStatusLabel(app.status)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">{app.serviceTitle}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Horizontal Category Filter Strip */}
      <section className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors ${
                isSelected
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </section>

      {/* Popular Services Section (when not searching specific queries) */}
      {!searchQuery && selectedCategory === 'all' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{t('home.popular_title')}</span>
            </h3>
            <button
              onClick={() => onNavigateTab('services')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center"
            >
              <span>{t('home.view_all_apps')}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {popularServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={onSelectService}
                featured
              />
            ))}
          </div>
        </section>
      )}

      {/* All / Filtered Services Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            {searchQuery
              ? `${language === 'bn' ? 'অনুসন্ধানের ফলাফল' : 'Search Results'} (${filteredServices.length})`
              : t('home.all_services')}
          </h3>
          <span className="text-xs text-slate-500">
            {filteredServices.length} {language === 'bn' ? 'টি পরিষেবা' : 'services'}
          </span>
        </div>

        {filteredServices.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো পরিষেবা পাওয়া যায়নি।'
                : 'No services match your search query.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={onSelectService}
              />
            ))}
          </div>
        )}
      </section>

      {/* Business Information & WhatsApp Support Card */}
      <section className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">{BUSINESS_INFO.name}</h4>
            <p className="text-[11px] text-slate-500">{t('brand.tagline')}</p>
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <p className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{BUSINESS_INFO.address}</span>
          </p>
          <p className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-800">WhatsApp: {BUSINESS_INFO.whatsapp}</span>
          </p>
        </div>

        <button
          onClick={handleOpenWhatsApp}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition active:scale-98 shadow-xs"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>{t('home.whatsapp_btn')}</span>
        </button>
      </section>
    </div>
  );
};
