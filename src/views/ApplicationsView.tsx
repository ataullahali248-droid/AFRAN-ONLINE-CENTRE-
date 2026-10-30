import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  X, 
  MessageCircle, 
  Paperclip, 
  Sparkles,
  Calendar,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ApplicationRecord, ApplicationStatus } from '../types';
import { BUSINESS_INFO } from '../data/services';

interface ApplicationsViewProps {
  applications: ApplicationRecord[];
  loading: boolean;
  selectedApp: ApplicationRecord | null;
  onSelectApp: (app: ApplicationRecord | null) => void;
  onNavigateHome: () => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  loading,
  selectedApp,
  onSelectApp,
  onNavigateHome
}) => {
  const { language, t } = useLanguage();
  const { user, signIn } = useAuth();
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return {
          label: t('status.submitted'),
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-500'
        };
      case 'under_review':
        return {
          label: t('status.under_review'),
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'processing':
        return {
          label: t('status.processing'),
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-600'
        };
      case 'completed':
        return {
          label: t('status.completed'),
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500'
        };
      case 'rejected':
        return {
          label: t('status.rejected'),
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500'
        };
    }
  };

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const handleSendWhatsAppSlip = (app: ApplicationRecord) => {
    const text = encodeURIComponent(
      `*AFRAN ONLINE CENTRE — Application Inquiry*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📌 *Application ID:* ${app.id}\n` +
      `👤 *Customer Name:* ${app.customerName}\n` +
      `📞 *Mobile:* ${app.customerPhone}\n` +
      `📋 *Service:* ${app.serviceTitle}\n` +
      `🔍 *Sub-Service:* ${app.subService}\n` +
      `📊 *Current Status:* ${app.status.toUpperCase()}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Hello, I would like to check the latest update on this application. Thank you!`
    );
    window.open(`https://wa.me/${BUSINESS_INFO.rawWhatsappNumber}?text=${text}`, '_blank');
  };

  if (!user) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
        <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6" />
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

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">{t('apps.title')}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{t('apps.subtitle')}</p>
      </div>

      {/* Status Filter Chips */}
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-1">
        {(['all', 'submitted', 'under_review', 'processing', 'completed', 'rejected'] as const).map((st) => {
          const isSelected = statusFilter === st;
          let label = t('cat.all');
          if (st !== 'all') {
            label = t(`status.${st}`).split(' ')[0];
          }
          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          {language === 'bn' ? 'আবেদন তালিকা লোড হচ্ছে...' : 'Loading applications...'}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">{t('apps.empty_title')}</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {t('apps.empty_desc')}
          </p>
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl hover:bg-sky-700 transition"
          >
            {t('home.apply_new')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app) => {
            const badge = getStatusBadge(app.status);
            return (
              <div
                key={app.id}
                onClick={() => onSelectApp(app)}
                className="group p-4 bg-white rounded-2xl border border-slate-200 hover:border-sky-300 shadow-xs transition-all cursor-pointer space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                    {app.id}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${badge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {app.serviceTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">{app.subService}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(app.createdAt).toLocaleDateString(language === 'bn' ? 'bn-IN' : 'en-IN')}</span>
                  </span>

                  <span className="font-semibold text-sky-700 group-hover:underline flex items-center gap-0.5">
                    <span>{t('apps.view_details')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">{t('apps.details_modal_title')}</span>
                <div className="font-mono text-base font-bold text-cyan-400">{selectedApp.id}</div>
              </div>
              <button
                onClick={() => onSelectApp(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Status Header */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">{t('success.status')}</span>
                  <span className="text-xs font-bold text-slate-900">
                    {getStatusBadge(selectedApp.status).label}
                  </span>
                </div>
                {selectedApp.bookingType === 'permanent' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md border border-cyan-300">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    {t('service.permanent_booking')}
                  </span>
                )}
              </div>

              {/* Status Note / Remarks */}
              {selectedApp.statusNote && (
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 space-y-1">
                  <span className="font-bold block text-[11px]">
                    {language === 'bn' ? 'সেন্টারের মন্তব্য / নির্দেশিকা:' : 'Centre Remarks:'}
                  </span>
                  <p className="text-xs">{selectedApp.statusNote}</p>
                </div>
              )}

              {/* Application Details Summary */}
              <div className="space-y-2 border border-slate-200 rounded-xl p-3.5 bg-white">
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-[11px] text-slate-400 block">{language === 'bn' ? 'পরিষেবা' : 'Service'}</span>
                    <strong className="text-slate-900">{selectedApp.serviceTitle}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">{language === 'bn' ? 'উপ-পরিষেবা' : 'Sub-Service'}</span>
                    <span className="text-slate-800">{selectedApp.subService}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">{language === 'bn' ? 'গ্রাহক' : 'Customer'}</span>
                    <span className="text-slate-800">{selectedApp.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">{language === 'bn' ? 'ফোন নম্বর' : 'Phone'}</span>
                    <span className="text-slate-800">+91 {selectedApp.customerPhone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[11px] text-slate-400 block">{language === 'bn' ? 'তারিখ ও সময়' : 'Submission Date'}</span>
                    <span className="text-slate-800">
                      {new Date(selectedApp.createdAt).toLocaleString(language === 'bn' ? 'bn-IN' : 'en-IN')}
                    </span>
                  </div>
                  {selectedApp.notes && (
                    <div className="col-span-2">
                      <span className="text-[11px] text-slate-400 block">{language === 'bn' ? 'বিশেষ মন্তব্য' : 'Notes'}</span>
                      <span className="text-slate-700 italic">{selectedApp.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Attached Documents */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-sky-600" />
                  <span>{t('apps.attached_docs')} ({selectedApp.documents?.length || 0})</span>
                </h4>

                {(!selectedApp.documents || selectedApp.documents.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">{t('apps.no_docs')}</p>
                ) : (
                  <div className="space-y-2">
                    {selectedApp.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-slate-900 truncate">{doc.docName}</p>
                          <p className="text-[10px] text-slate-500 truncate">{doc.fileName} • {(doc.fileSize / 1024).toFixed(1)} KB</p>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 font-semibold px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                          {language === 'bn' ? 'সুরক্ষিত সংরক্ষিত' : 'Verified'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* WhatsApp Notification Status */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 block">{t('success.whatsapp_status')}</span>
                  <span className="font-semibold text-amber-700">
                    {selectedApp.whatsappNotificationStatus === 'pending'
                      ? t('success.pending_whatsapp')
                      : t('success.sent_whatsapp')}
                  </span>
                </div>
                <button
                  onClick={() => handleSendWhatsAppSlip(selectedApp)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 transition text-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500">
                {BUSINESS_INFO.landmark}
              </span>
              <button
                onClick={() => onSelectApp(null)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl text-xs hover:bg-slate-800 transition"
              >
                {t('success.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
