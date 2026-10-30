import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SERVICES_CATALOG } from '../data/services';
import { ServiceItem } from '../types';
import { ServiceCard } from '../components/ServiceCard';

interface ServicesViewProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onSelectService }) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredServices = SERVICES_CATALOG.filter((service) => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const titleBn = service.titleBn.toLowerCase();
    const titleEn = service.titleEn.toLowerCase();
    const subsBn = service.subServicesBn.join(' ').toLowerCase();
    const subsEn = service.subServicesEn.join(' ').toLowerCase();

    return matchesCategory && (
      titleBn.includes(q) ||
      titleEn.includes(q) ||
      subsBn.includes(q) ||
      subsEn.includes(q)
    );
  });

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">{t('home.all_services')}</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {language === 'bn' 
            ? 'সরকারি ও ডিজিটাল নাগরিক পরিষেবা তালিকা' 
            : 'Explore all available citizen services and document requirements'}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('home.search_placeholder')}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Category Tabs */}
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-1">
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
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onSelect={onSelectService}
          />
        ))}
      </div>
    </div>
  );
};
