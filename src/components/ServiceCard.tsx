import React from 'react';
import { 
  CreditCard, 
  FileCheck, 
  HeartHandshake, 
  Briefcase, 
  Car, 
  Layers, 
  ChevronRight, 
  FileText,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ServiceItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ServiceCardProps {
  service: ServiceItem;
  onSelect: (service: ServiceItem) => void;
  featured?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect, featured = false }) => {
  const { language, t } = useLanguage();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'aadhaar':
        return <ShieldCheck className="w-5 h-5 text-sky-600" />;
      case 'pan':
        return <CreditCard className="w-5 h-5 text-indigo-600" />;
      case 'voter':
        return <FileCheck className="w-5 h-5 text-blue-600" />;
      case 'ration':
        return <FileText className="w-5 h-5 text-teal-600" />;
      case 'ayushman':
        return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      case 'epfo':
        return <Briefcase className="w-5 h-5 text-cyan-600" />;
      case 'dl':
        return <Car className="w-5 h-5 text-amber-600" />;
      default:
        return <Layers className="w-5 h-5 text-sky-600" />;
    }
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'aadhaar':
        return 'border-sky-200 bg-sky-50/50 hover:border-sky-300';
      case 'pan':
        return 'border-indigo-200 bg-indigo-50/50 hover:border-indigo-300';
      case 'voter':
        return 'border-blue-200 bg-blue-50/50 hover:border-blue-300';
      case 'ration':
        return 'border-teal-200 bg-teal-50/50 hover:border-teal-300';
      case 'ayushman':
        return 'border-rose-200 bg-rose-50/50 hover:border-rose-300';
      case 'epfo':
        return 'border-cyan-200 bg-cyan-50/50 hover:border-cyan-300';
      case 'dl':
        return 'border-amber-200 bg-amber-50/50 hover:border-amber-300';
      default:
        return 'border-slate-200 bg-slate-50/50 hover:border-slate-300';
    }
  };

  const title = language === 'bn' ? service.titleBn : service.titleEn;
  const description = language === 'bn' ? service.shortDescBn : service.shortDescEn;
  const subServices = language === 'bn' ? service.subServicesBn : service.subServicesEn;

  return (
    <div
      onClick={() => onSelect(service)}
      className={`group relative rounded-2xl bg-white border p-4 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer active:scale-[0.99] flex flex-col justify-between ${
        featured ? 'border-sky-300 ring-1 ring-sky-200 bg-gradient-to-b from-sky-50/30 to-white' : 'border-slate-200 hover:border-sky-300'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className={`p-2.5 rounded-xl border ${getCategoryTheme(service.category)}`}>
            {getCategoryIcon(service.category)}
          </div>
          {service.permanentBookingAvailable && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 bg-sky-100/90 border border-sky-300 px-2 py-0.5 rounded-md">
              <Sparkles className="w-3 h-3 text-sky-600" />
              {t('service.permanent_badge')}
            </span>
          )}
        </div>

        <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Sub-services preview pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {subServices.slice(0, 2).map((sub, idx) => (
            <span
              key={idx}
              className="text-[11px] text-slate-700 bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200/70 truncate max-w-full"
            >
              {sub}
            </span>
          ))}
          {subServices.length > 2 && (
            <span className="text-[10px] text-slate-500 font-medium px-1 py-0.5 self-center">
              +{subServices.length - 2} {language === 'bn' ? 'আরও' : 'more'}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500">
          {service.requiredDocs.length} {language === 'bn' ? 'টি নথি প্রয়োজন' : 'Docs Required'}
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 group-hover:text-sky-800"
        >
          <span>{t('service.apply_now')}</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
