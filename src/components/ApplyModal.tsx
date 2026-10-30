import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Check, 
  Upload, 
  AlertCircle, 
  ShieldCheck, 
  MessageCircle, 
  Sparkles, 
  Clock, 
  ChevronRight,
  ChevronLeft,
  FileCheck,
  Info
} from 'lucide-react';
import { ServiceItem, BookingType, UploadedDoc } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { BUSINESS_INFO } from '../data/services';

interface ApplyModalProps {
  service: ServiceItem;
  isOpen: boolean;
  onClose: () => void;
  onApplicationCreated: (appId: string) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  service,
  isOpen,
  onClose,
  onApplicationCreated,
}) => {
  const { language, t } = useLanguage();
  const { user, userProfile, signIn, updatePhone } = useAuth();

  // Step flow: 1 (Service & Booking) -> 2 (Applicant Details) -> 3 (Documents) -> 4 (Consent & Review) -> 5 (Success)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [selectedSubService, setSelectedSubService] = useState<string>(() => {
    return (language === 'bn' ? service.subServicesBn[0] : service.subServicesEn[0]) || '';
  });
  const [bookingType, setBookingType] = useState<BookingType>('standard');
  const [customerName, setCustomerName] = useState<string>(userProfile?.name || user?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState<string>(userProfile?.phone || '');
  const [customerAddress, setCustomerAddress] = useState<string>(userProfile?.address || '');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  
  // Custom Dynamic Fields based on category
  const [formFieldValues, setFormFieldValues] = useState<Record<string, string>>({});
  
  // Uploaded documents state
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedDoc>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success state
  const [createdApplicationId, setCreatedApplicationId] = useState<string | null>(null);
  const [whatsappStatus, setWhatsappStatus] = useState<'pending' | 'sent' | 'not_configured'>('pending');

  if (!isOpen) return null;

  // Handle file selection and conversion to preview / base64
  const handleFileUpload = (docDefId: string, docName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'bn' ? 'নথির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।' : 'File size must be under 5MB.');
      return;
    }

    setUploadProgress(prev => ({ ...prev, [docDefId]: 10 }));

    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(prev => ({ ...prev, [docDefId]: Math.min(90, percent) }));
      }
    };

    reader.onload = () => {
      const resultData = reader.result as string;
      const docItem: UploadedDoc = {
        docId: docDefId,
        docName,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        // Store clean preview string (capped for Firestore document efficiency)
        fileData: resultData.length < 300000 ? resultData : resultData.slice(0, 1000) + '...[secure_blob]',
        uploadedAt: new Date().toISOString()
      };

      setUploadedDocs(prev => ({ ...prev, [docDefId]: docItem }));
      setUploadProgress(prev => ({ ...prev, [docDefId]: 100 }));
    };

    reader.onerror = () => {
      alert(language === 'bn' ? 'ফাইল পড়তে ত্রুটি হয়েছে।' : 'Error reading file.');
      setUploadProgress(prev => ({ ...prev, [docDefId]: 0 }));
    };

    reader.readAsDataURL(file);
  };

  const handleNextStep = () => {
    setErrorMessage(null);

    if (currentStep === 1) {
      if (!selectedSubService) {
        setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে একটি নির্দিষ্ট পরিষেবা বেছে নিন।' : 'Please select a specific sub-service.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!customerName.trim()) {
        setErrorMessage(language === 'bn' ? 'আবেদনকারীর নাম লিখুন।' : 'Please enter applicant name.');
        return;
      }
      const phoneDigits = customerPhone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        setErrorMessage(language === 'bn' ? 'সঠিক ১০ অঙ্কের মোবাইল নম্বর দিন।' : 'Please enter a valid 10-digit mobile number.');
        return;
      }
      // Save phone to profile if missing
      if (user && (!userProfile?.phone || userProfile.phone !== customerPhone)) {
        updatePhone(customerPhone, customerAddress).catch(console.error);
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Validate mandatory documents
      const mandatoryMissing = service.requiredDocs.filter(d => d.isMandatory && !uploadedDocs[d.id]);
      if (mandatoryMissing.length > 0) {
        setErrorMessage(
          language === 'bn'
            ? `অনুগ্রহ করে সকল বাধ্যতামূলক নথি আপলোড করুন: ${mandatoryMissing.map(m => m.nameBn).join(', ')}`
            : `Please upload mandatory documents: ${mandatoryMissing.map(m => m.nameEn).join(', ')}`
        );
        return;
      }
      setCurrentStep(4);
    }
  };

  const handleSubmitApplication = async () => {
    if (!consentAccepted) {
      setErrorMessage(t('form.consent_error'));
      return;
    }

    if (!user) {
      try {
        await signIn();
      } catch {
        setErrorMessage(language === 'bn' ? 'লগইন ব্যর্থ হয়েছে।' : 'Sign-in failed.');
        return;
      }
    }

    if (!user) {
      setErrorMessage(language === 'bn' ? 'আবেদন জমা দিতে লগইন আবশ্যক।' : 'Sign-in required to submit.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    // Generate unique Application ID: AOC-2026-XXXX (4-digit random number)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const appId = `AOC-2026-${randomSuffix}`;

    const newApplication = {
      id: appId,
      userId: user.uid,
      customerName: customerName.trim(),
      customerEmail: user.email || '',
      customerPhone: customerPhone.trim(),
      serviceId: service.id,
      serviceCategory: service.category,
      serviceTitle: language === 'bn' ? service.titleBn : service.titleEn,
      subService: selectedSubService,
      bookingType,
      status: 'submitted' as const,
      statusNote: language === 'bn' ? 'আবেদন জমা হয়েছে। সেন্টারের কর্মী পর্যালোচনা করছেন।' : 'Application received. Pending review by centre staff.',
      notes: customerNotes.trim(),
      applicantDetails: {
        address: customerAddress.trim(),
        ...formFieldValues
      },
      documents: Object.values(uploadedDocs),
      // WhatsApp notification configuration check:
      // "If WhatsApp API credentials are not configured, save the application and clearly show a pending notification state. Do not pretend that a message was sent."
      whatsappNotificationStatus: 'pending' as const,
      consentAccepted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const appRef = doc(db, 'applications', appId);
      try {
        await setDoc(appRef, newApplication);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `applications/${appId}`);
      }

      // Also create an in-app notification for the user
      const notifId = `notif-${Date.now()}`;
      const notifRef = doc(db, 'notifications', notifId);
      const notifData = {
        id: notifId,
        userId: user.uid,
        applicationId: appId,
        title: language === 'bn' ? 'আবেদন সফলভাবে গৃহীত হয়েছে' : 'Application Received',
        message: language === 'bn' 
          ? `আপনার ${newApplication.serviceTitle} আবেদন (${appId}) জমা হয়েছে।` 
          : `Your application (${appId}) for ${newApplication.serviceTitle} has been submitted.`,
        type: 'application_submitted' as const,
        read: false,
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(notifRef, notifData);
      } catch (err) {
        console.warn("Notification document warning:", err);
      }

      setCreatedApplicationId(appId);
      setWhatsappStatus('pending');
      setCurrentStep(5);
      onApplicationCreated(appId);
    } catch (error: any) {
      console.error("Submission failed:", error);
      setErrorMessage(error?.message || (language === 'bn' ? 'আবেদন জমা দিতে সমস্যা হয়েছে।' : 'Failed to submit application.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendViaWhatsApp = () => {
    if (!createdApplicationId) return;
    const bookingLabel = bookingType === 'permanent' ? 'Permanent Booking' : 'Standard';
    const message = encodeURIComponent(
      `*AFRAN ONLINE CENTRE — Application Submission Slip*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📌 *Application ID:* ${createdApplicationId}\n` +
      `👤 *Customer Name:* ${customerName}\n` +
      `📞 *Mobile:* ${customerPhone}\n` +
      `📋 *Service:* ${language === 'bn' ? service.titleBn : service.titleEn}\n` +
      `🔍 *Sub-Service:* ${selectedSubService}\n` +
      `⭐ *Booking Type:* ${bookingLabel}\n` +
      `📑 *Documents Attached:* ${Object.keys(uploadedDocs).length} files\n` +
      `📍 *Centre:* Farakka, West Bengal (742202)\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Please review my application. Thank you!`
    );
    window.open(`https://wa.me/${BUSINESS_INFO.rawWhatsappNumber}?text=${message}`, '_blank');
  };

  const serviceTitle = language === 'bn' ? service.titleBn : service.titleEn;
  const subServices = language === 'bn' ? service.subServicesBn : service.subServicesEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-600 text-white flex items-center justify-between shrink-0">
          <div className="min-w-0 pr-2">
            <h2 className="text-base font-bold truncate">{serviceTitle}</h2>
            <div className="flex items-center gap-2 text-xs text-sky-100">
              <span>{BUSINESS_INFO.name}</span>
              {currentStep < 5 && (
                <>
                  <span>•</span>
                  <span>{language === 'bn' ? `ধাপ ${currentStep} / ৪` : `Step ${currentStep} of 4`}</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        {currentStep < 5 && (
          <div className="w-full bg-slate-100 h-1">
            <div 
              className="bg-cyan-500 h-1 transition-all duration-300" 
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Service & Booking Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {t('service.select_subservice')}
                </label>
                <div className="space-y-2">
                  {subServices.map((sub, idx) => (
                    <label
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                        selectedSubService === sub
                          ? 'border-sky-500 bg-sky-50/70 text-slate-900 font-medium ring-1 ring-sky-400'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="subService"
                        checked={selectedSubService === sub}
                        onChange={() => setSelectedSubService(sub)}
                        className="mt-0.5 text-sky-600 focus:ring-sky-500"
                      />
                      <span>{sub}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Permanent Booking Option */}
              {service.permanentBookingAvailable && (
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                    <span>{t('service.booking_type')}</span>
                    <span className="text-[11px] font-normal text-slate-500">
                      {language === 'bn' ? 'আপনার সুবিধা অনুযায়ী বেছে নিন' : 'Choose preference'}
                    </span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Standard Booking */}
                    <div
                      onClick={() => setBookingType('standard')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        bookingType === 'standard'
                          ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-400'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        <Clock className="w-4 h-4 text-sky-600" />
                        <span>{t('service.standard_booking')}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        {t('service.standard_booking_desc')}
                      </p>
                    </div>

                    {/* Permanent Booking */}
                    <div
                      onClick={() => setBookingType('permanent')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        bookingType === 'permanent'
                          ? 'border-cyan-500 bg-cyan-50/70 ring-1 ring-cyan-400'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-800">
                        <Sparkles className="w-4 h-4 text-cyan-600" />
                        <span>{t('service.permanent_booking')}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        {t('service.permanent_booking_desc')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Overview Preview */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                  <FileText className="w-4 h-4 text-sky-600" />
                  <span>{t('service.required_documents')}</span>
                </h4>
                <p className="text-[11px] text-slate-600 mb-2">
                  {t('service.docs_instruction')}
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {service.requiredDocs.map((docDef) => (
                    <li key={docDef.id} className="flex items-start gap-2">
                      <span className="text-sky-600 font-bold">•</span>
                      <div>
                        <span className="font-medium text-slate-900">
                          {language === 'bn' ? docDef.nameBn : docDef.nameEn}
                        </span>{' '}
                        {docDef.isMandatory ? (
                          <span className="text-[10px] text-rose-600 bg-rose-50 px-1 py-0.2 rounded border border-rose-200 font-semibold">
                            {t('service.mandatory')}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">({t('service.optional')})</span>
                        )}
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {language === 'bn' ? docDef.descriptionBn : docDef.descriptionEn}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* STEP 2: Applicant Details */}
          {currentStep === 2 && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t('form.applicant_name')} *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Md Afran Ali"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t('form.applicant_phone')} *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-400 font-medium">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full pl-11 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {language === 'bn' ? 'সেন্টার থেকে আবেদনের বিষয়ে যোগাযোগের জন্য ব্যবহৃত হবে।' : 'Used by the centre to contact you regarding the status.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t('form.applicant_address')}
                </label>
                <textarea
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="e.g. Uttar Mahadebnagar, Farakka, West Bengal - 742202"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t('form.notes_label')}
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder={t('form.notes_placeholder')}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Document Upload */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-800 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 text-sky-600 mt-0.5" />
                <p>
                  {t('form.upload_instruction')} ({t('form.max_size')}).
                </p>
              </div>

              <div className="space-y-3">
                {service.requiredDocs.map((docDef) => {
                  const uploaded = uploadedDocs[docDef.id];
                  const progress = uploadProgress[docDef.id] || 0;
                  const docTitle = language === 'bn' ? docDef.nameBn : docDef.nameEn;
                  const docReason = language === 'bn' ? docDef.descriptionBn : docDef.descriptionEn;

                  return (
                    <div
                      key={docDef.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">{docTitle}</span>
                            {docDef.isMandatory ? (
                              <span className="text-[10px] text-rose-600 bg-rose-50 px-1 py-0.2 rounded font-semibold border border-rose-200">
                                {t('service.mandatory')}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500">({t('service.optional')})</span>
                            )}
                          </div>
                          {/* Reason explanation */}
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            <strong className="text-slate-600">{t('service.why_needed')}</strong> {docReason}
                          </p>
                        </div>

                        {uploaded && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            {t('form.file_uploaded')}
                          </span>
                        )}
                      </div>

                      {/* File upload input & status */}
                      <div className="mt-3">
                        {uploaded ? (
                          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                            <div className="flex items-center gap-2 truncate">
                              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="truncate text-slate-800 font-medium">{uploaded.fileName}</span>
                              <span className="text-[10px] text-slate-400">
                                ({(uploaded.fileSize / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <label className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 cursor-pointer ml-2 shrink-0">
                              <span>{language === 'bn' ? 'পরিবর্তন' : 'Change'}</span>
                              <input
                                type="file"
                                accept={docDef.acceptedFormats.join(',')}
                                onChange={(e) => handleFileUpload(docDef.id, docTitle, e)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-sky-300 bg-sky-50/40 hover:bg-sky-50 text-sky-800 text-xs font-semibold cursor-pointer transition-colors active:scale-99">
                            <Upload className="w-4 h-4 text-sky-600" />
                            <span>{t('form.choose_file')}</span>
                            <input
                              type="file"
                              accept={docDef.acceptedFormats.join(',')}
                              onChange={(e) => handleFileUpload(docDef.id, docTitle, e)}
                              className="hidden"
                            />
                          </label>
                        )}

                        {progress > 0 && progress < 100 && (
                          <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
                            <div className="bg-sky-500 h-1 rounded-full transition-all" style={{ width: `${progress}%` }} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Review & Consent */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                  {language === 'bn' ? 'আবেদনের সারাংশ' : 'Application Summary'}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-[11px] text-slate-500 block">{language === 'bn' ? 'পরিষেবা:' : 'Service:'}</span>
                    <strong className="text-slate-900">{serviceTitle}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">{language === 'bn' ? 'উপ-পরিষেবা:' : 'Sub-Service:'}</span>
                    <span className="text-slate-800">{selectedSubService}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">{language === 'bn' ? 'গ্রাহকের নাম:' : 'Applicant:'}</span>
                    <span className="text-slate-800">{customerName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">{language === 'bn' ? 'মোবাইল:' : 'Phone:'}</span>
                    <span className="text-slate-800">+91 {customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">{language === 'bn' ? 'বুকিং এর ধরন:' : 'Booking Type:'}</span>
                    <span className="font-semibold text-sky-700">
                      {bookingType === 'permanent' ? t('service.permanent_booking') : t('service.standard_booking')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">{language === 'bn' ? 'আপলোডকৃত নথি:' : 'Documents:'}</span>
                    <span className="text-slate-800">{Object.keys(uploadedDocs).length} {language === 'bn' ? 'টি নথি' : 'files'}</span>
                  </div>
                </div>
              </div>

              {/* Consent Box */}
              <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/60 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>{t('form.consent_title')}</span>
                </div>
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(e) => setConsentAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                  <span className="leading-relaxed">
                    {t('form.consent_text')}
                  </span>
                </label>
              </div>

              {!user && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                  {language === 'bn' 
                    ? 'আবেদন জমা দেওয়ার পূর্বে আপনার গুগল অ্যাকাউন্ট দ্বারা লগইন সম্পন্ন করতে হবে।' 
                    : 'Google Sign-In will be required to authenticate and store your application.'}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Success & Receipt */}
          {currentStep === 5 && createdApplicationId && (
            <div className="text-center py-3 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t('success.title')}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {BUSINESS_INFO.name} — {BUSINESS_INFO.landmark}
                </p>
              </div>

              {/* Application ID Card */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1">
                <span className="text-xs text-slate-400 font-medium">
                  {t('success.app_id')}
                </span>
                <div className="text-xl font-mono font-bold tracking-wider text-cyan-400">
                  {createdApplicationId}
                </div>
                <span className="inline-block text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full mt-1 border border-emerald-800">
                  {t('status.submitted')}
                </span>
              </div>

              {/* WhatsApp Notification Integration Status */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">
                    {t('success.whatsapp_status')}
                  </span>
                  <span className="text-[11px] text-amber-700 bg-amber-100 font-semibold px-2 py-0.5 rounded-md border border-amber-300">
                    {whatsappStatus === 'pending' ? t('success.pending_whatsapp') : t('success.sent_whatsapp')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {language === 'bn'
                    ? `সেন্টারের সাথে সরাসরি সংযুক্ত হতে ও দ্রুততম সেবা পেতে আপনার আবেদন স্লিপটি নিচে বোতাম টিপে হোয়াটসঅ্যাপে পাঠান (${BUSINESS_INFO.whatsapp})।`
                    : `To immediately notify the centre desk and get priority assistance, tap the button below to send your slip to official WhatsApp (${BUSINESS_INFO.whatsapp}).`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSendViaWhatsApp}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{t('success.send_wa_action')}</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
                >
                  {t('success.view_my_apps')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {currentStep < 5 && (
          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition min-h-[40px]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('form.back')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition min-h-[40px]"
              >
                {t('form.cancel')}
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition min-h-[40px] shadow-sm active:scale-98"
              >
                <span>{t('form.next')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitApplication}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 rounded-xl transition min-h-[40px] shadow-sm active:scale-98"
              >
                {submitting ? (
                  <span>{t('form.submitting')}</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>{t('form.submit_button')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
